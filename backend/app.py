import sys
import os
import datetime
from functools import wraps

# Automatically detect and use virtual environment packages if available
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
_venv_site_packages = os.path.join(BASE_DIR, '.venv', 'Lib', 'site-packages')
if os.path.exists(_venv_site_packages) and _venv_site_packages not in sys.path:
    sys.path.insert(0, _venv_site_packages)

from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import jwt

# Initialize Flask app
app = Flask(__name__)

# Configurations
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(BASE_DIR, 'hospital.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'hospital_super_secret_key_2026')

# Enable CORS (allow frontend to communicate with backend)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Initialize Database
db = SQLAlchemy(app)

# --- Database Models ---

class Admin(db.Model):
    __tablename__ = 'admins'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(120), nullable=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)


class Appointment(db.Model):
    __tablename__ = 'appointments'
    id = db.Column(db.Integer, primary_key=True)
    patient_name = db.Column(db.String(100), nullable=False)
    patient_email = db.Column(db.String(100), nullable=False)
    patient_phone = db.Column(db.String(20), nullable=False)
    doctor_name = db.Column(db.String(100), nullable=False)
    appointment_date = db.Column(db.String(50), nullable=False)
    appointment_time = db.Column(db.String(50), nullable=False)
    notes = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(20), default='Pending')
    created_at = db.Column(db.DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc))

    def to_dict(self):
        return {
            'id': self.id,
            'patient_name': self.patient_name,
            'patient_email': self.patient_email,
            'patient_phone': self.patient_phone,
            'doctor_name': self.doctor_name,
            'appointment_date': self.appointment_date,
            'appointment_time': self.appointment_time,
            'notes': self.notes,
            'status': self.status,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S') if self.created_at else None
        }


# --- Authentication Middleware ---

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        # Check authorization header
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            try:
                token = auth_header.split(" ")[1] # Bearer <token>
            except IndexError:
                return jsonify({'message': 'Invalid token format. Bearer <token> required.'}), 401

        if not token:
            return jsonify({'message': 'Authentication Token is missing!'}), 401

        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = Admin.query.filter_by(username=data['username']).first()
            if not current_user:
                return jsonify({'message': 'Invalid authentication token!'}), 401
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired! Please log in again.'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Token is invalid!'}), 401
        except Exception as e:
            return jsonify({'message': 'Authentication error: ' + str(e)}), 401

        return f(current_user, *args, **kwargs)

    return decorated


# --- API Routes ---

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'message': 'CarePlus Hospital API is operational.'}), 200


# Public Route to Book an Appointment
@app.route('/api/appointments', methods=['POST'])
def create_appointment():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'message': 'No input data provided.'}), 400

        required_fields = ['patient_name', 'patient_email', 'patient_phone', 'doctor_name', 'appointment_date', 'appointment_time']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'message': f'Field {field} is required.'}), 400

        new_appointment = Appointment(
            patient_name=data['patient_name'],
            patient_email=data['patient_email'],
            patient_phone=data['patient_phone'],
            doctor_name=data['doctor_name'],
            appointment_date=data['appointment_date'],
            appointment_time=data['appointment_time'],
            notes=data.get('notes', '')
        )

        db.session.add(new_appointment)
        db.session.commit()

        return jsonify({
            'message': 'Appointment successfully booked!',
            'appointment': new_appointment.to_dict()
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Error scheduling appointment.', 'error': str(e)}), 500


# Admin Login
@app.route('/api/admin/login', methods=['POST'])
def admin_login():
    data = request.get_json()
    if not data or not data.get('username') or not data.get('password'):
        return jsonify({'message': 'Username and password are required!'}), 400
        
    admin = Admin.query.filter_by(username=data['username']).first()
    
    if admin and admin.check_password(data['password']):
        # Generate token valid for 24 hours
        token = jwt.encode({
            'username': admin.username,
            'exp': datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=24)
        }, app.config['SECRET_KEY'], algorithm="HS256")
        
        return jsonify({
            'message': 'Login successful!',
            'token': token,
            'username': admin.username
        }), 200
        
    return jsonify({'message': 'Invalid username or password!'}), 401


# Route to fetch all appointments (Admin Only)
@app.route('/api/admin/appointments', methods=['GET'])
@token_required
def get_appointments(current_user):
    try:
        appointments = Appointment.query.order_by(Appointment.created_at.desc()).all()
        return jsonify([appt.to_dict() for appt in appointments]), 200
    except Exception as e:
        return jsonify({'message': 'Error retrieving appointments', 'error': str(e)}), 500


# Route to delete an appointment (Admin Only)
@app.route('/api/admin/appointments/<int:id>', methods=['DELETE'])
@token_required
def delete_appointment(current_user, id):
    try:
        appointment = db.session.get(Appointment, id)
        if not appointment:
            return jsonify({'message': 'Appointment not found!'}), 404
            
        db.session.delete(appointment)
        db.session.commit()
        return jsonify({'message': f'Appointment ID {id} deleted successfully!'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Error deleting appointment', 'error': str(e)}), 500


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        # Check if admin user exists, if not seed a default admin
        admin_user = Admin.query.filter_by(username='admin').first()
        if not admin_user:
            default_admin = Admin(username='admin')
            default_admin.set_password('admin123')
            db.session.add(default_admin)
            db.session.commit()
            print("Default admin account created: admin / admin123")

    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_DEBUG', '1') == '1'
    print(f"CarePlus Hospital Backend Server running on http://127.0.0.1:{port}")
    app.run(debug=debug, host='0.0.0.0', port=port)

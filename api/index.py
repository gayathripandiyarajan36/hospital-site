import os
import datetime
from functools import wraps

from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import jwt

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'hospital_secret_2026')

# --- In-memory storage (resets on cold start) ---
_admins = {}
_appointments = []
_next_id = 1


def _seed_admin():
    if 'admin' not in _admins:
        _admins['admin'] = {
            'username': 'admin',
            'password_hash': generate_password_hash('admin123')
        }


_seed_admin()


# --- Auth middleware ---
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            try:
                token = auth_header.split(" ")[1]
            except IndexError:
                return jsonify({'message': 'Invalid token format.'}), 401
        if not token:
            return jsonify({'message': 'Token missing!'}), 401
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            if data['username'] not in _admins:
                return jsonify({'message': 'Invalid token!'}), 401
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token expired!'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Invalid token!'}), 401
        return f(data['username'], *args, **kwargs)
    return decorated


# --- Routes ---
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'message': 'CarePlus API running on Vercel.'}), 200


@app.route('/api/appointments', methods=['POST'])
def create_appointment():
    global _next_id
    try:
        data = request.get_json()
        if not data:
            return jsonify({'message': 'No input data provided.'}), 400

        required = ['patient_name', 'patient_email', 'patient_phone', 'doctor_name', 'appointment_date', 'appointment_time']
        for field in required:
            if not data.get(field):
                return jsonify({'message': f'Field {field} is required.'}), 400

        appt = {
            'id': _next_id,
            'patient_name': data['patient_name'],
            'patient_email': data['patient_email'],
            'patient_phone': data['patient_phone'],
            'doctor_name': data['doctor_name'],
            'appointment_date': data['appointment_date'],
            'appointment_time': data['appointment_time'],
            'notes': data.get('notes', ''),
            'status': 'Pending',
            'created_at': datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%d %H:%M:%S')
        }
        _next_id += 1
        _appointments.append(appt)

        return jsonify({'message': 'Appointment booked!', 'appointment': appt}), 201
    except Exception as e:
        return jsonify({'message': 'Error booking appointment.', 'error': str(e)}), 500


@app.route('/api/admin/login', methods=['POST'])
def admin_login():
    data = request.get_json()
    if not data or not data.get('username') or not data.get('password'):
        return jsonify({'message': 'Username and password required!'}), 400

    admin = _admins.get(data['username'])
    if admin and check_password_hash(admin['password_hash'], data['password']):
        token = jwt.encode({
            'username': admin['username'],
            'exp': datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=24)
        }, app.config['SECRET_KEY'], algorithm="HS256")
        return jsonify({'message': 'Login successful!', 'token': token, 'username': admin['username']}), 200

    return jsonify({'message': 'Invalid username or password!'}), 401


@app.route('/api/admin/appointments', methods=['GET'])
@token_required
def get_appointments(current_user):
    return jsonify(sorted(_appointments, key=lambda x: x['created_at'], reverse=True)), 200


@app.route('/api/admin/appointments/<int:id>', methods=['DELETE'])
@token_required
def delete_appointment(current_user, id):
    global _appointments
    for i, appt in enumerate(_appointments):
        if appt['id'] == id:
            _appointments.pop(i)
            return jsonify({'message': f'Appointment {id} deleted!'}), 200
    return jsonify({'message': 'Appointment not found!'}), 404

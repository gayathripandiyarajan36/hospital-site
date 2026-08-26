import unittest
import json
import os
import tempfile
from app import app, db, Admin, Appointment

class HospitalAPITestCase(unittest.TestCase):
    def setUp(self):
        # Configure app for testing
        app.config['TESTING'] = True
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:' # Use in-memory DB for tests
        app.config['SECRET_KEY'] = 'test_secret'
        self.app = app.test_client()
        
        # Create tables and seed admin
        with app.app_context():
            db.create_all()
            # Clear existing data to ensure fresh state for each test
            db.session.query(Appointment).delete()
            db.session.query(Admin).delete()
            db.session.commit()
            
            admin = Admin(username='admin')
            admin.set_password('admin123')
            db.session.add(admin)
            db.session.commit()

    def tearDown(self):
        with app.app_context():
            db.session.remove()
            db.drop_all()

    def test_health_check(self):
        response = self.app.get('/api/health')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data['status'], 'healthy')

    def test_create_appointment(self):
        payload = {
            'patient_name': 'John Doe',
            'patient_email': 'john@example.com',
            'patient_phone': '1234567890',
            'doctor_name': 'Dr. House',
            'appointment_date': '2026-09-01',
            'appointment_time': '10:00 AM',
            'notes': 'Regular checkup'
        }
        response = self.app.post('/api/appointments',
                                 data=json.dumps(payload),
                                 content_type='application/json')
        self.assertEqual(response.status_code, 201)
        data = json.loads(response.data)
        self.assertIn('appointment', data)
        self.assertEqual(data['appointment']['patient_name'], 'John Doe')
        self.assertEqual(data['appointment']['status'], 'Pending')

    def test_admin_login(self):
        # Test valid login
        payload = {'username': 'admin', 'password': 'admin123'}
        response = self.app.post('/api/admin/login',
                                 data=json.dumps(payload),
                                 content_type='application/json')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIn('token', data)
        self.assertEqual(data['username'], 'admin')

        # Test invalid login
        payload = {'username': 'admin', 'password': 'wrongpassword'}
        response = self.app.post('/api/admin/login',
                                 data=json.dumps(payload),
                                 content_type='application/json')
        self.assertEqual(response.status_code, 401)

    def test_admin_get_appointments(self):
        # Create an appointment
        with app.app_context():
            appt = Appointment(
                patient_name='Jane Smith',
                patient_email='jane@example.com',
                patient_phone='0987654321',
                doctor_name='Dr. Strange',
                appointment_date='2026-09-02',
                appointment_time='11:00 AM'
            )
            db.session.add(appt)
            db.session.commit()

        # Login to get token
        login_res = self.app.post('/api/admin/login',
                                  data=json.dumps({'username': 'admin', 'password': 'admin123'}),
                                  content_type='application/json')
        token = json.loads(login_res.data)['token']

        # Get appointments without token (should fail)
        response = self.app.get('/api/admin/appointments')
        self.assertEqual(response.status_code, 401)

        # Get appointments with token (should succeed)
        response = self.app.get('/api/admin/appointments',
                                headers={'Authorization': f'Bearer {token}'})
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]['patient_name'], 'Jane Smith')

    def test_admin_delete_appointment(self):
        # Create an appointment
        with app.app_context():
            appt = Appointment(
                patient_name='Delete Me',
                patient_email='delete@example.com',
                patient_phone='1112223333',
                doctor_name='Dr. Grey',
                appointment_date='2026-09-03',
                appointment_time='02:00 PM'
            )
            db.session.add(appt)
            db.session.commit()
            appt_id = appt.id

        # Login to get token
        login_res = self.app.post('/api/admin/login',
                                  data=json.dumps({'username': 'admin', 'password': 'admin123'}),
                                  content_type='application/json')
        token = json.loads(login_res.data)['token']

        # Delete with invalid ID
        response = self.app.delete(f'/api/admin/appointments/9999',
                                   headers={'Authorization': f'Bearer {token}'})
        self.assertEqual(response.status_code, 404)

        # Delete with valid ID
        response = self.app.delete(f'/api/admin/appointments/{appt_id}',
                                   headers={'Authorization': f'Bearer {token}'})
        self.assertEqual(response.status_code, 200)

        # Verify deleted in DB
        with app.app_context():
            deleted_appt = Appointment.query.get(appt_id)
            self.assertIsNone(deleted_appt)

if __name__ == '__main__':
    unittest.main()

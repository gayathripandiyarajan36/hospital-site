@echo off
title CarePlus Hospital - Setup
color 0A
echo.
echo  ======================================
echo   CarePlus Hospital - First Time Setup
echo  ======================================
echo.

:: Setup Backend
echo [1/3] Setting up Python backend...
cd backend
if not exist ".venv" (
    echo      Creating virtual environment...
    python -m venv .venv
)
call .venv\Scripts\activate.bat
echo      Installing Python packages...
pip install -r requirements.txt -q
cd ..
echo      Backend setup complete!
echo.

:: Setup Frontend (now at root)
echo [2/3] Setting up React frontend...
echo      Installing npm packages...
call npm install --silent
echo      Frontend setup complete!
echo.

:: Seed admin account
echo [3/3] Seeding default admin account...
cd backend
call .venv\Scripts\activate.bat
python -c "from app import app, db, Admin; app.app_context().push(); db.create_all(); a=Admin.query.filter_by(username='admin').first(); 
if not a: a=Admin(username='admin'); a.set_password('admin123'); db.session.add(a); db.session.commit(); print('Default admin created: admin / admin123')
else: print('Admin already exists, skipping.')"
cd ..
echo.

echo  ======================================
echo   Setup Complete! Now run start.bat
echo  ======================================
echo.
pause

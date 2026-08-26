@echo off
title CarePlus Hospital - Starting...
color 0B
echo.
echo  ======================================
echo   CarePlus Hospital - Starting App...
echo  ======================================
echo.

:: Check if venv exists
if not exist "backend\.venv" (
    echo [!] Backend not set up. Running setup first...
    call setup.bat
)

:: Start Backend in a new window
echo [*] Starting Backend (Flask on port 5000)...
start "CarePlus Backend" cmd /k "cd backend && call .venv\Scripts\activate.bat && python app.py"

:: Wait a moment for backend to initialize
timeout /t 3 /nobreak >nul

:: Start Frontend in a new window
echo [*] Starting Frontend (Vite on port 5173)...
start "CarePlus Frontend" cmd /k "cd /d "%~dp0" && npm run dev"

:: Wait for servers to start
timeout /t 4 /nobreak >nul

echo.
echo  ======================================
echo   Both servers are running!
echo  ======================================
echo   Frontend : http://localhost:5173
echo   Backend  : http://localhost:5000
echo  ======================================
echo.
echo   Admin Login:  admin / admin123
echo.
echo   Close this window or press Ctrl+C to stop.
echo  ======================================
echo.

:: Keep this window alive and show status
:loop
timeout /t 30 /nobreak >nul
goto loop

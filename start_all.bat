@echo off
title Start CarePlus Hospital (Full Stack)
echo ==============================================
echo   Starting CarePlus Hospital Application
echo ==============================================
echo.

start "CarePlus Backend (Flask)" cmd /k "cd /d %~dp0backend && python app.py"
timeout /t 2 /nobreak >nul
start "CarePlus Frontend (Vite React)" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo Both Frontend and Backend started!
echo Frontend: http://localhost:5173/
echo Backend:  http://localhost:5000/
echo.
pause

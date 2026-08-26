@echo off
title CarePlus Hospital - Stopping...
echo.
echo [*] Stopping CarePlus servers...
taskkill /FI "WindowTitle eq CarePlus Backend*" /T /F >nul 2>&1
taskkill /FI "WindowTitle eq CarePlus Frontend*" /T /F >nul 2>&1
echo [✓] All servers stopped.
echo.
pause

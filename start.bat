@echo off
echo Starting Backend...
start "Backend" cmd /k "cd /d D:\CRM\backend && node server.js"

timeout /t 2 >nul

echo Starting Frontend...
start "Frontend" cmd /k "cd /d D:\CRM\frontend && npm start"

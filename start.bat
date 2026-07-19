@echo off
echo Starting Backend (Spring Boot on port 8080)...
start "Backend" cmd /k "cd /d ""%~dp0backend"" && apache-maven-3.9.6\bin\mvn.cmd spring-boot:run"

echo Waiting for backend to start...
timeout /t 15 /nobreak >nul

echo Starting Frontend (Vite on port 5173)...
start "Frontend" cmd /k "cd /d ""%~dp0frontend"" && node node_modules\vite\bin\vite.js"

echo.
echo Both servers are starting...
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:8080
echo.
timeout /t 5 /nobreak >nul
start http://localhost:5173

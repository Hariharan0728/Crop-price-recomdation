@echo off
REM Frontend startup script with proper path handling
pushd "%~dp0frontend"
echo Starting Vite on http://localhost:5173...
node node_modules\vite\bin\vite.js
popd
pause

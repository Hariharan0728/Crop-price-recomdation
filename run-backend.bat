@echo off
REM Backend startup script with proper path handling
pushd "%~dp0backend"
echo Starting Spring Boot on http://localhost:8080...
call apache-maven-3.9.6\bin\mvn.cmd spring-boot:run
popd
pause

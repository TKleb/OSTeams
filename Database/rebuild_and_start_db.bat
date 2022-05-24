@echo off
setlocal
set COMPOSE_DOCKER_CLI_BUILD=1
set DOCKER_BUILDKIT=1
docker-compose rm -sf db
call powershell -command "docker volume rm $(docker volume ls -f name=.*postgres-db -q) --force"
docker-compose up --build -d pgadmin db
echo Starting database and admin panel...
timeout 3 /nobreak > nul
docker-compose logs db
echo.
echo Check the startup log above.
echo Press any key to exit. Containers will keep running if started correctly.
pause > nul
exit /b

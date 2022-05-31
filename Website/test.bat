:: Start website & database in test configuration, run tests.

@echo off
setlocal
set COMPOSE_DOCKER_CLI_BUILD=1
set DOCKER_BUILDKIT=1
set TARGET=test
docker-compose rm -sf db
call powershell -command "docker volume rm $(docker volume ls -f name=.*postgres-db -q) --force"
cd .. && docker-compose up --build web

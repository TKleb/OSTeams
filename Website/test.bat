:: Start website & database in test configuration, run tests.

@echo off
setlocal
set COMPOSE_DOCKER_CLI_BUILD=1
set DOCKER_BUILDKIT=1
set TARGET=test
cd .. && docker-compose up --build web

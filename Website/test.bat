:: Start website & database in test configuration, run tests.

:: $Env:TARGET='test'

set TARGET=test
cd .. && docker-compose up --build web
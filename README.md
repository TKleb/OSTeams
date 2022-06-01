# OS Teams

## Helpful info
- The [Database](Database/) folder includes a rebuild script that completely resets the database and starts it from scratch (as well as running all database tests on startup).
- The [Website](Website/) folder includes a test script that resets the database and runs all website unit/integration tests.
- The website is live at [https://osteams.site](https://osteams.site)
- To start the website locally, run: `docker-compose up --build`
- Valid default login (if TARGET is set to `development`): `default.user@ost.ch` `password`

## Portainer launch configuration
```bash
sudo docker run -d \
    -p 8000:8000 \
    -p 9000:9000 \
    --name=portainer \
    --restart=always \
    -v /var/run/docker.sock:/var/run/docker.sock \
    -v portainer_data:/data \
    -v /etc/localtime:/etc/localtime:ro \
    portainer/portainer-ce:latest
```

## Available environment variables
```bash
TARGET=development

DB_DNS_NAME=database
DB_DATABASE=osteams
DB_PORT=5432
DB_BACKEND_USER=backend
DB_BACKEND_PASSWORD=mybackendpassword
DB_ADMIN_USER=admin
DB_ADMIN_PASSWORD=myadminpassword

DOMAIN=localhost

EMAIL_PASSWORD=mypassword
EMAIL_SERVICE=Hotmail
EMAIL_ADDRESS=myemail@hotmail.com
```

## Internal Links
- [Available Database Functions](./Database/functionsInfo.md)

## Relevant Links
- [Documentation](https://gitlab.ost.ch/SEProj/2022-FS/g06-osteams/latex-documentation-template)
- [Jira](https://osteams.atlassian.net/browse/OS)
- [Latest Checklist](https://drive.switch.ch/index.php/s/cVkNM4ybVe6rooA)

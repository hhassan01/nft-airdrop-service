# For local development

This repo will spin up a local postgresql database and pgadmin for this project. It will also populate the tables with the current DB schema and some test data.

## Run the following command to start the containers:

`docker compose up`

## Chek pgAdmin
- http://localhost:8000
- Click on Add new server
- On "General" Tab, fill Name with Nft Airdrops
- On "Connection" Tab, fill Host name/address with airdrops_db
- On "Connection" Tab, fill Username with airdrops
- On "Connection" Tab, fill Password with password
- Click on Save

## Check the database
- http://localhost:54322

## Remove docker container 
`docker compose down`

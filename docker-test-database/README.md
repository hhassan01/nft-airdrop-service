# Somnia Quest Test DB for local development

This repo will spin up a local postgresql database and pgadmin for the Somnia Quest project. It will also populate the tables with the current DB schema and some test data.

## Run the following command to start the containers:

`docker compose up`

## Chek pgAdmin
- http://localhost:8000
- Click on Add new server
- On "General" Tab, fill Name with Somnia Quest
- On "Connection" Tab, fill Host name/address with somnia_quest_db [fix: should be 'somnia_db']
- On "Connection" Tab, fill Username with somnia_quest [fix: should be 'somnia']
- On "Connection" Tab, fill Password with postgres [fix: should be 'password']
- Click on Save

## Check the database
- http://localhost:54322

## Remove docker container 
`docker compose down`

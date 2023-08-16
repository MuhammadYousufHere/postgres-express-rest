# run docker postgres

docker run -p 5432:5432 -d postgres --name postgres-container -e POSTGRES_PASSWORD=mysecret -e POSTGRES_DB=postgresdb -e POSTGRES_USER=postgresuser -v postgres_data:/var/lib/postgresql/data postgres

# create volume to persist the data

docker volume create postgres_data

# Retrive env

docker exec postgres-container env

# access shell

docker exec -it postgres-container bash

# Verify db is running

ps -ef | grep postgres

# Connecting the db

psql -h /tmp/ dbname

# inspect docker container

docker inspect hashcontianerofpostgres

-===============================

# check instance of db

docker-compose run container-name bash
psql --host=container-name --username=ali --dbname=my-pg-db

ctlr + d x 2 get get out

# list all database available

psql -l

# command to connect to psql

psql <databaseName> <usernamePostgresql>

# boardGameComplexityCompare

## Running the code

First, run `docker-compose up --build` that should start up all the servers. You will most likely get a error from the backend complaining about a missing database or something.   
  
Log into myphpadmin on port 30002 and head to the sql page. Run the following to authorize the backend to edit the database. `GRANT ALL PRIVILEGES ON *.* TO 'moeuser';`. While you are there run `games.sql` and `compare.sql` by copy and pasting them or importing them into your moe_db. You must do it in that order or it will not work, if you do it out of order you will have to delete the compare table and do the games table first. After that, restart your docker and you should be up and running, make sure to restart the docker after every change.

You can connect to the various services using the various ports  
myphpadmin: 30002  
reactfrontend:30001  
expressbackend: 8080  

## Running the code in REPL mode

If you plan on doing alot of devolopment I recomend you run the code differently.

Install the relevant modules
`npm i`  
Repeat the process for the front end
`cd client`  
`npm i`  
Start the front end
`npm run start`  

Open a new window
`npm run dev`  

You then want a mysql instace running with two databases with the schemas of `games` and `compare`. Adjust the settings to connect to the db at /src/models/db.ts

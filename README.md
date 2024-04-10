# 3005-Proj

1) Download node.js
- https://nodejs.org/en/download

2) in a terminal go to the project directory and enter "**npm install**" to download all dependencies

3) Add a .env file into the project directory with the template:
   ```
   USER=postgres
   PASSWORD=<PASSWORD>
   HOST=localhost
   PORT=5432
   DATABASE=<DATABASE_NAME>
   ```
   Most likely you will only need to changed the PASSWORD and DATABASE(the name of database) variable.
   This .env is very important and needed to connect to the database. Make sure to follow template and properly define variables

5) The setup-database.js script will run the DML.sql and DDL.sql files whenever the database that is connected to does not contain all the needed tables.
  - ex: If there are no tables at all run DML.sql and DDL.sql
  - ex: If there is only a members table then it will not run the DML.sql and DDL.sql 
So make sure you dont partially have some of the tables. Have a empty database for safety. 

5) Then run the server by doing "**node server.js**"

6) Go to a broswer and enter **http://localhost:3000/**
 - We have the server listen on port 3000

Demo Video: https://youtu.be/DswULL5D6qU?si=tw9Xmc1zGRoCwMQa

// Import required modules
const { Client } = require('pg');
const bcrypt = require('bcrypt');

//paths for the ddl and dml file
const ddlFilePath = "/SQL/DDL.dql"
const dmlFilePath = "/SQL/DML.dql"

//client will connect to postgres server by using info from .envs
const client = new Client({
    user: process.env.USER,
    password: process.env.PASSWORD,
    host: process.env.HOST,
    port: process.env.PORT,
    database: process.env.DATABASE
})

client.connect()
.then(() => {
    console.log("Script onnected to PostgresSQL database")
})
.catch((err)=> {
    console.error("Script had error connecting to PostgreSQL database" , err)
});

// Function to initialize database tables
async function initializeDatabase() {
    try {                                              
        const tableNames = ["members", "trainers", "admins", "rooms", "equipments", "availabilities", "bookedsessions", "bills", "fitnessGoals", "callMaintenance"];

        //looping each table name to check if each exists in the database. If all of them are not then proceed.
        for(const tableName of tableNames){
            const exists = await checkTableExists(tableName)
            if(exists){
                console.log("One or more of the tables needed are already defined in the database. Therefore ddl and dml files will not be used.");
            }
        }

    } catch (error) {
        console.log("error happened")
        //console.error('Error initializing database:', error);
    }
    finally{
        await client.end();
    }
}

// Function to check if a table exists in the database
async function checkTableExists(tableName) {
    const query = `SELECT EXISTS(SELECT relname FROM pg_class WHERE relname = LOWER($1))`;
    const result = await client.query(query, [tableName]);
    return result.rows[0].exists;
}

// Call the initializeDatabase function when the script is executed
initializeDatabase();
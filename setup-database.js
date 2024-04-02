// Import required modules
const { Client } = require('pg');
const bcrypt = require('bcrypt');
const fs = require('fs');

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
    console.log("Script connected to PostgresSQL database")
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
                console.log("One or more of the required tables are already defined in the database. Therefore no action to setup database will take place.");
                return;
            }
        }

        console.log("All required tables don't exist, therefore database will be setup with tables and data.")
        await runDDLFile();
        await runDMLFile();
        await hashPasswords();

    } catch (error) {
        console.error('Error initializing database:', error);
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

//executes the query in the DDL.sql file into the database specified in the .env file
async function runDDLFile(){
    try {                                              
        //setting up stream and data
        const data = fs.readFileSync("SQL/DDL.sql")

        await client.query(String(data));
    }
    catch(err){
        console.error("Error running DDL file:", err);
    }
}

//executes the query in the DML.sql file into the database specified in the .env file
async function runDMLFile(){
    try {                                              
        try {                                              
            //setting up stream and data
            const data = fs.readFileSync("SQL/DML.sql")
    
            await client.query(String(data));
        }
        catch(err){
            console.error("Error running DDL file:", err);
        }
    }
    catch(err){
        console.error("Error running DML file:", err);
    }
}

async function hashPasswords(){
    try {                                              
        // get the id and passwords from members
        const m_query = 'SELECT member_id, password FROM members';
        const m_result = await client.query(m_query);

        // Loop through every member and update hashed password
        for (const member of m_result.rows) {
            const hashedPassword = await bcrypt.hash(member.password, 10);
            const updateQuery = 'UPDATE members SET password = $1 WHERE member_id = $2';
            await client.query(updateQuery, [hashedPassword, member.member_id]);
        }

        // get the id and passwords from trainers
        const t_query = 'SELECT trainer_id, password FROM trainers';
        const t_result = await client.query(t_query);

        // Loop through every trainer and update hashed password
        for (const trainer of t_result.rows) {
            const hashedPassword = await bcrypt.hash(trainer.password, 10);
            const updateQuery = 'UPDATE trainers SET password = $1 WHERE trainer_id = $2';
            await client.query(updateQuery, [hashedPassword, trainer.trainer_id]);
        }

        // get the id and passwords from admins
        const a_query = 'SELECT admin_id, password FROM admins';
        const a_result = await client.query(a_query);

        // Loop through every admin and update hashed password
        for (const admin of a_result.rows) {
            const hashedPassword = await bcrypt.hash(admin.password, 10);
            const updateQuery = 'UPDATE admins SET password = $1 WHERE admin_id = $2';
            await client.query(updateQuery, [hashedPassword, admin.admin_id]);
        }
        
    }
    catch(err){
        console.error("Error running DML file:", err);
    }
}

// Call the initializeDatabase function when the script is executed
initializeDatabase();
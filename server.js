//check dependencies
require('dotenv').config();
const express = require("express")
const {Client} = require('pg')

//app and port to listen 
const app = express()
const PORT = 3000; 

//client will connect to postgres server by using info from .envs
const client = new Client({
    user: process.env.USER,
    password: process.env.PASSWORD,
    host: process.env.HOST,
    port: process.env.PORT,
    database: process.env.DATABASE
})

//Static files, that do not require any server-side processing/dynamic content generation. They remain constant until altered by dev. 
app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/js', express.static(__dirname + 'public/js'))
app.use('/img', express.static(__dirname + 'public/img'))

//set Views 
app.set('views', './views')
app.set('view engine', 'ejs')

//give different pages depending on path
app.get('', (req,res) => {
    res.render('index', {text: 'This is EJS'})
});

app.get('/about', (req,res) => {
    res.render('about', {text: 'About Page'})
});


client.connect()
.then(() => {
    console.log("Connected to PostgresSQL databse")
})
.catch((err)=> {
    console.error("Error connecting to PostgreSQL database" , err)
});

client.query('SELECT * From students', (err,res) => {
    if(!err){
        console.log('Query result:', res.rows);
    }
    else {
        console.log('Error executing query', err.message);
    }
})

client.end;


//listen on PORT 
app.listen(PORT, () => {
    console.log("Listening on port " + PORT)
});

//check dependencies
require('dotenv').config();
const express = require("express")
const bcrypt = require('bcrypt')
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

client.connect()
.then(() => {
    console.log("Connected to PostgresSQL databse")
})
.catch((err)=> {
    console.error("Error connecting to PostgreSQL database" , err)
});

//Static files, that do not require any server-side processing/dynamic content generation. They remain constant until altered by dev. 
app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/js', express.static(__dirname + 'public/js'))
app.use('/img', express.static(__dirname + 'public/img'))
//send details from front end to our server
app.use(express.urlencoded({extended: false}));

//set Views 
app.set('views', './views')
app.set('view engine', 'ejs')


//give different pages depending on path

//choosing if you are a member, trainer, or admin and sent to the chosen login page
app.get('', (req,res) => {
    res.render('index')
});

//member paths 
app.get('/member-login', (req,res) => {
    res.render('member-login')
});
app.get('/member', (req,res) => {
    res.render('member-dashboard')
});

//trainer paths
app.get('/trainer-login', (req,res) => {
    res.render('trainer-login')
});
app.get('/trainer', (req,res) => {
    res.render('trainer-dashboard')
});

//admin paths
app.get('/admin-login', (req,res) => {
    res.render('admin-login')
});
app.get('/admin', (req,res) => {
    res.render('admin-dashboard')
});

//used when user wants to make a account
app.get('/register', (req,res) => {
    res.render('register')
});

//handling post requests
app.post("/member-login", (req,res) => {
    let {email, password} = req.body; 
    console.log({email,password})

});


//handles if a user wants to register 
app.post("/register", async (req,res) => {
    let {first_name, last_name, email, password, confirm_password} = req.body;
    let errors = [];

    console.log({
        first_name,
        last_name,
        email,
        password,
        confirm_password 
    })

    //checking for all possible errors that can occur, currently I only have one thing to check
    //checking if passwords match
    if(password != confirm_password){
        console.log("wrong passwords")
        errors.push({message: "Your password seems to be inconsistent. Please enter same password twice."});
    }

    //tell the client of possible errors 
    if(errors.length > 0) {
        console.log("I found error");
        res.render("register", {errors});
    }
    //passenger has put the proper information to register an account
    else{
        try{
            let hashed_password = await bcrypt.hash(password, 10); 

            //checking to see if the email is already in members table, if so then reject account creation
            //else make account
            const queryResult = client.query("SELECT * FROM MEMBERS WHERE UPPER(email) = UPPER($1)", [email]);
            if((await queryResult).rows.length >= 1){
                errors.push({message: "Email already registered."});
                res.render("register", {errors});
            }
            else{
                //creating the account
                console.log("Time to create an account")
                client.query("INSERT INTO Members(first_name, last_name, email, password) VALUES  ($1, $2, $3, $4)", [first_name, last_name, email, hashed_password]);
                return res.redirect("/member-login");
            }
        }
        catch(err){
            console.error("Error:", err);
            return res.render("error", {message: "An error occurred. Please try again."});
        }
    }
});

//listen on PORT 
app.listen(PORT, () => {
    console.log("Listening on port " + PORT)
});

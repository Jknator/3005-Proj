//check dependencies
require('dotenv').config();
const express = require("express")
const bcrypt = require('bcrypt')
const flash = require('connect-flash');
const session = require('express-session');
const setupDatabase = require('./setup-database');
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
    console.log("Connected to PostgresSQL database")
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

app.use(session({
    secret: "random-secret",
    saveUninitialized: true,
    resave: true
}));
app.use(flash());
app.use(function(req, res, next){
    res.locals.messages = req.flash();
    next();
})

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


//handles if a user wants to register 
app.post("/register", async (req,res) => {
    let {first_name, last_name, email, password, confirm_password} = req.body;

    //checking for all possible errors that can occur, currently I only have one thing to check
    //checking if passwords match
    if(password != confirm_password){
        console.log("passwords dont match")
        req.flash("error", 'Password must match!')
        return res.redirect("/register");
    }
    
    //passenger has put the proper information to register an account
    try{
        let hashed_password = await bcrypt.hash(password, 10); 

        //checking to see if the email is already in members table, if so then reject account creation
        //else make account
        const queryResult = await client.query("SELECT * FROM MEMBERS WHERE UPPER(email) = UPPER($1)", [email]);
        if((await queryResult).rows.length >= 1){
            console.log("email not unique")
            req.flash("error", 'Email already registered.')
            return res.redirect("/register");
        }
        else{
            //creating the account
            console.log("Making account")
            client.query("INSERT INTO Members(first_name, last_name, email, password) VALUES  ($1, $2, $3, $4)", [first_name, last_name, email, hashed_password]);
            return res.redirect("/member-login");
        }
    }
    catch(err){
        console.error("Error:", err);
        //return res.render("error", {message: "An error occurred. Please try again."});
    }
    
});

//handles how members log in to personal dashboards
app.post("/member-login", async (req,res) => {
    let {email, password} = req.body;
    try{
        const queryResult = await client.query("SELECT * FROM members WHERE UPPER(email) = UPPER($1)", [email]);
        
        if((queryResult).rows.length >= 1){
            const member = queryResult.rows[0];
            const password_matches = await bcrypt.compare(password, member.password);

            if(password_matches){
                return res.redirect("/member");
            }
            else{
                console.log("Incorrect password");
                req.flash("error", "Incorrect password")
                return res.redirect("/member-login");
            }
        }
        else{
            console.log("Member does not exist");
            req.flash("error", "Member does not exist")
            return res.redirect("/member-login");
        }
    }
    catch(err){
        console.error("Error:", err);
        //req.flash("error", "User does not exist")
        //return res.redirect("/member-login");
    }
});

//handles how trainers log in to personal dashboards
app.post("/trainer-login", async (req,res) => {
    let {email, password} = req.body;
    try{
        const queryResult = await client.query("SELECT * FROM trainers WHERE UPPER(email) = UPPER($1)", [email]);
        
        if((queryResult).rows.length >= 1){
            const trainer = queryResult.rows[0];
            const password_matches = await bcrypt.compare(password, trainer.password);

            if(password_matches){
                return res.redirect("/trainer");
            }
            else{
                console.log("Incorrect password");
                req.flash("error", "Incorrect password")
                return res.redirect("/trainer-login");
            }
        }
        else{
            console.log("Trainer does not exist");
            req.flash("error", "Trainer does not exist")
            return res.redirect("/trainer-login");
        }
    }
    catch(err){
        console.error("Error:", err);
        //req.flash("error", "User does not exist")
        //return res.redirect("/member-login");
    }
});


//handles how admins log in to personal dashboards
app.post("/admin-login", async (req,res) => {
    let {email, password} = req.body;
    try{
        const queryResult = await client.query("SELECT * FROM admins WHERE UPPER(email) = UPPER($1)", [email]);
        
        if((await queryResult).rows.length >= 1){
            const admin = queryResult.rows[0];
            const password_matches = await bcrypt.compare(password, admin.password);

            if(password_matches){
                return res.redirect("/admin");
            }
            else{
                console.log("Incorrect password");
                req.flash("error", "Incorrect password")
                return res.redirect("/admin-login");
            }
        }
        else{
            console.log("Admin does not exist");
            req.flash("error", "Admin does not exist")
            return res.redirect("/admin-login");
        }
    }
    catch(err){
        console.error("Error:", err);
        //req.flash("error", "User does not exist")
        //return res.redirect("/member-login");
    }
});

//listen on PORT 
app.listen(PORT, () => {
    console.log("Listening on port " + PORT)
});

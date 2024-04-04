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
    saveUninitialized: false,
    resave: false
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
app.get('/member', async (req,res) => {
    try{
        const member = req.session.member;
        if (!member) {
            return res.redirect("/member-login");
        }
        const results = await client.query("SELECT * FROM FitnessGoals WHERE member_id = $1", [member.member_id]);
        const fitnessGoals = results.rows;
        res.render('member-dashboard', {member: member, fitnessGoals: fitnessGoals});
    }
    catch(err){
         console.error(err)
        //most likely server closed and member no longer is in session. So just redirect to login page
        res.redirect("/member-login")
    }
});

//trainer paths
app.get('/trainer-login', (req,res) => {
    res.render('trainer-login')
});
app.get('/trainer', async (req,res) => {
    try{
        const trainer = req.session.trainer;
        if (!trainer) {
            return res.redirect("/trainer-login");
        }
        //query that returns the avaialbities ordered by the day. sadly there is no inbuilt thing so I had to manually write this horrendous query
        const result1 = await client.query("SELECT * FROM Availabilities WHERE trainer_id = $1 ORDER BY CASE WHEN day = 'Monday' THEN 1  WHEN day = 'Tuesday' THEN 2 WHEN day = 'Wednesday' THEN 3  WHEN day = 'Thursday' THEN 4  WHEN day = 'Friday' THEN 5  WHEN day = 'Saturday' THEN 6 WHEN day = 'Sunday' THEN 7 END;", [trainer.trainer_id]);
        const availabilities = result1.rows;

        const result2 = await client.query("SELECT * FROM Members ORDER BY first_name");
        const members = result2.rows;

        res.render('trainer-dashboard', {trainer: trainer, members: members, availabilities: availabilities});
    }
    catch(err){
        console.error(err)
        //most likely server closed and member no longer is in session. So just redirect to login page
        res.redirect("/trainer-login")
    }
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
                //update the member in the session
                req.session.member = member;
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
                req.session.trainer = trainer;
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

//handing all post requests from member-dashboard
app.post("/member", async (req,res) => {

    //change details of the member
    if(req.body.id == "account-form"){
        let {first_name, last_name, email, height, weight, old_password, new_password, confirm_password} = req.body;
        try{
            const queryResult = await client.query("SELECT * FROM members WHERE UPPER(email) = UPPER($1)", [email]);
            const member = queryResult.rows[0];
            
            //password is being changed if user entered new password 
            if(old_password && new_password && confirm_password){
                //check if passwords match 
                const password_matches = await bcrypt.compare(old_password, member.password);

                if(confirm_password == new_password && password_matches){
                    const hashedPassword = await bcrypt.hash(new_password, 10);
                    const updatePasswordQuery = 'UPDATE members SET password = $1 WHERE member_id = $2';
                    await client.query(updatePasswordQuery, [hashedPassword, member.member_id]);
                }
                else{
                    console.log("Member did not properly fill passwords section");
                    req.flash("error", "Error: either password was wrong or new passwords did not match!")
                    return res.redirect('/member');
                }
            }
    
            const updateQuery = 'UPDATE members SET first_name = $1, last_name = $2, height = $3, weight = $4 WHERE member_id = $5';
            await client.query(updateQuery, [first_name, last_name, height, weight, member.member_id]);

            //refresh the member and update member inforamtion to the session
            const queryResult2 = await client.query("SELECT * FROM members WHERE UPPER(email) = UPPER($1)", [email]);
            const member2 = queryResult2.rows[0];
            req.session.member = member2;
            return res.redirect('/member');

        }
        catch(err){
            console.error("Error:", err);
            //req.flash("error", "User does not exist")
            //return res.redirect("/member-login");
        }
    }
    //adding a new fitness goal
    else if(req.body.id == "adding_new_fitness_goal"){
        try{
            let {fitness_goal, goal_deadline, member_id} = req.body;

            //checking if the fitness_goal is to large
            if(fitness_goal.length > 200){
                console.log("Fitness goal is to long!");
                req.flash("test", "Error: fitness goal is too long!")
                return res.redirect('/member');
            }
            //check to see if fitness_goal and member_id form a unique key
            const checkUnique = client.query("SELECT * FROM FitnessGoals WHERE goal_type = $1 AND member_id = $2", [fitness_goal, member_id]);
            if((await checkUnique).rows.length != 0){
                console.log("Fitness goal is not unique!");
                req.flash("test", "Error: fitness goal is not unique!")
                return res.redirect('/member');
            }

            const query = "INSERT INTO FitnessGoals(goal_type, goal_date, member_id) VALUES ($1, $2, $3)";
            client.query(query, [fitness_goal, goal_deadline, member_id]);
            return res.redirect('/member');
        }
        catch(err){
            console.error("Error:", err);
        }
    }
    //deleting a goal
    else if(req.body.id == "delete-goal"){
        try{
            console.log(req.body)
            let {fitness_goal, member_id} = req.body;

            //check to see if fitness_goal and member_id form a unique key. If it doesn't then there is a big error happening cause that shouldn't be happening
            const checkUnique = client.query("SELECT * FROM FitnessGoals WHERE goal_type = $1 AND member_id = $2", [fitness_goal, member_id]);
            
            if((await checkUnique).rows.length == 0){
                console.log("MASSIVE ERROR: Cannot delete fitness goal.");
                req.flash("test", "Error: cannot delete fitness goal!")
                return res.redirect('/member');
            }

            const deleteQuery = 'DELETE FROM fitnessGoals WHERE member_id = $1 AND goal_type = $2';
            client.query(deleteQuery, [member_id, fitness_goal]);
            return res.redirect('/member');
        }
        catch(err){
            console.error(err);
        }
    }

});

//returns true or false if the given time interferes in any of the other time. 
function isDateInConflict(starting_time, ending_time, day, availabilities){
    for(const availability of availabilities){
        if(!((starting_time > availability.ending_time && ending_time > availability.ending_time) || (availability.ending_time > ending_time && availability.starting_time > ending_time)) && availability.day == day){
            return true 
        }
    }
    return false;
}

app.post("/trainer", async (req,res) => {
    //adding an availability 
    if(req.body.id == "set-schedule"){
        console.log(req.body)
        try{
            const {trainer_id, day, starting_time, ending_time, is_group_session} = req.body;
             //check to see if there are any matching availabilities 
             const checkUnique = client.query("SELECT * FROM Availabilities WHERE trainer_id = $1 AND day = $2 AND starting_time = $3 AND ending_time = $4", [trainer_id, day, starting_time, ending_time]);
            if((await checkUnique).rows.length >= 1){
                console.log("ERROR: Already scheduled that time.");
                req.flash("error", "Error: Already scheduled that time!")
                return res.redirect('/trainer');
            }
            //if starting and ending date match ignore request
            if(ending_time == starting_time){
                console.log("ERROR: Starting and Ending date match.");
                req.flash("error", "Error:Starting and Ending date match.")
                return res.redirect('/trainer');
            }
            //making sure starting and ending date are consistent
            if(starting_time > ending_time){
                console.log("ERROR: Starting time is further in the day than the ending time.");
                req.flash("error", "Error: Starting time is further in the day than the ending time.")
                return res.redirect('/trainer');
            }
            //the avialabilites of the trainer
            const result1 = await client.query("SELECT * FROM Availabilities WHERE trainer_id = $1;", [trainer_id]);
            const availabilities = result1.rows;
            if(isDateInConflict(starting_time, ending_time, day, availabilities)){
                console.log("ERROR: Given availaiblity conflicts with another");
                req.flash("error", "Error: Given availaiblity conflicts with another.")
                return res.redirect('/trainer');
            }
            const query = "INSERT INTO Availabilities(trainer_id, day, starting_time, ending_time, is_group_session) VALUES ($1, $2, $3, $4, $5)";
            client.query(query, [trainer_id, day, starting_time, ending_time, is_group_session]);
            return res.redirect('/trainer');

        }
        catch(err){
            console.error(err);
        }
    }
    //removing an availabilty 
    else if(req.body.id == "delete-availability"){
        const {trainer_id, day, starting_time, ending_time} = req.body;
        //checking 
        const checkUnique = client.query("SELECT * FROM Availabilities WHERE trainer_id = $1 AND day = $2 AND starting_time = $3 AND ending_time = $4", [trainer_id, day, starting_time, ending_time]);
        if((await checkUnique).rows.length == 0){
            console.log("MASSIVE ERROR: Schedule doesn't exist. Cannot delete.");
            req.flash("error", "Error: Schedule doesn't exist. Cannot delete.")
            return res.redirect('/trainer');
        }

        const query = "DELETE FROM Availabilities WHERE trainer_id = $1 AND day = $2 AND starting_time = $3 AND ending_time = $4";
        client.query(query, [trainer_id, day, starting_time, ending_time]);
        return res.redirect('/trainer');

    }
});


//listen on PORT 
app.listen(PORT, () => {
    console.log("Listening on port " + PORT)
});

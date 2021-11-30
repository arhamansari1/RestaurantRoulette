const express = require('express');
const morgan = require('morgan');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const fs = require('fs');
const http = require('http');
const session = require('express-session');
const path = require('path'); 
//const route = require('./routes');


const app = express();

var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Pomonard112!",
    database: "test_db",
    port: "3306"
})

connection.connect((err) => {
    if(err){
        throw err
    } else{
        console.log("connected!")
    }
})

//connection.query('CREATE TABLE tabletest(id INT(255) UNSIGNED AUTO_INCREMENT PRIMARY KEY, thing VARCHAR(255) NOT NULL)', (err, rows) =>{
//    if(err){
//        throw err
//    } else {
//        console.log("DATA SENT!")
//        console.log(rows)
//    }
//})


/*connection.query("INSERT INTO test_users (username, password, resturant_last_id) VALUES ('mrfreeze', 'ince', 7);", (err, rows) =>{
    if(err){
        throw err
    } else {
        console.log("Data has been sent!")
        console.log(rows)
    }
})
*/



const port = process.env.PORT || 5000;
//new stuff from online to help with logging in
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.post('/auth', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	if (username && password) {
		connection.query('SELECT * FROM test_users WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.username = username;
				response.redirect('/home');
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});
//tests whether the user logged in successfully
app.get('/home', function(request, response) {
	if (request.session.loggedin) {
		response.send('Welcome back, ' + request.session.username + '!');
	} else {
		response.send('Please login to view this page!');
	}
	response.end();
});


app.use(express.static(__dirname));

app
    
    .get('', (req, res) =>{
        res.sendFile(path.join(__dirname, 'index.html'));
        //res.sendFile(__dirname+'/index.html')
        })

    .get('/register.html',  (req, res) =>{
        res.sendFile(__dirname+'/register.html')
        })

    .get('/account.html',  (req, res) =>{
        res.sendFile(__dirname+'/account.html')
        })

    .get('/guest.html',  (req, res) =>{
        res.sendFile(__dirname+'/guest.html')
        })

    .get('/invite.html',  (req, res) =>{
        res.sendFile(__dirname+'/invite.html')
        })

    .get('/login.html',  (req, res) =>{
        res.sendFile(__dirname+'/login.html')
        })

    .get('/roulette.html',  (req, res) =>{
        res.sendFile(__dirname+'/roulette.html')
        })

    .get('/index.html',  (req, res) =>{
        res.sendFile(__dirname+'/index.html')
        })
        
    //.use(express.static('indexcopy.html'))
    
    .post('/api/user', (req, res) => {
    
        res.json(req.body);
        const un = req.body.username;
        const pw = req.body.password;

        connection.query("INSERT INTO test_users (username, password, resturant_last_id) VALUES ('"+un+"', '"+pw+"', 7);", (err, rows) =>{
    if(err){
        throw err
    } else {
        console.log("Data has been sent!")
        console.log(rows)
    }
})
})

.post('/api/register', (req, res) => {
    
    res.json(req.body);
    
    const first = req.body.firstname;
    const last = req.body.lastname;
    const email = req.body.email;
    const number = req.body.num;
    const un = req.body.user;
    const pw = req.body.pass;


    connection.query("INSERT INTO users (first_name, last_name, user_email, user_phone, username, password) VALUES ('"+first+"', '"+last+"', '"+email+"','"+number+"', '"+un+"', '"+pw+"' );", (err, rows) =>{
if(err){
    throw err
} else {
    console.log("Data has been sent!")
    console.log(rows)
}
})
})

app.listen(port);


console.log("App is listening to port "+ port)
//packages I downloaded from sources while learning how to use Node.js
const express = require('express');
const morgan = require('morgan');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const fs = require('fs');
const http = require('http');
const session = require('express-session');
const path = require('path'); 


//creates the app/server
const app = express();
//connects the server with the database
var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Pomonard112!",
    database: "test_db",
    port: "3306"
})
//test connection at start
connection.connect((err) => {
    if(err){
        throw err
    } else{
        console.log("connected!")
    }
})


//some queries I passed in order to make tables/test functions
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


//environment where the app is running (localhost:5000)
const port = process.env.PORT || 5000;
//new stuff from online to help with logging in
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.set('view engine', 'ejs');

app.post('/auth', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	if (username && password) {
		connection.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.username = username;
                response.redirect('/home');
			} else {
				//response.send('Incorrect Username and/or Password!');
                response.redirect('/login.html');
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
		//response.send('Welcome back, ' + request.session.username + '!');
        response.redirect('/index2.html');
	} else {
		response.send('Please login to view this page!');
        
	}
	response.end();
});

//loads js and css files, as well as images within a folder
app.use(express.static(__dirname));
//functions for the page, in order for it to run properly
//as well as add functionality to each section
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
        
        
    //post functions add information into the database
.post('/message', (req, res) =>{
    const room = req.body.room_id;
    const c1 = req.body.choice1;
    const c2 = req.body.choice2;
    
    connection.query("INSERT INTO res_choices (room_id, choice1, choice2) VALUES ("+room+", '"+c1+"', '"+c2+"');", (err, rows) =>{
        if(err){
            throw err
        } else {
            console.log("Data has been sent!")
            console.log(rows)
        }
        })

    res.redirect('/message.html');

})


.post('/choices', (req, res) =>{
    
    const room = req.body.room_id;
    const c1 = req.body.choice1;
    const c2 = req.body.choice2;
    
    connection.query("INSERT INTO res_choices (room_id, choice1, choice2) VALUES ("+room+", '"+c1+"', '"+c2+"');", (err, rows) =>{
        if(err){
            throw err
        } else {
            console.log("Data has been sent!")
            console.log(rows)
        }
        })


    var sql='SELECT * FROM res_choices WHERE room_id = ?';
        connection.query(sql,[room] , function (err, data, fields) {
        if (err) throw err;
        else{
            
            var row;
             
                row = data;
                console.log(row.length);
                
    
        res.render('roulette', { title: 'User List', userData: row});
    }
      });
})

.post('/reg', (req, res) => {    
    
    const first = req.body.firstname;
    const last = req.body.lastname;
    const email = req.body.email;
    const number = req.body.num;
    const un = req.body.user;
    const pw = req.body.pass;


    connection.query("INSERT INTO users (first_name, last_name, user_email, user_phone, username, password) \
    VALUES ('"+first+"', '"+last+"', '"+email+"','"+number+"', '"+un+"', '"+pw+"' );", (err, rows) =>{
if(err){
    throw err
} else {
    console.log("Data has been sent!")
    console.log(rows)
}
})
res.redirect('/login.html');
})






app.listen(port);


console.log("App is listening to port "+ port)
const express = require('express');
const cors = require('cors');
const app = express();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const mysql = require('mysql2');

const bcrypt = require('bcrypt');
const saltRounds = 7;

const jwt = require('jsonwebtoken');
const secret = "Fullstack-login"

const connection = mysql.createConnection({
  host:"localhost",
  user:"root",
  database:"webdev"
});

app.use(cors());

app.post('/register', jsonParser, function (req, res, next) {
  const { email, password, fname, lname } = req.body;

  if (!email || !password || !fname || !lname) {
    return res.json({ status: 'error', message: 'Missing required fields' });
  }

  bcrypt.hash(password, saltRounds, function(err, hash) {
    if (err) {
      return res.json({ status: 'error', message: 'Password encryption failed' });
    }

    connection.execute( 
      "INSERT INTO `users`(email,password,fname,lname) VALUES (?, ?, ?, ?)",
      [email, hash, fname, lname],
      function(err, results, fields){
        if (err) {
          res.json({ status: 'error', message: err.message });
          return;
        }
        
        res.json({ status: 'ok' });
      }
    );
  });
});


app.post('/login', jsonParser, function (req, res, next) {
  connection.execute( 
    "SELECT * FROM users WHERE email = ?",
    [req.body.email],
    function(err, users, fields){
      if (err){res.json({status: 'error', message: err}); return}
      if (users.length == 0) { res.json({status:'error',message:'no user found'}); return}
      bcrypt.compare(req.body.password, users[0].password, function(err, isLogn){
        if (isLogn){
          var token = jwt.sign({ email:users[0].email}, secret, { expiresIn: '1h'});
          res.json({status:'ok', message:'login success', token})
        }else{
          res.json({status:'error',message:'login failed'})
        }
      })
    }
  );
});

app.post('/authen', jsonParser, function(req, res, next) {
  try{
    const token =  req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, secret);
    res.json({status:'ok',decoded})
  } catch(err){
    res.json({status:'error', message :err.message})
  }
})

app.listen(3333, function () {
  console.log('CORS-enabled web server listening on port 3333');
});
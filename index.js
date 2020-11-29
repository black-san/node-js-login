let mysql = require('mysql');
let express = require('express');
let session = require('express-session');
let bodyParser = require('body-parser');
let path = require('path');

let TasksView = require('./services/TasksView');
let email = require('./utilities/EmailSender');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'accounts'
});

let app = express();

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/login.html'));
});

app.post('/auth', function(req, res) {
   let username = req.body.username;
   let password = req.body.password;
   if (username && password) {
       connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, result, field) {
        if (result.length > 0) {
            req.session.loggedIn = true;
            req.session.userName = username;
            req.session.userId = result[0].id;
            res.redirect('/home');
        }
        else {
            res.send('Inccorect Username and Password');
        }
        res.end();
       });
   }
   else {
       res.send('Please enter Username and Password');
       res.end();
   } 
});

app.get('/home', function(req, res) {
    if(req.session.loggedIn) {
        let queryStr = `SELECT tasks.id, tasks.title, tasks.description, tasks.isConfirmed, tasks.owner_email, COUNT(approvement.id) as isApprovedByUser
        FROM tasks
        LEFT JOIN (SELECT * FROM approvement WHERE approver_id=${req.session.userId}) approvement ON tasks.id=approvement.task_id
        GROUP BY tasks.id
        ORDER BY tasks.id DESC`;
        connection.query(queryStr, function(error, result, field) {
            if (result.length > 0) {
                let html = TasksView.display(result);
                res.send(html);
            }
            else {
                res.send('<h1>Empty task list</h1>');
            }
            res.end();
           });
    }
    else {
        res.send('<h1>Please login first!</h1>');

    }
});

app.post('/approve', function(req, res) {
    let taskId = req.body.taskId;
    connection.query('INSERT INTO approvement (task_id, approver_id) VALUES (?, ?)', [taskId, req.session.userId], function(error, result, field) {
        if (error) throw error;
    });
    connection.query('SELECT * FROM approvement WHERE task_id=?', [taskId], function(error, result, field) {
        if (result.length >= 3) {
            connection.query('UPDATE tasks SET isConfirmed = 1 WHERE id=?', [taskId], function(error, result, field) {
                if (error) throw error;
            });
            connection.query('SELECT * FROM tasks WHERE id=?', [taskId], function(error, result, field) {
                if (error) throw error;
                email.sendMail(result[0]);
            });
        }
    });
    res.redirect('/home');
    });

app.listen(3000, () => console.log(`server is running on ${process.env.PORT}`));
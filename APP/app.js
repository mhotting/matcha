/*
    Create and manage the nodeJS server
    Matcha project
    krambono - mhotting
    2019
*/

// Importing third party packages
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const path = require('path');

// Importing routes and controllers
const errorController = require('./controllers/error');

// Creating the app
const app = express();

// Setting up the view engine
app.set('view engine', 'ejs');
app.set('views', 'views');

// Initializing session management
const sessionStore = new MySQLStore({
    host: '0.0.0.0',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'matcha'
});

// Parsing of url requests - Setting public folder's rights - Using sessions - CSRF protection - Flash
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    key: 'session_cookie_name',
    secret: 'session_cookie_secret',
    store: sessionStore,
    resave: false,
    saveUninitialized: false
}));
const csrfProtection = csrf();
app.use(csrfProtection);
app.use(flash());

// Middleware for locals request stored vars
app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next();
});

// Using imported routes


// Unexisting pages management
app.use(errorController.get404);

// Making the server listen
app.listen(3000, '0.0.0.0');
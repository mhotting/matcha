/*
    Create and manage the nodeJS server
    Matcha project
    krambono - mhotting
    2019
*/

// Importing third party packages
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

// Importing routes and controllers
const routes = require('./routes');
const errorController = require('./controllers/error');

// Creating the app
const app = express();

app.use(bodyParser.json());
app.use((error, req, res, next) => {
    res.status(422).json({
        message: 'JSON envoyé mal formaté'
    });
});
// app.use(express.static(path.join(__dirname, 'public')));

// Setting headers to allow data exchange between clients and server
//(si ça veut rien dire c'est que mon anglais est merdique)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PATCH, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// Using imported routes
app.use('/api', routes);

// Unexisting pages management
app.use((req, res, next) => {
    res.status(404).json({
        message: 'Page not found'
    });
});

// Catching errors
app.use((error, req, res, next) => {
    const status = !error.statusCode ? 500 : error.statusCode;
    const message = error.message;
    res.status(status).json({
        //message: status === 500 ? 'Server Error' : message
        message: message
    });
});

// Making the server listen
app.listen(8080, '0.0.0.0');

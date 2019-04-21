/*
    Create and manage the nodeJS server
    Matcha project
    krambono - mhotting
    2019
*/

// Importing third party packages
const express = require('express');
const bodyParser = require('body-parser');

// Importing routes and controllers
const authRoutes = require('./routes/auth');
const messagesRoutes = require('./routes/messages');
const interactionsRoutes = require('./routes/interactions');
const notificationsRoutes = require('./routes/notifications');
const userRoutes = require('./routes/user');

// Creating the app
const app = express();

// Parsing incoming request body
app.use(bodyParser.json());
app.use((error, req, res, next) => {
    res.status(422).json({
        message: 'JSON envoyé mal formaté'
    });
});

// Setting headers to allow data exchange between clients and server
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PATCH, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// Using imported routes
app.use('/auth', authRoutes);
app.use(messagesRoutes);
app.use('/interact', interactionsRoutes);
app.use(notificationsRoutes);
app.use(userRoutes);

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
const server = app.listen(8080, '0.0.0.0');
require('./util/socket').init(server);

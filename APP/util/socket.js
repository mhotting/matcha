const socketioJwt = require('socketio-jwt');
const throwError = require('./error');
const usersConnected = [];
let io;

const addUser = (usersConnected, socket) => {
    for (let user of usersConnected) {
        if (user.userId === socket.decoded_token.userId) {
            return user.socketId = socket.id;
        }
    }
    usersConnected.push({
        ...socket.decoded_token,
        socketId: socket.id
    });
}

const removeUser = (usersConnected, userId) => {
    const index = usersConnected.findIndex(user => user.userId === userId);
    usersConnected.splice(index, 1);
}

module.exports = {
    init: (httpSever) => {
        io = require('socket.io')(httpSever);
        io.sockets
        .on('connection', socketioJwt.authorize({
        secret: ';R)LK4nh=]POwYtcJy=u5aEEI',
        timeout: 15000
        }))
        .on('authenticated', socket => {
            addUser(usersConnected, socket);
            console.log('New :', usersConnected);
            socket.on('disconnect', () => {
                removeUser(usersConnected, socket.decoded_token.userId);
                console.log('Rm:', usersConnected);
            });
        });
        return io;
    },
    getIo: () =>  {
        if (!io)
            throwError('socket was not initialized');
        return io;
    },
    getSocket: (username) => {
        console.log('username:', username);
        console.log('array:', usersConnected);
        const user = usersConnected.find(user => user.username === username);
        return user ? user.socketId : false;
    }
}

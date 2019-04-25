const socketioJwt = require('socketio-jwt');
const throwError = require('./error');
const usersConnected = [];
let io;

const addUser = (usersConnected, socket) => {
    const user = usersConnected.find(user => user.userId === socket.decoded_token.userId);
   
    if (user) {
        user.socketIds.push(socket.id);
        return false;
    }
    else {
        usersConnected.push({
            ...socket.decoded_token,
            socketIds: [socket.id]
        });
        return true;
    }
}

const removeUser = (usersConnected, userId, socketId) => {
    const index = usersConnected.findIndex(user => user.userId === userId);
    if (usersConnected[index].socketIds.length > 1) {
        const index2 = usersConnected[index].socketIds.findIndex(sktId => sktId === socketId);
        usersConnected[index].socketIds.splice(index2, 1);
        return false;
    }
    else {
        usersConnected.splice(index, 1);
        return true;
    }
}

const init = (httpSever) => {
    io = require('socket.io')(httpSever);
    io.sockets
    .on('connection', socketioJwt.authorize({
    secret: ';R)LK4nh=]POwYtcJy=u5aEEI',
    timeout: 15000
    }))
    .on('authenticated', socket => {
        const username = socket.decoded_token.username;
        const userId = socket.decoded_token.userId;

        if (addUser(usersConnected, socket))
            socket.broadcast.emit('addUserConnected', {username: username, userId: userId});
        console.log('New :', usersConnected);
        socket.on('disconnect', () => {
            if (removeUser(usersConnected, userId, socket.id)) {
                setTimeout(() => {
                    if (!usersConnected.find(user => user.username === username))
                        socket.broadcast.emit('removeUserConnected', {username: username, userId: userId});
                }, 10000);
            }
            console.log('Rm:', usersConnected);
        });
        socket.on('getUsersConnected', () => {
            const users = usersConnected.map(user => ({username: user.username, userId: user.userId}));
            emitEventTo(username, 'getUsersConnected', {users: users})
        });
        socket.on('logout', () => {
            emitEventTo(username, 'refresh', {});
        });
    });
    return io;
}

//socket.broadcast.emit('hi');

const getIo = () =>  {
    if (!io)
        throwError('socket was not initialized');
    return io;
}

const getSockets = username => {
    console.log('username:', username);
    console.log('array:', usersConnected);
    const user = usersConnected.find(user => user.username === username);
    return user ? user.socketIds : false;
}

const emitEventTo = (username, nameEvent, data) => {
    const socketIds = getSockets(username);
    if (socketIds) {
        for (let socketId of socketIds) {
            console.log('socket', socketId);
            getIo().to(socketId).emit(nameEvent, data);
        }
    }
}

module.exports = {
    init: init,
    getIo: getIo,
    getSockets: getSockets,
    emitEventTo: emitEventTo
}

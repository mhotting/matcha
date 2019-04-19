const throwError = require('./error');
let io;

module.exports = {
    init: (httpSever) => {
        io = require('socket.io')(httpSever);
        return io;
    },
    get: () =>  {
        if (!io)
            throwError('socket was not initialized');
        return io;
    }
}

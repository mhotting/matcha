const jwt = require('jsonwebtoken');
const throwError = require('../util/error');

// il faut modifier les headers côté client
// Authorization : 'Bearer ' + token

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader)
        throwError('Vous devez vous connecter pour accéder à cette page', 401);
    const token = authHeader.split(' ')[1];
    const decodedToken = jwt.verify(token, ';R)LK4nh=]POwYtcJy=u5aEEI');
    if (!decodedToken) 
        throwError('Vous devez vous connecter pour accéder à cette page', 401);
    req.userId = decodedToken.userId;
    req.username = decodedToken.username;
    next();
};
         
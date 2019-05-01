// Controller of all the images stuff

const throwError = require('../util/error');

// Save images into the database and the server
exports.userImage = (req, res, next) => {
    res.status(201).json({
        message: 'Images sauvegardées, enfin pas encore mais bientôt'
    });
}

// Delete an image from the database and the server according to its id
exports.deleteOne = (req, res, next) => {
    res.status(201).json({
        message: 'Image supprimée'
    });
}
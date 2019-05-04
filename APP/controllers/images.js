// Controller of all the images stuff

const throwError = require('../util/error');
const fs = require('fs');
const Images = require('./../models/images');

// Save images into the database and the server
exports.userImage = (req, res, next) => {
    let images = req.images;
    let imageType;
    let imageName;
    let finalImage;
    let imageArray = [];
    const uname = req.username;
    const userId = req.userId;
    const promiseArray = [];

    // Checking all the images and preparing an array to store them if they are all ok
    for (let i = 0; i < images.length; i++) {
        // Getting the image type
        imageType = images[i].split('/')[1];
        imageType = imageType.split(';')[0];
        if (imageType !== 'png' && imageType !== 'jpg' && imageType !== 'gif' && imageType !== 'jpeg') {
            throwError('Formats valides: png, jpg, gif', 422);
        }
        // Setting the image name and cleaning the base64 string - then pushing it into the array
        imageName = uname + '_' + i + '.' + imageType;
        if (imageType === 'png') {
            finalImage = images[i].replace(/^data:image\/png;base64,/, "");
        } else if (imageType === 'jpg') {
            finalImage = images[i].replace(/^data:image\/jpg;base64,/, "");
        } else if (imageType === 'jpeg') {
            finalImage = images[i].replace(/^data:image\/jpeg;base64,/, "");
        } else {
            finalImage = images[i].replace(/^data:image\/gif;base64,/, "");
        }
        imageArray.push({ name: imageName, data: finalImage });
    }

    // Removing all the user's former images from db and file system
    for (let i = 0; i < 5; i++) {
        if (fs.existsSync('./public/images/' + uname + '_' + i + '.png')) {
            fs.unlinkSync('./public/images/' + uname + '_' + i + '.png');
        } else if (fs.existsSync('./public/images/' + uname + '_' + i + '.jpg')) {
            fs.unlinkSync('./public/images/' + uname + '_' + i + '.jpg');
        } else if (fs.existsSync('./public/images/' + uname + '_' + i + '.jpeg')) {
            fs.unlinkSync('./public/images/' + uname + '_' + i + '.jpeg');
        } else if (fs.existsSync('./public/images/' + uname + '_' + i + '.gif')) {
            fs.unlinkSync('./public/images/' + uname + '_' + i + '.gif');
        }
    }

    // Deleting all the images from DB and then creating the new entries
    Images.deleteAll(userId)
        .then(result => {
            // Saving all the images in the database and in the /public/images folder
            for (let image of imageArray) {
                promiseArray.push(Images.create(userId, image.name)
                    .catch(error => next(error))
                );
                fs.writeFile('./public/images/' + image.name, image.data, { encoding: 'base64' }, error => {
                    if (error) {
                        next(error);
                    }
                });
            }
            return (Promise.all(promiseArray));
        })
        .then(result => {
            // Returning the response if everything is ok
            res.status(201).json({
                message: 'Images sauvegardées'
            });
        })  
        .catch(error => next(error));

}

// Delete an image from the database and the server according to its id
exports.deleteOne = (req, res, next) => {
    res.status(201).json({
        message: 'Image supprimée'
    });
}
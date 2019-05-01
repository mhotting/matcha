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
        // Saving the file into public/images folder
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
        imageArray.push({name: imageName, data: finalImage});
    }

    // Saving all the images in the database and in the /public/images folder
    for (let image of imageArray) {
        console.log(image.name);
        promiseArray.push(Images.create(userId, image.name)
            .then(result => {
                fs.writeFile('./public/images/' + imageName, finalImage, {encoding: 'base64'}, function(error) {
                    console.log(error);
                });
            })
            .catch(error => next(error))
        );
    }
    
    // Returning the response if everything is ok
    Promise.all(promiseArray);
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
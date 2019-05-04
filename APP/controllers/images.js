// Controller of all the images stuff

const throwError = require('../util/error');
const fs = require('fs');
const Images = require('./../models/images');
const Magic = require('promise-mmmagic');
const util = require('util');
const fs_writeFile = util.promisify(fs.writeFile);

// Save images into the database and the server
exports.userImage = (req, res, next) => {
    let images = req.images;
    let imageName;
    let finalImage;
    let imageArray = [];
    const uname = req.username;
    const userId = req.userId;
    let promiseArray = [];

    // Checking all the images and preparing an array to store them if they are all ok
    for (let i = 0; i < images.length; i++) {
        // Setting the image name and cleaning the base64 string - then pushing it into the array
        const regex = /^data:image\/((jpeg)|(jpg)|(gif)|(png));base64,/;
        finalImage = images[i].replace(regex, '');

        // Creating a buffer and using mmmMagic to check it
        const buff = Buffer.from(finalImage, 'base64');
        const magic = new Magic(Magic.MAGIC_MIME_TYPE);
        promiseArray.push(magic.detect(buff)
            .then(result => {
                console.log(result);
                let type = result.split('/')[1];
                if (type !== 'png' && type !== 'jpeg' && type !== 'jpg' && type !== 'gif') {
                    throwError('Formats supportés: png, jpeg, jpg, gif', 422);
                }
                imageName = uname + '_' + i + '.' + type;
                imageArray.push({ name: imageName, buff: buff });
            })
            .catch(error => next(error))
        );
    }

    // Adding images to db and to file system
    Promise.all(promiseArray)
        .then(_ => {
            promiseArray = imageArray.map(image => Images.create(userId, 'http://localhost:8080/images/' + image.name));
            return (Promise.all(promiseArray));
        })
        .then(_ => {
            promiseArray = imageArray.map(image => fs_writeFile('./public/images/' + image.name, image.buff));
            return (Promise.all(promiseArray));
        })
        .then(_ => {
            res.status(201).json({
                message: 'Images sauvegardées'
            });
        }) 
        .catch(error => next(error));
}

// Delete an image from the database and the server according to its id
exports.delete = (req, res, next) => {
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
    res.status(201).json({
        message: 'Image supprimée'
    });
}
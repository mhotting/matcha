// Route for managing images

const express = require('express');
const imagesController = require('../controllers/images');

const isAuth = require('../middlewares/is-auth'); 
const validation = require('../middlewares/validation');

const router = express.Router();

// PUT '/images/save' -> saving images from json request to files on the server
router.put('/save', isAuth, validation.userImage, imagesController.userImage);

// DELETE '/images/deleteOne' -> delete an image according to its ID
router.delete('/deleteOne', isAuth, validation.deleteImage, imagesController.deleteOne);

module.exports = router;
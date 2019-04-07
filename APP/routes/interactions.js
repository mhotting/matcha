// Management of the interactions routes (block, signal, like, dislike, visit)

const express = require('express');
const interactionsController = require('./../controllers/interactions');
const validation = require('./../middlewares/validation');

const isAuth = require('../middlewares/is-auth');

const router = express.Router();

// PUT '/interact/block'
router.put('/block', isAuth, validation.existingId, interactionsController.putBlock);

// DELETE '/interact/block'
router.delete('/block', isAuth, validation.existingId, interactionsController.deleteBlock);

// PUT '/interact/like'
router.put('/like', isAuth, validation.existingId, interactionsController.putLike);

// DELETE '/interact/like'
router.delete('/like', isAuth, validation.existingId, interactionsController.deleteLike);

// PUT '/interact/visit'
router.put('/visit', isAuth, validation.existingId, interactionsController.putVisit);

// PUT '/interact/signal'
router.put('/report', isAuth, validation.existingId, interactionsController.putReport);

// DELETE '/interact/signal'
router.delete('/report', isAuth, validation.existingId, interactionsController.deleteReport);


module.exports = router;

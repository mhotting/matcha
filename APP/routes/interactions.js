// Management of the interactions routes (block, report, like, dislike, visit)

const express = require('express');
const interactionsController = require('./../controllers/interactions');
const validation = require('./../middlewares/validation');

const isAuth = require('../middlewares/is-auth');

const router = express.Router();

// PUT '/interact/block'
router.put('/block', isAuth, validation.interactExistingId, validation.sameId, interactionsController.putBlock);

// DELETE '/interact/block'
router.delete('/block', isAuth, validation.interactExistingId, validation.sameId, interactionsController.deleteBlock);

// PUT '/interact/like'
router.put('/like', isAuth, validation.interactExistingId, validation.sameId, interactionsController.putLike);

// DELETE '/interact/like'
router.delete('/like', isAuth, validation.interactExistingId, validation.sameId, interactionsController.deleteLike);

// PUT '/interact/signal'
router.put('/report', isAuth, validation.interactExistingId, validation.sameId, interactionsController.putReport);

// DELETE '/interact/signal'
router.delete('/report', isAuth, validation.interactExistingId, validation.sameId, interactionsController.deleteReport);

// PUT '/interact/visit'
router.put('/visit', isAuth, validation.interactExistingId, validation.sameId, interactionsController.putVisit);


module.exports = router;

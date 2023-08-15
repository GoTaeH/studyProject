const express = require('express');
const router = express.Router();
const path = require('path');

var model = require('../model/model.js');

router.get('/', (req, res) => {
    res.json({ message: 'API root' });
});

router.get('/member', model.getMember);
router.get('/game', model.getGame);
router.get('/review', model.getReview);
router.get('/catgame', model.getCatGame);

module.exports = router;
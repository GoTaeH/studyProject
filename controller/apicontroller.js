const express = require('express');
const router = express.Router();
const path = require('path');

var model = require('../model/model.js');

router.get('/', (req, res) => {
    res.json({ message: 'API root' });
});

router.get('/table', model.gettable1);
router.get('/table', model.gettable2);

module.exports = router;
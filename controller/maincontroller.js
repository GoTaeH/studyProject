const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/', (req, res) => {
    console.log(req.session);
    res.sendFile(path.join(__dirname, '../html/main.html'));
});
router.get('/header1', (req, res) => {
    res.sendFile(path.join(__dirname, '../html/header.html'));
});
router.get('/header2', (req, res) => {
    res.sendFile(path.join(__dirname, '../html/header2.html'));
});

router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../html/login.html'));
});
router.get('/membership', (req, res) => {
    res.sendFile(path.join(__dirname, '../html/membership.html'));
});

router.get('/bookmark', (req, res) => {
    res.sendFile(path.join(__dirname, '../html/bookmark.html'));
});
router.get('/gameinfo', (req, res) => {
    res.sendFile(path.join(__dirname, '../html/game_info.html'));
});

router.get('/style/:name', (req, res) => {
    res.sendFile(path.join(__dirname, '../style/', req.params.name));
});
router.get('/image/:name', (req, res) => {
    res.sendFile(path.join(__dirname, '../image/', req.params.name));
});
router.get('/js/:name', (req, res) => {
    res.sendFile(path.join(__dirname, '../js/', req.params.name));
});

module.exports = router;
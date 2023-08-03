const express = require('express');
const app = express();
const port = 3000;

const path = require('path');

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/html/main.html');
});
app.get('/header', (req, res) => {
    res.sendFile(__dirname + '/html/header.html');
});

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/html/login.html');
});
app.get('/login/membership', (req, res) => {
    res.sendFile(__dirname + '/html/membership.html');
});

app.get('/bookmark', (req, res) => {
    res.sendFile(__dirname + '/html/bookmark.html');
});

app.get('/style/:name', (req, res) => {
    res.sendFile(__dirname + '/style/' + req.params.name);
});
app.get('/image/:name', (req, res) => {
    res.sendFile(__dirname + '/image/' + req.params.name);
});
app.get('/js/:name', (req, res) => {
    res.sendFile(__dirname + '/js/' + req.params.name);
});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
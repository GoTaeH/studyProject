#!/usr/bin/node

const express = require('express');
// const session = require('express-session');
const app = express();
const port = 3000;

const path = require('path');
const cors = require('cors');
// const mysql = require('mysql');
// const dbconfig = require('../config/dbinfo.js');
// const connection = mysql.createConnection(dbconfig);

// app.use(session({
//     secret: 'lsakd!dfs#$asd',
//     resave: false,
//     saveUninitialized: true
// }));

app.use(
    cors({
        origin: 'https://gogoth7.site',
        credentials: true,
    })
);

// // 로그인 로직
// app.post('/login', (req, res) => {
    
// })
// // 로그아웃 로직
// app.get('/logout', (req, res) => {
//     req.session.destroy((err) => {
//         if(err) {
//             console.error(err);
//         } else {
//             res.redirect('/');
//         }
//     });
// });


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/html/main.html'));
});
app.get('/header', (req, res) => {
    res.sendFile(path.join(__dirname, '/html/header.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '/html/login.html'));
});
app.get('/membership', (req, res) => {
    res.sendFile(path.join(__dirname, '/html/membership.html'));
});

app.get('/bookmark', (req, res) => {
    res.sendFile(path.join(__dirname, '/html/bookmark.html'));
});

app.get('/style/:name', (req, res) => {
    res.sendFile(path.join(__dirname, '/style/', req.params.name));
});
app.get('/image/:name', (req, res) => {
    res.sendFile(path.join(__dirname, '/image/', req.params.name));
});
app.get('/js/:name', (req, res) => {
    res.sendFile(path.join(__dirname, '/js/', req.params.name));
});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
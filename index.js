#!/usr/bin/node

const express = require('express');
const app = express();
const port = 3000;

const cookieParser = require('cookie-parser');
const session = require('express-session');

const path = require('path');
const cors = require('cors');
const { createConnection } = require('net');

const mysql = require('mysql');
const dbconfig = require('./config/dbinfo.js');

const { error } = require('console');
const connection = mysql.createConnection(dbconfig);

app.use(express.json());    // 요청 본문을 JSON으로 파싱
app.use(express.urlencoded({ extended: true})); // 폼 데이터 파싱
app.use(cookieParser());
app.use(session({
    secret: 'lsakd!dfs#$asd',
    resave: false,
    saveUninitialized: true,
    // cookie: {
    //     maxAge: 3600000 //세션 유효 기간 : 1시간
    // }
}));

app.use(
    cors({
        origin: 'https://gogoth7.site',
        credentials: true,
    })
);

// 로그인 로직
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (req.session.user && req.session.user.email === email) {
        res.redirect('/');
    }
    const query = 'SELECT * FROM member WHERE email = ? AND password = ?';
    connection.query(query, [email, password], (error, rows) => {
        if (error) {
            console.error(error);
            return res.status(500).send('서버 오류 발생');
        }
        if (rows.length === 0) {
            return res.status(401).send('이메일 또는 비밀번호가 틀렸습니다.');
        }
        req.session.user = { email };
        res.setHeader('Set-Cookie', ['user=' + email]);
        res.redirect('/');
    });
});

// 로그아웃 로직
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if(err) {
            console.error(err);
        } else {
            res.clearCookie('user');
            res.redirect('/');
        }
    });
});

app.get('/api', (req, res) => {
    connection.query('SELECT * FROM member', (error, rows) => {
        if(error) throw error;
        res.send(rows);
    });
});

app.get('/', (req, res) => {
    console.log(req.session);
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
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
const dbconfig = require('../config/dbinfo.js');

const { error } = require('console');
const connection = mysql.createConnection(dbconfig);

app.use(express.json());    // 요청 본문을 JSON으로 파싱
app.use(express.urlencoded({ extended: true})); // 폼 데이터 파싱
app.use(cookieParser());
app.use(session({
    secret: 'lysk&akd!dfs#$asd',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 3
    }
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
    const validReferer = 'https://gogoth7.site/login';

    // Referer 헤더 확인
    const referer = req.get('Referer');

    if (!referer || !referer.startsWith(validReferer)) {
        return res.status(403).send('referer 검증 실패');
    }

    const query = 'SELECT * FROM member WHERE email = ? AND password = ?';
    connection.query(query, [email, password], (error, rows) => {
        if (error) {
            console.error(error);
            return res.status(500).send('서버 오류 발생');
        }
        if (rows.length === 0) {
            return res.redirect('/login?error=authFailed');
        }
        // 쿠키 설정
        res.cookie('user', email, {
            path: '/',        // 쿠키의 path를 모든 경로에서 접근 가능하도록 설정
            sameSite: 'lax',  // SameSite 설정을 Lax로 설정
            httpOnly: true,   // httpOnly 설정을 true로 하여 JavaScript에서 쿠키에 접근하지 못하도록 설정
            secure: true,   // HTTPS 연결에서만 쿠키를 전달받도록 설정
        });

        req.session.user = { email };
        res.redirect('/?logged');
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
app.get('/header1', (req, res) => {
    res.sendFile(path.join(__dirname, '/html/header.html'));
});
app.get('/header2', (req, res) => {
    res.sendFile(path.join(__dirname, '/html/header2.html'));
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
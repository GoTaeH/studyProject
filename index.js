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

var apicontroller = require('./controller/apicontroller.js');
var maincontroller = require('./controller/maincontroller.js');

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
app.use('/api', apicontroller);
app.use('/', maincontroller);

// 로그인 로직
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (req.session.user && req.session.user.email === email) {
        res.redirect('/');
    }
    if (!email || !password) {
        return res.redirect('/login?error=missingFields');
    }
    // const validReferer = 'https://gogoth7.site/login';
    const validReferer = 'http://localhost:3000/login';

    // Referer 헤더 확인
    const referer = req.get('Referer');

    if (!referer || !referer.startsWith(validReferer)) {
        return res.status(403).send('referer 검증 실패');
    }

    const query = 'SELECT * FROM member WHERE email = ?';
    connection.query(query, [email, password], (error, rows) => {
        if (error) {
            console.error(error);
            return res.status(500).send('서버 오류 발생');
        }
        if (rows.length === 0) {
            return res.redirect('/login?error=authFailed');
        }
        const crypto = require('crypto');

        const dbSalt = rows[0].salt;
        const dbHashedPw = rows[0].password;

        const hashedPassword = crypto.createHash('sha256').update(password + dbSalt).digest('hex');
        if(hashedPassword === dbHashedPw) { // 비밀번호 검증
            // 쿠키 설정
            res.cookie('user', email, {
                path: '/',        // 쿠키의 path를 모든 경로에서 접근 가능하도록 설정
                sameSite: 'lax',  // SameSite 설정을 Lax로 설정
                httpOnly: true,   // httpOnly 설정을 true로 하여 JavaScript에서 쿠키에 접근하지 못하도록 설정
                secure: true,   // HTTPS 연결에서만 쿠키를 전달받도록 설정
            });
            req.session.user = { email };
            res.redirect('/?logged');
        } else {
            return res.redirect('/login?error=authFailed');
        }
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

// 회원가입 로직
app.post('/membership', (req, res) => {
    const { email, password } = req.body;

    const crypto = require('crypto');
    // 솔트 생성
    const salt = generateRandomSalt();

    // 비밀번호 해싱
    const hashedPassword = crypto.createHash('sha256').update(password + salt).digest('hex');

    const query = 'INSERT INTO member (email, password, salt) VALUES (?, ?, ?)';
    connection.query(query, [email, hashedPassword, salt], (error, result) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: '서버 오류 발생' });
        }
        if (result.affectedRows > 0) {
            return res.status(200).json({ success: true, message: '계정 생성 완료' });
        } else {
            return res.status(500).json({ success: false, message: '계정 생성 실패' });
        }
    });
});

// 솔트 생성 함수
function generateRandomSalt() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const saltLength = 16;
    let salt = '';
    for (let i = 0; i < saltLength; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        salt += characters.charAt(randomIndex);
    }
    return salt;
}

// 중복확인
app.post('/check', (req, res) => {
    const { email } = req.body;
    const query = 'SELECT COUNT(*) as count FROM member WHERE email = ?';
    connection.query(query, [email], (error, rows) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: '서버 오류 발생' });
        }
        const count = rows[0].count;
        return res.status(200).json({ exists: count > 0 }); // 중복된 값이 있다면 count값이 1
    })
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
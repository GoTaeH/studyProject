#!/usr/bin/node

const express = require('express');
const app = express();
const port = 3000;

const path = require('path');
const cors = require('cors');
const mysql = require('mysql');
const dbconfig = require('../config/dbinfo.js');
const { resourceLimits } = require('worker_threads');
const connection = mysql.createConnection(dbconfig);

app.use(
    cors({
        origin: 'https://gogoth7.site',
        credentials: true,
    })
);

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


// 페이지네이션 위한 API 엔드포인트 추가
app.get('/game', (req, res) => {
    const page = parseInt(req.query.page) || 1;     // 현재 페이지 번호
    const itemPerPage = parseInt(req.query.itemPerPage) || 6;      // 페이지 당 아이템 개수
    const startIndex = (page - 1) * itemPerPage;

    const query = `
    SELECT * FROM game.*, category.catname
    FROM game JOIN category ON game.categoryid = category.categoryid
    ORDER BY game.id
    LIMIT ${itemPerPage} OFFSET ${startIndex}`;

    connection.query(query, (err, row) => {
        if(err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json({
            item: row,
            currentPage: page,
            itemPerPage: itemPerPage
        });
    });
});
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
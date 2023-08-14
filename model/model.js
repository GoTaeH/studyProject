const mysql = require('mysql');
const dbconfig = require('../../config/dbinfo.js');
const connection = mysql.createConnection(dbconfig);

exports.getMember = (req, res) => {
    connection.query('SELECT * FROM member', (error, rows) => {
        if(error) throw error;
        res.send(rows);
    });
};

exports.getCat = (req, res) => {
    connection.query('SELECT * FROM category', (error, rows) => {
        if(error) throw error;
        res.send(rows);
    });
};

exports.getGame = (req, res) => {
    connection.query('SELECT * FROM game', (error, rows) => {
        if(error) throw error;
        res.send(rows);
    });
};

exports.getReview = (req, res) => {
    connection.query('SELECT * FROM review', (error, rows) => {
        if(error) throw error;
        res.send(rows);
    });
};
const mysql = require('mysql');
const dbconfig = require('../../config/dbinfo.js');
const connection = mysql.createConnection(dbconfig);

exports.getMember = (req, res) => {
    connection.query('SELECT * FROM member', (error, rows) => {
        if(error) throw error;
        res.send(rows);
    });
};

exports.getGame = (req, res) => {
    const query = 'SELECT * FROM game';
    connection.query(query, (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: '데이터베이스 오류' });
        }
        res.status(200).json(results);
    });
};

exports.getReview = (req, res) => {
    connection.query('SELECT * FROM review', (error, rows) => {
        if(error) throw error;
        res.send(rows);
    });
};

exports.getCatGame = (req, res) => {
    connection.query('SELECT * FROM cat_game', (error, rows) => {
        if(error) throw error;
        res.send(rows);
    });
};
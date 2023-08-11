const mysql = require('mysql');
const dbconfig = require('../../config/dbinfo.js');
const connection = mysql.createConnection(dbconfig);

exports.gettable1 = (req, res) => {
    connection.query('SELECT * FROM member', (error, rows) => {
        if(error) throw error;
        res.send(rows);
    });
};

exports.gettable2 = (req, res) => {
    connection.query('SELECT * FROM category', (error, rows) => {
        if(error) throw error;
        res.send(rows);
    });
};
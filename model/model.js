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

exports.getUserIdByEmail = (email, callback) => {
    const query = 'SELECT memberid FROM member WHERE email = ?';
    connection.query(query, [email], (error, results) => {
        if (error) {
            console.error('유저 아이디 조회 오류:', error);
            callback(error);
        } else {
            if (results.length === 0) {
                callback('유저 아이디를 찾을 수 없습니다.');
            } else {
                const userid = results[0].memberid;
                callback(null, userid);
            }
        }
    });
};

exports.saveReview = (gameid, contents, userid, callback) => {
    const query = 'INSERT INTO review (game_gameid, contents, member_memberid) VALUES (?, ?, ?)';
    connection.query(query, [gameid, contents, userid], (error, result) => {
        if (error) {
            console.error('리뷰 저장 오류:', error);
            callback(error);
        } else {
            console.log('리뷰 저장 성공:', result);
            callback(null, result);
        }
    });
};

exports.getCatGame = (req, res) => {
    connection.query('SELECT * FROM cat_game', (error, rows) => {
        if(error) throw error;
        res.send(rows);
    });
};
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

// 리뷰 중복 작성 체크
exports.checkDuplicateReview = (email, gameid) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT r.*
            FROM review r
            JOIN member m ON r.member_memberid = m.memberid
            WHERE m.email = ? AND r.game_gameid = ?
        `;
        connection.query(query, [email, gameid], (error, results) => {
            if (error) {
                console.error('리뷰 중복 체크 오류:', error);
                reject(error);
            } else {
                const hasDuplicateReview = results.length > 0;
                resolve(hasDuplicateReview);
            }
        });
    });
};

// email을 통해 id 구하기
exports.getUserIdByEmail = (email) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT memberid FROM member WHERE email = ?';
        connection.query(query, [email], (error, results) => {
            if (error) {
                console.error('유저 아이디 조회 오류:', error);
                reject(error);
            } else {
                if (results.length === 0) {
                    reject('유저 아이디를 찾을 수 없습니다.');
                } else {
                    const userid = results[0].memberid;
                    resolve(userid);
                }
            }
        });
    });
};

// 리뷰 저장
exports.saveReview = (gameid, contents, userid) => {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO review (game_gameid, contents, member_memberid) VALUES (?, ?, ?)';
        connection.query(query, [gameid, contents, userid], (error, result) => {
            if (error) {
                console.error('리뷰 저장 오류:', error);
                reject(error);
            } else {
                console.log('리뷰 저장 성공:', result);
                resolve(result);
            }
        });
    });
};

exports.getCatGame = (req, res) => {
    connection.query('SELECT * FROM cat_game', (error, rows) => {
        if(error) throw error;
        res.send(rows);
    });
};
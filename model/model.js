const mysql = require('mysql');
const dbconfig = require('../../config/dbinfo.js');
const connection = mysql.createConnection(dbconfig);

exports.getMemberid = (email) => {
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


exports.getCatGame = (req, res) => {
    connection.query('SELECT * FROM cat_game', (error, rows) => {
        if(error) throw error;
        res.send(rows);
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

// 북마크 업데이트
exports.updateBookmark = (memberId, gameId, bookmarked) => {
    return new Promise((resolve, reject) => {
        const selectQuery = 'SELECT * FROM bookmark WHERE member_memberid = ? AND game_gameid = ?';
        connection.query(selectQuery, [memberId, gameId], (selectError, selectResults) => {
            if (selectError) {
                console.error('북마크 조회 오류:', selectError);
                reject(selectError);
                return;
            }

            if (selectResults.length > 0) {
                // 이미 해당 조합의 키가 존재하면 업데이트 수행
                const updateQuery = 'UPDATE bookmark SET bookmarked = ? WHERE member_memberid = ? AND game_gameid = ?';
                connection.query(updateQuery, [bookmarked, memberId, gameId], (updateError, updateResult) => {
                    if (updateError) {
                        console.error('북마크 업데이트 오류:', updateError);
                        reject(updateError);
                    } else {
                        console.log('북마크 업데이트 성공:', updateResult);
                        resolve(updateResult);
                    }
                });
            } else {
                // 해당 조합의 키가 없으면 삽입 수행
                const insertQuery = 'INSERT INTO bookmark (member_memberid, game_gameid, bookmarked) VALUES (?, ?, ?)';
                connection.query(insertQuery, [memberId, gameId, bookmarked], (insertError, insertResult) => {
                    if (insertError) {
                        console.error('북마크 삽입 오류:', insertError);
                        reject(insertError);
                    } else {
                        console.log('북마크 삽입 성공:', insertResult);
                        resolve(insertResult);
                    }
                });
            }
        });
    });
};

// 북마크 내용 가져오기
exports.getBookmarks = (memberId) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM bookmark WHERE member_memberid = ?';
        connection.query(query, [memberId], (error, results) => {
            if (error) {
                console.error('북마크 정보 조회 오류:', error);
                reject(error);
            } else {
                console.log('북마크 정보 조회 성공:', results);
                resolve(results);
            }
        });
    });
};
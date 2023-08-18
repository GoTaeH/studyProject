const express = require('express');
const router = express.Router();
const path = require('path');

var model = require('../model/model.js');

router.get('/', (req, res) => {
    res.json({ message: 'API root' });
});

router.get('/member', model.getMember);
router.get('/game', model.getGame);
router.get('/catgame', model.getCatGame);
router.post('/review', (req, res) => {
    const { gameid, contents } = req.body;
    const userEmail = req.session.user.email;
    model.getUserIdByEmail(userEmail, (error, userid) => {
        if (error) {
            console.error('유저 아이디 조회 오류:', error);
            return res.status(500).json({ error: '유저 아이디 조회 실패' });
        }
        model.saveReview(gameid, contents, userid, (saveError, result) => {
            if (saveError) {
                console.error('리뷰 저장 오류:', saveError);
                return res.status(500).json({ error: '리뷰 저장 실패' });
            }
            res.status(201).json({ message: '리뷰가 성공적으로 저장되었습니다.' });
        });
    });
});

module.exports = router;
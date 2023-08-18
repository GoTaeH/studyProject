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
router.get('/checkDuplicate', async (req, res) => {
    const { gameid } = req.query;
    const userEmail = req.session.user.email;
    try{
        const duplicateCheck = await model.checkDuplicateReview(userEmail, gameid);
        res.status(200).json({ hasDuplicateReview: duplicateCheck });
    } catch (error) {
        console.error('중복 리뷰 체크 오류:', error);
        res.status(200).json({ hasDuplicateReview: true });
    }
});
router.post('/review', async (req, res) => {
    const { gameid, contents } = req.body;
    const userEmail = req.session.user.email;

    try {
        // 중복 리뷰 체크
        const duplicateCheck = await model.checkDuplicateReview(userEmail, gameid);
        if (duplicateCheck) {
            return res.status(400).json({ error: '이미 리뷰를 작성하셨습니다.' });
        }

        const userid = await model.getUserIdByEmail(userEmail);
        await model.saveReview(gameid, contents, userid);

        res.status(201).json({ message: '리뷰가 성공적으로 저장되었습니다.' });
    } catch (error) {
        console.error('리뷰 저장 오류:', error);
        res.status(500).json({ error: '리뷰 저장 실패' });
    }
});

module.exports = router;
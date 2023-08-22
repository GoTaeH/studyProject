const express = require('express');
const router = express.Router();
const path = require('path');

var model = require('../model/model.js');
const e = require('express');

router.get('/', (req, res) => {
    res.json({ message: 'API root' });
});

router.get('/game', model.getGame);
router.get('/catgame', model.getCatGame);
router.get('/userinfo', async (req, res) => {
    if (req.session.user) {
        const userEmail = req.session.user.email; // 사용자의 이메일 가져오기

        try {
            const userId = await model.getUserIdByEmail(userEmail);
            if (userId) {
                const userInfo = {
                    id: userId
                };
                res.status(200).json(userInfo);
            } else {
                res.status(500).json({ error: '유저 아이디 조회 실패' });
            }
        } catch (error) {
            console.error('유저 아이디 조회 오류:', error);
            res.status(500).json({ error: '유저 아이디 조회 오류' });
        }
    } else {
        res.status(401).json({ error: '권한이 없습니다.' });
    }
});
router.get('/userEmail', (req, res) => {
    if (req.session.user && req.session.user.email) {
        res.json({ email: req.session.user.email });
    } else {
        res.status(404).json({ error: '유저 세션이 없습니다.' });
    }
});
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
router.post('/bookmark', async (req, res) => {
    const memberId = req.body.memberId;
    const gameId = req.body.gameId;
    const bookmarked = req.body.bookmarked;

    try {
        // 북마크 업데이트 처리
        await model.updateBookmark(memberId, gameId, bookmarked);

        res.status(200).json({ message: '북마크 업데이트 성공' });
    } catch (error) {
        console.error('북마크 업데이트 오류:', error);
        res.status(500).json({ error: '북마크 업데이트 실패' });
    }
});
router.get('/bookmark/:memberId', async (req, res) => {
    const memberId = req.params.memberId;
    try {
        const bookmarks = await model.getBookmarks(memberId);
        res.status(200).json(bookmarks);
    } catch (error) {
        console.error('북마크 정보 가져오기 오류:', error);
        res.status(500).json({ error: '북마크 정보를 가져오는데 실패했습니다.' });
    }
});

module.exports = router;
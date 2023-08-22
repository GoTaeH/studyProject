const gameinfoDiv = document.getElementById('gameinfo');
const gameId = window.location.pathname.split('/').pop();
fetch(`/api/game`)
    .then(response => {
        if (!response.ok) {
            throw new Error('데이터 가져오기 실패');
        }
        return response.json();
    })
    .then(games => {
        const targetGame = games.find(game => game.gameid === gameId);

        if(targetGame) {
            const gameDiv = document.createElement('div');
            gameDiv.classList.add('content');

            const gameImg = document.createElement('img');
            gameImg.classList.add('gm_img');
            gameImg.src = `/image/${targetGame.gameid}.png`;

            const gameName = document.createElement('p');
            gameName.textContent = `${targetGame.name}`;

            const gamePrice = document.createElement('p');
            gamePrice.textContent = `가격: ${targetGame.price}`;

            const gameDetail = document.createElement('p');
            gameDetail.textContent = `설명 : ${targetGame.detail}`;

            gameDiv.appendChild(gameName);
            gameDiv.appendChild(gamePrice);
            gameDiv.appendChild(gameDetail);
            gameinfoDiv.appendChild(gameDiv);
        }
    })
    .catch(error => {
        console.error('데이터 가져오기 오류:', error);
    });

// 북마크 기능
const bookmarkDiv = document.querySelector('.bookmark');
const bookmarkImg = document.createElement('img');

bookmarkImg.src = '/image/emptystar.png';
bookmarkImg.alt = 'Bookmark';

// 로그인한 유저의 id 가져오기
async function getUserId() {
    try {
        const response = await fetch('/api/userinfo');
        const userInfo = await response.json();
        if (response.ok) {
            console.log('userInfo.id:', userInfo.id);
            if (userInfo && userInfo.id) {
                return userInfo.id;
            } else {
                console.error('사용자 정보에 이메일이 없습니다.');
                return null;
            }
        } else {
            console.error('사용자 정보 가져오기 실패');
            return null;
        }
    } catch (error) {
        console.error('사용자 정보 가져오기 오류:', error);
        return null;
    }
}
bookmarkImg.addEventListener('click', async () => {
    try {
        const userId = await getUserId();
        console.log('userId:', userId);
        if(userId === null) {
            alert('로그인 후 북마크 기능을 사용할 수 있습니다.');
            return;
        }

        const isBookmarked = bookmarkImg.src.includes('/image/yellowstar.png');
        const bookmarkStatus = !isBookmarked ? 1 : 0;

        const response = await fetch('/api/bookmark', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                gameId: gameId,
                memberId: userId,
                bookmarked: bookmarkStatus
            })
        });
        if (response.ok) {
            bookmarkImg.src = bookmarkStatus === 1 ? '/image/yellowstar.png' : '/image/emptystar.png';
            bookmarkImg.alt = bookmarkStatus === 1 ? 'Bookmarked' : 'Bookmark';
            alert(bookmarkStatus === 1 ? '게임이 북마크에 추가되었습니다.' : '게임이 북마크에서 제거되었습니다.');

            if (localStorage) {
                const storedBookmarks = JSON.parse(localStorage.getItem('bookmarks')) || {};
                storedBookmarks[gameId] = bookmarkStatus === 1;
                localStorage.setItem('bookmarks', JSON.stringify(storedBookmarks));
            }
        } else {
            console.error('북마크 업데이트 실패');
            alert('북마크 업데이트에 실패했습니다.');
        }
    } catch (error) {
        console.error('북마크 업데이트 오류:', error);
        alert('북마크 업데이트 중 오류가 발생했습니다.');
    }
});
bookmarkDiv.appendChild(bookmarkImg);

// 북마크 정보 가져오기
async function loadBookmarks(userId) {
    try {
        const response = await fetch(`/api/bookmark/${userId}`);
        const bookmarks = await response.json();
        
        bookmarks.forEach(bookmark => {
            const gameDiv = document.querySelector(`[data-gameid="${bookmark.game_gameid}"]`);
            if (gameDiv) {
                const bookmarkImg = gameDiv.querySelector('img');
                if (bookmark.bookmarked === 1) {
                    bookmarkImg.src = '/image/yellowstar.png';
                    bookmarkImg.alt = 'Bookmarked';
                }
            }
        });
    } catch (error) {
        console.error('북마크 정보 가져오기 오류:', error);
    }
}

window.addEventListener('load', async () => {
    const userId = await getUserId();
    if (userId !== null) {
        loadBookmarks(userId);
    }

    // 이전에 클릭한 북마크 상태 가져오기
    const storedBookmarks = JSON.parse(localStorage.getItem('bookmarks')) || {};
    if (storedBookmarks[gameId]) {
        bookmarkImg.src = '/image/yellowstar.png';
        bookmarkImg.alt = 'Bookmarked';
    }
});


// 리뷰 작성 및 등록
const reviewInput = document.getElementById('reviewInput');
const submitReviewButton = document.getElementById('submitReview');

submitReviewButton.addEventListener('click', async () => {
    const reviewText = reviewInput.value;
    const userLoggedIn = submitReviewButton.getAttribute('data-userLoggedIn') === 'true';

    if(userLoggedIn) {
        if(reviewText.trim() !== '') {
            try {
                // 중복 리뷰 체크
                const duplicateResponse = await fetch(`/api/checkDuplicate?gameid=${gameId}`);
                if (!duplicateResponse.ok) {
                    console.error('중복 리뷰 체크 실패');
                    alert('리뷰 중복 확인에 실패했습니다.');
                    return;
                }
                const duplicateCheck = await duplicateResponse.json();
                if (duplicateCheck.hasDuplicateReview) {
                    alert('이미 해당 게임의 리뷰를 작성하셨습니다.');
                    return;
                }
                // 리뷰 등록
                const response = await fetch('/api/review', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        gameid: gameId,
                        contents: reviewText
                    })
                });
                if(response.ok) {
                    const newReview = document.createElement('div');
                    newReview.classList.add('review');
                    newReview.textContent = reviewText;
                    reviewContainer.appendChild(newReview);

                    console.log('리뷰 성공적 제출:', reviewText);
                    alert('리뷰가 성공적으로 등록되었습니다.');
                    reviewInput.value = '';

                    updateReviews();
                } else {
                    console.error('리뷰 저장 실패');
                    alert('리뷰 등록에 실패했습니다.');
                }
            } catch (error) {
                console.error('리뷰 저장 오류:', error);
                alert('오류로 인해 리뷰를 등록할 수 없습니다.');
            }
        } else {
            alert('리뷰 내용을 입력하세요.');
        }
    } else {
        alert('로그인 후 리뷰를 작성할 수 있습니다.');
    }
});

const reviewContainer = document.createElement('div');
reviewContainer.classList.add('reviews_container');
const updateReviews = async () => {
    try {
        const reviewResponse = await fetch(`/api/game/${gameId}/reviews`);
        if (!reviewResponse.ok) {
            throw new Error('리뷰 데이터 가져오기 실패');
        }
        const reviews = await reviewResponse.json();
        const reviewContainer = document.getElementById('review_data');
        reviewContainer.innerHTML = ''; // 기존 리뷰 컨테이너 내용 초기화

        for (const review of reviews) {
            const reviewElement = document.createElement('div');
            reviewElement.classList.add('review');

            const authorInfo = document.createElement('p');
            authorInfo.classList.add('review_author');
            authorInfo.textContent = `작성자: ${review.email}`;

            const reviewContent = document.createElement('p');
            reviewContent.classList.add('review_content')
            reviewContent.textContent = `${review.contents}`;

            reviewElement.appendChild(authorInfo);
            reviewElement.appendChild(reviewContent);

            reviewContainer.appendChild(reviewElement);
        }
    } catch (error) {
        console.error('리뷰 데이터 가져오기 오류', error);
    }
};

updateReviews();
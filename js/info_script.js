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
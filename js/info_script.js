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
// 리뷰 표시
fetch(`/api/game/${gameId}/reviews`)
    .then(response => {
        if (!response.ok) {
            throw new Error('리뷰 데이터 가져오기 실패');
        }
        return response.json();
    })
    .then(reviews => {
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

        const reviewdataDiv = document.getElementById('review_data');
        reviewdataDiv.appendChild(reviewContainer);
    })
    .catch(error => {
        console.error('리뷰 데이터 가져오기 오류', error);
    });
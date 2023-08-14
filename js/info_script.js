const gameinfoDiv = document.getElementById('gameinfo');
        fetch('/gameinfo')
            .then(response => response.json())
            .then(games => {
                games.forEach(game => {
                    const gameDiv = document.createElement('div');
                    gameDiv.classList.add('content');

                    const gameImg = document.createElement('img');
                    gameImg.classList.add('gm_img');
                    gameImg.src = `/image/${game.id}.png`;

                    const gameName = document.createElement('p');
                    gameName.textContent = `${game.name}`;

                    const gamePrice = document.createElement('p');
                    gamePrice.textContent = `가격: ${game.price}`;

                    const gameDetail = document.createElement('p');
                    gameDetail.textContent = `설명 : ${game.detail}`;

                    gameDiv.appendChild(gameName);
                    gameDiv.appendChild(gamePrice);
                    gameDiv.appendChild(gameDetail);
                    gameinfoDiv.appendChild(gameDiv);
                });
            })
            .catch(error => {
                console.error('데이터 가져오기 오류:', error);
            });

const reviewInput = document.getElementById('reviewInput');
const submitReviewButton = document.getElementById('submitReview');

submitReviewButton.addEventListener('click', () => {
    const reviewText = reviewInput.value;
    const userLoggedIn = submitReviewButton.getAttribute('data-userLoggedIn') === 'true';

    if(userLoggedIn) {
        if(reviewText.trim() !== '') {
        console.log('작성한 리뷰:', reviewText);
        alert('리뷰가 성공적으로 등록되었습니다.');
        reviewInput.value = '';
        } else {
            alert('리뷰 내용을 입력하세요.');
        }
    } else {
        alert('로그인 후 리뷰를 작성할 수 있습니다.');
    }
});
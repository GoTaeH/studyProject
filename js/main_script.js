// 헤더 변경 (로그인 유무)
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/api', {
            method: 'GET',
            credentials: 'include' // 이 옵션을 설정하여 쿠키를 함께 보냄
        });

        const urlParams = new URLSearchParams(window.location.search);
        const isLogged = urlParams.has('logged'); // 쿼리 파라미터 확인

        if (response.ok) {
            const user = await response.json();
            const headerContainer = document.getElementById('header_container');

            if (user.email || isLogged) { // 로그인되었거나 isLogged가 true일 때
                headerContainer.innerHTML = await fetch('/header2').then(response => response.text());
            } else {
                headerContainer.innerHTML = await fetch('/header1').then(response => response.text());
            }
            loadAllGame();
        }
    } catch (error) {
        console.error(error);
    }
});

async function loadAllGame() {
    try {
        const response = await fetch('/api/game', {
            method: 'GET',
            credentials: 'include'
        });
        if(response.ok) {
            const games = await response.json();
            const infoContainer = document.querySelector('.info');
            infoContainer.innerHTML = ''; // 이전 카드 제거

            games.forEach(game => {
                const gameCard = createGameCard(game);
                infoContainer.appendChild(gameCard);
            });

            // 카테고리 클릭
            const categories = document.querySelectorAll('.cat_item');
            categories.forEach(category => {
                category.addEventListener('click', async () => {
                    const categoryId = category.getAttribute('data_catid');
                    const response = await fetch(`/api/cat/${categoryId}`,{
                        method: 'GET',
                        credentials: 'include'
                    });
                    if(response.ok) {
                        const categoryGames = await response.json();
                        infoContainer.innerHTML = '';
                        categoryGames.forEach(game => {
                            const gameCard = createGameCard(game);
                            infoContainer.appendChild(gameCard);
                        });
                    }
                });
            });
        }
    } catch (error) {
        console.error(error);
    }
}

// 게임 카드 생성
function createGameCard(game) {
    const gameCard = document.createElement('div');
    gameCard.classList.add('game');

    const gameImage = document.createElement('img');
    gameImage.classList.add('game_img');
    gameImage.src =  `/image/${game.gameid}.png`;

    const gameName = document.createElement('h4');
    gameName.textContent = game.name;

    const gameCategory = document.createElement('p');
    gameCategory.textContent = game.category;

    gameCard.appendChild(gameImage);
    gameCard.appendChild(gameName);
    gameCard.appendChild(gameCategory);

    gameCard.addEventListener('click', () => {
        window.location.href = `/gameinfo/${game.gameid}`;
    });

    return gameCard;
}

// 페이지 로드 시 게임 정보 불러오기
document.addEventListener('DOMContentLoaded', () => {
    loadAllGame();
});
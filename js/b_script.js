// 페이지 로드가 완료되었을 때 실행
window.addEventListener('load', async () => {
    const userId = await getUserId();
    if (userId !== null) {
        const userEmail = await getUserEmail();
        if (userEmail !== null) {
            document.querySelector('.welcomeuser').textContent = `${userEmail}님의 즐겨찾기 목록`;

            loadBookmarks(userId);
        }
    } else {
        const messageDiv = document.querySelector('.message');
        messageDiv.textContent = '로그인 후 즐겨찾기 목록을 확인할 수 있습니다.';
    }
});

// 사용자 이메일 가져오기
async function getUserEmail() {
    try {
        const response = await fetch('/api/userEmail');
        const data = await response.json();
        return data.email;
    } catch (error) {
        console.error('사용자 이메일 가져오기 오류:', error);
        return null;
    }
}

async function loadBookmarks(userId) {
    try {
        const response = await fetch(`/api/bookmark/${userId}`);
        const bookmarks = await response.json();
        console.log(bookmarks);

        const bookmarkedGamesContainer = document.querySelector('.bookmark_games');
        bookmarkedGamesContainer.innerHTML = '';

        const table = document.createElement('table');
        table.classList.add('bookmark_table');

        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        const gameNameHeader = document.createElement('th');
        gameNameHeader.textContent = '게임 이름';
        const priceHeader = document.createElement('th');
        priceHeader.textContent = '가격';
        const bookmarkHeader = document.createElement('th');
        bookmarkHeader.textContent = '즐겨찾기';

        headerRow.appendChild(gameNameHeader);
        headerRow.appendChild(priceHeader);
        headerRow.appendChild(bookmarkHeader);
        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement('tbody');

        for (const bookmark of bookmarks) {
            try {
                if (bookmark.bookmarked === 1) {
                    const gameResponse = await fetch(`/api/game?gameid=${bookmark.game_gameid}`);
                    const gameInfoArray = await gameResponse.json();
        
                    // 게임 정보 배열에서 해당 게임 정보 찾기
                    const gameInfo = gameInfoArray.find(game => game.gameid === bookmark.game_gameid);
        
                    if (gameInfo) {
                        const newRow = document.createElement('tr');
                        const gameNameCell = document.createElement('td');
                        gameNameCell.classList.add('game_name');
                        gameNameCell.textContent = gameInfo.name; // 게임 이름
                        const priceCell = document.createElement('td');
                        priceCell.classList.add('game_price');
                        priceCell.textContent = gameInfo.price; // 가격
                        const bookmarkCell = document.createElement('td');
        
                        const bookmarkImg = document.createElement('img');
                        bookmarkImg.src = '/image/yellowstar.png';
                        bookmarkImg.alt = 'Bookmarked';
        
                        bookmarkCell.appendChild(bookmarkImg);
        
                        newRow.appendChild(gameNameCell);
                        newRow.appendChild(priceCell);
                        newRow.appendChild(bookmarkCell);
        
                        tbody.appendChild(newRow);

                        const guideMessage = document.querySelector('.guide');
                        guideMessage.style.display = 'block';
                    }
                }
        
            } catch (error) {
                console.error('게임 정보 가져오기 오류:', error);
            }
        }

        table.appendChild(tbody);
        bookmarkedGamesContainer.appendChild(table);

    } catch (error) {
        console.error('북마크 정보 가져오기 오류:', error);
    }
}


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
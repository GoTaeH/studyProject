const { response } = require("express");

var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
    if(this.readyState == 4 && this.status == 200) {
        document.getElementById("header_container").innerHTML = this.responseText;
    }
};
xhttp.open("GET", "/header", true);
xhttp.send();

let currentPage = 1;    // 페이지 번호 초기 값
// 페이지 버튼 클릭 이벤트 처리
const pageBtn = document.querySelectorAll('.num_btn');
pageBtn.forEach(btn => {
    btn.addEventListener('clike', () => {
        const newPage = btn.dataset.page;
        if(newPage !== currentPage) {
            currentPage = newPage; // 현재 페이지 번호 업데이트
            fetch(`/game?page=${page}&itemPerPage=6`)
                .then(response => response.json())
                .then(data => {
                    updatePageContent(data);
                })
                .catch(error => {
                    console.error(error);
                });
        }
    });
});

// 페이지 내용 업데이트
function updatePageContent(data) {
    const gameContainer = document.querySelector('.info');
    gameContainer.innerHTML = '';

    data.item.forEach(game => {
        const gameElement = document.createElement('div');
        gameElement.className = 'game';
        gameElement.innerHTML = `
        <img class"game_img src="../image/${game.id}.png">
        <h3>${game.name}</h3><p>${game.category_catname}</p>`;
        gameContainer.appendChild(gameElement);
    });
}
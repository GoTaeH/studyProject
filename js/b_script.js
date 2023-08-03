// 헤더 불러오기
var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
    if(this.readyState == 4 && this.status == 200) {
        document.getElementById("header_container").innerHTML = this.responseText;
    }
};
xhttp.open("GET", "/header", true);
xhttp.send();

// 별 모양 클릭 시 이미지 변경
function toggleFavorite(btnElement) {
    const starElement = btnElement.querySelector('.star');
    starElement.classList.toggle('star-filled');
}
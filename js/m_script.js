function check() {
    alert("사용할 수 있는 아이디입니다.")
}

const backLogin = document.getElementById("backLogin");
backLogin.addEventListener("click", function () {
    window.close();
});
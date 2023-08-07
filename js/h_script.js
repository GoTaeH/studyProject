function logout() {
    // 로그아웃 로직 처리 후, 버튼 보이도록 변경, 로그인 버튼 숨김
    document.querySelector('.logout-btn').style.display = 'none';
    document.querySelector('.login-btn').style.display = 'block';
}

function updateBtn(isLoggedIn) {
    const loginBtn = document.getElementById('login_btn');
    const logoutBtn = document.querySelector('.logout_btn');

    if(isLoggedIn) {
        loginBtn.style.display = 'none';
        logoutBtn.style.display = 'block';
    } else {
        loginBtn.style.display = 'block';
        logoutBtn.style.display = 'none';
    }
}

// 사용자가 로그인,로그아웃 했을 때 호출될 함수 (true:로그인됨, false:로그아웃됨)
updateBtn(isLoggedIn);
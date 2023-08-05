function check() {
    alert("사용할 수 있는 아이디입니다.")
}

function backLogin() {
    // 원래 창에 메시지 보내기
    window.opener.postMessage('closeMem', '*');
}
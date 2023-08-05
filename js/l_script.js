function memOpen() {
    const newWindow = window.open('/login/membership');

    // 회원가입 창에서 버튼 누르면 다시 로그인 창으로 돌아오는 이벤트
    newWindow.addEventListener('message', (event) => {
        if(event.data == 'closeMem') {
            newWindow.close();
        }
    });
}
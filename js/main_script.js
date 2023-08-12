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
        }
    } catch (error) {
        console.error(error);
    }
});

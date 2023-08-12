document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const errorMessage = urlParams.get('error');
    
    if (errorMessage === 'authFailed') {
        const errorMessageP = document.getElementById('error-message');
        errorMessageP.textContent = '이메일 또는 비밀번호가 틀렸습니다.';
        errorMessageP.style.display = 'block';
    } else if (errorMessage === 'missingFields') {
        const errorMessageP = document.getElementById('error-message');
        errorMessageP.textContent = '이메일 또는 비밀번호가 입력되지 않았습니다.';
        errorMessageP.style.display = 'block';
    }
});

function memOpen() {
    window.open('/membership', 'join the membership', 'width=700, height=700');
}
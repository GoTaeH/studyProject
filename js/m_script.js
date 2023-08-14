function createAccount() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const requestData = {
        email: email,
        password: password
    };

    fetch('/membership', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('계정이 생성되었습니다.');
            window.close();
        } else {
            alert('이미 사용 중인 이메일입니다.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// 중복 확인
function checkEmail() {
    const email = document.getElementById('email').value;

    fetch('/check', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email})
    })
    .then(response => response.json())
    .then(data => {
        if (data.exists) {
            alert('이미 사용 중인 이메일입니다.');
        } else {
            alert('사용 가능한 이메일입니다.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
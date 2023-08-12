function createAccount() {
    console.log('createAccout 함수 실행');
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const requestData = {
        email: email,
        password: password
    };

    console.log('보내는 데이터:', requestData);
    fetch('/membership', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('서버응답:', data);
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
    console.log('checkEmail 함수 실행');
    const email = document.getElementById('email').value;

    console.log('확인할 이메일:', email);
    fetch('/check', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email})
    })
    .then(response => response.json())
    .then(data => {
        console.log('서버 응답:', data);
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
document.getElementById('register-form').addEventListener('submit', function(event) {
    event.preventDefault();

    var username = document.getElementById('username').value;
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    var confirmPassword = document.getElementById('confirm-password').value;

    if (password !== confirmPassword) {
        alert('Mật khẩu không khớp. Vui lòng nhập lại.');
        return;
    } else {
        var data = {
            username: username,
            email: email,
            password: password
        };

        fetch('http://localhost:8081/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Tên người dùng đã tồn tại hoặc đã xảy ra lỗi trên máy chủ.');
            }
        })
        .then(data => {
            alert('Đăng ký thành công!');
            // Redirect or do something else after successful registration
            window.location.href = "LoginForm.html";
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Đã xảy ra lỗi trong quá trình đăng ký: ' + error.message);
        });
    }
});

// Thêm sự kiện click cho nút "Quay lại"
document.getElementById("back-button").addEventListener("click", function() {
    // Chuyển hướng người dùng đến trang đăng nhập
    window.location.href = "LoginForm.html";
});

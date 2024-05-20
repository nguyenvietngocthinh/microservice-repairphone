// Lắng nghe sự kiện khi form đăng nhập được gửi đi
document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Ngăn chặn hành động mặc định của form

    // Lấy thông tin đăng nhập từ form
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    // Gửi yêu cầu đăng nhập đến API
    fetch('http://localhost:8081/auth/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    })
    .then(response => response.json())
    .then(data => {
        // Lưu mã thông báo truy cập vào localStorage hoặc sessionStorage
        localStorage.setItem('accessToken', data.token);

        // Giải mã token để lấy thông tin người dùng, bao gồm vai trò của họ
        var decodedToken = decodeToken(data.token);
        console.log(decodedToken.role);

        // Kiểm tra vai trò của người dùng và chuyển hướng tương ứng
        if (decodedToken.role == 'ADMIN') {
            // Nếu là ADMIN, chuyển hướng đến trang adminpage
            window.location.href = 'AdminPage.html';
        } else {
            // Nếu không phải là ADMIN, chuyển hướng đến trang homepage
            window.location.href = 'HomePage.html';
        }
    })
    .catch(error => console.error('Lỗi:', error));
});

// Hàm giải mã token
function decodeToken(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}

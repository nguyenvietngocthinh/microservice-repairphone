 $(document).ready(function () {
    // Lấy token từ localStorage
    var token = localStorage.getItem('accessToken');  
    if (!token) {
        // Nếu không có token, chuyển hướng người dùng về trang login
        window.location.href = 'LoginForm.html';
        return;
    }
    
    // Gọi API để kiểm tra tính hợp lệ của token
    fetch('http://localhost:8081/auth/introspect', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: token })
    })
    .then(function (response) {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(function (data) {
        // Nếu token không hợp lệ, chuyển hướng người dùng về trang login
        if (!data.valid) {
            window.location.href = 'LoginForm.html';
        } else {
            // Giải mã token
            function decodeToken(token) {
            var base64Url = token.split('.')[1];
            var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
                return JSON.parse(jsonPayload);
            }
                
            // Lấy thông tin người dùng từ token
            var decodedToken = decodeToken(token);  
            console.log(decodedToken);  
            var username = decodedToken.sub;
            var userId = decodedToken.userId;
                
            // Hiển thị tên người dùng lên trang
            $('#username').html('Xin chào, <strong>' + username + '</strong>!');  

            // Gọi API để lấy danh sách sản phẩm của người dùng
            fetch('http://localhost:8080/products/user/' + userId) // Thay port bằng cổng của ứng dụng của bạn
                .then(function (response) {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(function (data) {
                    // Xử lý dữ liệu trả về để hiển thị danh sách sản phẩm
                    var productListHtml = '';
                    data.forEach(function (product) {
                        var processClass = ''; 
                        var processStatus = '';
                        switch(product.process) {
                            case 'PENDING':
                                
                                processClass = 'pending-border';
                                break;
                            case 'APPROVED':
                                
                                processClass = 'approved-border';
                                break;
                            case 'FINISHED':
                                
                                processClass = 'finished-border';
                                break;
                            case 'REJECTED':
                               
                                processClass = 'rejected-border';
                                break;
                            default:
                                processClass = 'pending-border';
                                break;
                        }

                        
                        
                        productListHtml += '<div class="col-md-4">';
                        productListHtml += '<div class="product-card ' + processClass + '">';
                        productListHtml += '<h5> Tên máy: ' + product.phoneName + '</h5>';
                        productListHtml += '<p> Mô tả: ' + product.description + '</p>';
                        if(product.process == 'PENDING'){
                            productListHtml += '<p>Tiến trình: Chờ xử lý </p>';
                        }else if(product.process == 'APPROVED'){
                            productListHtml += '<p>Tiến trình: Đang sửa chữa </p>';
                        }else if(product.process == 'FINISHED'){
                            productListHtml += '<p>Tiến trình: Hoàn thành </p>';
                        }else{
                            productListHtml += '<p>Tiến trình: Từ chối </p>';
                        }
                        productListHtml += '<button class="btn btn-primary profile-product-button" data-product-id="' + product.id + '">Xem chi tiết</button>';
                        productListHtml += '</div>';
                        productListHtml += '</div>';

                    });
                    var productListElement = document.getElementById('productList');
                    productListElement.innerHTML = productListHtml;
                })
                .catch(function (error) {
                    console.error('Error fetching product list:', error);
            });

            document.addEventListener('click', function (event) {
                if (event.target && event.target.classList.contains('profile-product-button')) {
                    var productId = event.target.getAttribute('data-product-id');
                    localStorage.setItem('profileProductId', productId);
                    window.location.href = 'ProfileProduct.html';
                }
            });
            ////Them san pham
            document.getElementById('saveProductButton').addEventListener('click', function () {
            var productName = document.getElementById('productNameInput').value;
            var productDescription = document.getElementById('productDescriptionInput').value;

            var data = {
                phoneName: productName,
                description: productDescription,
                userId: userId
            };

            fetch('http://localhost:8080/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then(response => response.json())
                .then(data => {
                    alert('Sản phẩm đã được thêm thành công!');
                    loadProductList(userId);
                })
                .catch(error => {
                    console.error('Lỗi:', error);
                    alert('Đã xảy ra lỗi khi thêm sản phẩm.');
                });
            });
            
            
            
            ////Ham reload danh sach san pham
            function loadProductList(userId) {
            fetch('http://localhost:8080/products/user/' + userId)
                .then(function (response) {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(function (data) {
                    // Xử lý dữ liệu trả về để hiển thị danh sách sản phẩm
                    var productListHtml = '';
                    data.forEach(function (product) {
                        var processClass = ''; 
                        var processStatus = '';
                        switch(product.process) {
                            case 'PENDING':
                                processStatus = 'Đang chờ duyệt';
                                processClass = 'pending-border';
                                break;
                            case 'APPROVED':
                                processStatus = 'Đang xử lý';
                                processClass = 'approved-border';
                                break;
                            case 'FINISHED':
                                processStatus = 'Hoàn thành';
                                processClass = 'finished-border';
                                break;
                            case 'REJECTED':
                                processStatus = 'Từ chối';
                                processClass = 'rejected-border';
                                break;
                            default:
                                processClass = 'pending-border';
                                break;
                        }

                        

                       productListHtml += '<div class="col-md-4">';
                        productListHtml += '<div class="product-card ' + processClass + '">';
                        productListHtml += '<h5> Tên máy: ' + product.phoneName + '</h5>';
                        productListHtml += '<p> Mô tả: ' + product.description + '</p>';
                         if(product.process == 'PENDING'){
                            productListHtml += '<p>Tiến trình: Chờ xử lý </p>';
                        }else if(product.process == 'APPROVED'){
                            productListHtml += '<p>Tiến trình: Đang sửa chữa </p>';
                        }else if(product.process == 'FINISHED'){
                            productListHtml += '<p>Tiến trình: Hoàn thành </p>';
                        }else{
                            productListHtml += '<p>Tiến trình: Từ chối </p>';
                        }
                        productListHtml += '<button class="btn btn-primary update-product-button" data-product-id="' + product.id + '">Xem chi tiết</button>';
                        productListHtml += '</div>';
                        productListHtml += '</div>';
                    });
                    var productListElement = document.getElementById('productList');
                    productListElement.innerHTML = productListHtml;
                })
                .catch(function (error) {
                    console.error('Error fetching product list:', error);
                });

            
}
        }
    })
    .catch(function (error) {
        console.error('Error checking token validity:', error);
        // Nếu có lỗi, cũng chuyển hướng người dùng về trang login
        window.location.href = 'LoginForm.html';
    });

    //Dang xuat
            document.getElementById('logoutButton').addEventListener('click', function () {
            // Xóa accessToken từ localStorage
            localStorage.removeItem('accessToken');
            // Chuyển hướng người dùng về trang đăng nhập
            window.location.href = 'LoginForm.html';
        });
});
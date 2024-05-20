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
            // Admin.js

            // Thêm function để load danh sách người dùng vào combobox
            function loadUserList() {
                fetch('http://localhost:8081/users') // Endpoint mới để lấy danh sách người dùng
                    .then(function (response) {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    })
                    .then(function (data) {
                        var userListHtml = '';
                        data.forEach(function (user) {
                            // Kiểm tra nếu tên người dùng không phải là "admin" thì mới thêm vào danh sách
                            if (user.username !== 'admin') {
                                userListHtml += '<option value="' + user.id + '">' + user.username + '</option>'; // Thay userId và username bằng các trường tương ứng
                            }
                        });
                        var userIdInput = document.getElementById('userIdInput');
                        userIdInput.innerHTML = userListHtml; // Điền dữ liệu vào combobox
                    })
                    .catch(function (error) {
                        console.error('Error fetching user list:', error);
                    });
            }

            // Gọi function loadUserList khi modal được mở
            $('#addProductModal').on('show.bs.modal', function (e) {
                loadUserList();
            });

            // Gọi API để lấy danh sách sản phẩm của người dùng
            fetch('http://localhost:8080/products') // Thay port bằng cổng của ứng dụng của bạn
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
                        productListHtml += '<button class="btn btn-primary update-product-button" data-product-id="' + product.id + '">Cập nhật</button>';
                         productListHtml += '<button class="btn btn-danger delete-product-button" data-product-id="' + product.id + '" style="margin-left: 10px">Xóa</button>';
                        productListHtml += '</div>';
                        productListHtml += '</div>';

                    });
                    var productListElement = document.getElementById('productList');
                    productListElement.innerHTML = productListHtml;
                })
                .catch(function (error) {
                    console.error('Error fetching product list:', error);
            });

            ////Them san pham
            document.getElementById('saveProductButton').addEventListener('click', function () {
            var productName = document.getElementById('productNameInput').value;
            var productDescription = document.getElementById('productDescriptionInput').value;
            var productStatus = document.getElementById('productStatusInput').value;
            var userIdC = document.getElementById('userIdInput').value;
            console.log(userIdC);
             

            var statusSet = [productStatus];

            var data = {
                phoneName: productName,
                description: productDescription,
                status: statusSet,
                userId: userIdC,
                
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
                    loadProductList();
                })
                .catch(error => {
                    console.error('Lỗi:', error);
                    alert('Đã xảy ra lỗi khi thêm sản phẩm.');
                });
            });

            document.addEventListener('click', function (event) {
                if (event.target && event.target.classList.contains('delete-product-button')) {
                    var productId = event.target.getAttribute('data-product-id');
                        deleteProduct(productId);
                    }
                if (event.target && event.target.classList.contains('update-product-button')) {
                    var productId = event.target.getAttribute('data-product-id');
                    localStorage.setItem('updateProductId', productId);
                    window.location.href = 'UpdateProduct.html';
                }
            });
            function deleteProduct(productId) {
                fetch('http://localhost:8080/products/' + productId, {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        })
                        .then(function (response) {
                            if (!response.ok) {
                                throw new Error('Network response was not ok');
                            }
                            return response.json();
                        })
                        .then(function (data) {
                            alert('Sản phẩm đã được xóa thành công!');
                            loadProductList(); // Tải lại danh sách sản phẩm sau khi xóa
                        })
                        .catch(function (error) {
                            console.error('Lỗi:', error);
                            alert('Đã xảy ra lỗi khi xóa sản phẩm.');
                        });
                    }

            ////Ham reload danh sach san pham
            function loadProductList() {
            fetch('http://localhost:8080/products')
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
                        productListHtml += '<button class="btn btn-primary update-product-button" data-product-id="' + product.id + '">Cập nhật</button>';
                         productListHtml += '<button class="btn btn-danger delete-product-button" data-product-id="' + product.id + '" style="margin-left: 10px">Xóa</button>';
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
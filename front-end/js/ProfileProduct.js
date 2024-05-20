 // Hàm chuyển đổi trạng thái tiến trình từ Set<String> sang các trạng thái tương ứng
        function convertProcess(process) {
            if (process.includes("PENDING")) {
                return "Chờ xử lý";
            } else if (process.includes("APPROVED")) {
                return "Đang sửa chữa";
            } else if (process.includes("FINISHED")) {
                return "Hoàn thành";
            } else {
                return "Từ chối";
            }
        }

        function convertStatus(status) {
            if (status.includes("LOW")) {
                return "Nhẹ";
            } else if (status.includes("MEDIUM")) {
                return "Vừa";
            } else if (status.includes("HIGH")) {
                return "Nặng";
            } else {
                return "Hỏng";
            }
        }

        document.addEventListener('DOMContentLoaded', function () {
            var productId = localStorage.getItem('profileProductId');
            var paymentCompleted = false;
            if (!productId) {
                alert('Không tìm thấy chi tiết sản phẩm.');
                window.location.href = 'HomePage.html';
                return;
            }

            fetch('http://localhost:8080/products/' + productId)
                .then(response => response.json())
                .then(data => {
                    document.getElementById('profileProductNameInput').value = data.phoneName;
                    document.getElementById('profileProductDescriptionInput').value = data.description;
                    document.getElementById('profileProductStatusInput').value = convertStatus(data.status);
                    document.getElementById('profileProductProcessInput').value = convertProcess(data.process);
                    document.getElementById('profileUserIdInput').value = data.userId;
                    document.getElementById('profileProductNotesInput').value = data.notes;

                    if (data.process.includes("FINISHED")) {
                         var componentDetails = data.components.map(component => component.componentName + " - " + component.price+".000" + " VND").join("\n");
                        var totalPayment = data.components.reduce((sum, component) => sum + component.price, 0);
                        document.getElementById('componentDetails').value = componentDetails;
                        document.getElementById('paymentAmount').value = totalPayment+".000" + " VND";
                        document.getElementById('paymentDetails').style.display = 'block';
                        document.getElementById('paymentButton').style.display = 'block';

                        console.log(totalPayment);

                        document.getElementById('paymentButton').addEventListener('click', function () {
                            fetch("http://localhost:3000/create-checkout-session", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                    totalPayment: totalPayment, // Gửi tổng số tiền cần thanh toán
                                }),
                            })
                            .then(res => {
                                if (res.ok) return res.json()
                                return res.json().then(json => Promise.reject(json))
                            })
                            .then(({ url }) => {
                                window.location = url;
                            })
                            .catch(e => {
                                console.error(e.error)
                            });
                        });
                    }
                })
                .catch(error => {
                    console.error('Lỗi:', error);
                    alert('Đã xảy ra lỗi khi tải dữ liệu sản phẩm.');
                });

            document.getElementById('backToHomePageButton').addEventListener('click', function () {
                window.location.href = 'HomePage.html';
            });

           

});
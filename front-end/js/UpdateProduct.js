document.addEventListener('DOMContentLoaded', function () {
    var productId = localStorage.getItem('updateProductId');
    if (!productId) {
        alert('Không tìm thấy sản phẩm để cập nhật.');
        window.location.href = 'AdminPage.html';
        return;
    }

    var initialComponentsState = {};

    fetch('http://localhost:8080/products/' + productId)
        .then(response => response.json())
        .then(data => {
            document.getElementById('updateProductNameInput').value = data.phoneName;
            document.getElementById('updateProductDescriptionInput').value = data.description;
            document.getElementById('updateProductStatusInput').value = data.status;
            document.getElementById('updateProductProcessInput').value = data.process;
            document.getElementById('updateUserIdInput').value = data.userId;
            document.getElementById('updateProductNotesInput').value = data.notes;

            // Set the component checkboxes based on the data
            data.components.forEach(component => {
                var checkbox = document.querySelector(`.component-checkbox[data-component-name="${component.componentName}"]`);
                if (checkbox) {
                    checkbox.checked = true;
                }
            });
        })
        .catch(error => {
            console.error('Lỗi:', error);
            alert('Đã xảy ra lỗi khi tải dữ liệu sản phẩm.');
        });

    document.getElementById('updateProductButton').addEventListener('click', function () {
        var productName = document.getElementById('updateProductNameInput').value;
        var productStatus = document.getElementById('updateProductStatusInput').value;
        var productProcess = document.getElementById('updateProductProcessInput').value;
        var productNotes = document.getElementById('updateProductNotesInput').value;

        var selectedComponents = document.querySelectorAll('.component-checkbox:checked');
         var components = Array.from(selectedComponents).filter(checkbox => {
            var componentName = checkbox.getAttribute('data-component-name');
            var isChecked = checkbox.checked;
            // Only include components that have changed
            return initialComponentsState[componentName] !== isChecked;
        }).map(checkbox => ({
            componentName: checkbox.getAttribute('data-component-name'),
            price: checkbox.getAttribute('data-price')
        }));

        var statusSet = [productStatus];
        var processSet = [productProcess];

        var data = {
            phoneName: productName,
            status: statusSet,
            process: processSet,
            notes: productNotes,
            components: components
        };

        fetch('http://localhost:8080/products/' + productId, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            alert('Sản phẩm đã được cập nhật thành công!');
            window.location.href = 'AdminPage.html';
        })
        .catch(error => {
            console.error('Lỗi:', error);
            alert('Đã xảy ra lỗi khi cập nhật sản phẩm.');
        });
    });

    document.getElementById('backToAdminButton').addEventListener('click', function () {
        window.location.href = 'AdminPage.html';
    });
});

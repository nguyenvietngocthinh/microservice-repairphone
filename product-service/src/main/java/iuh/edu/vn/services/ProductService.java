package iuh.edu.vn.services;

import iuh.edu.vn.models.Product;
import iuh.edu.vn.models.dtos.ProductCreateDto;
import iuh.edu.vn.models.dtos.ProductUpdateDto;

import java.util.List;

public interface ProductService {
    Product createProduct(ProductCreateDto productCreateDtoDto);
    Product updateProduct(int id, ProductUpdateDto productUpdateDto);
    void deleteProduct(int id);
    List<Product> getAllProducts();
    Product getProductById(int id);
    List<Product> getProductsByUserId(int userId);
}

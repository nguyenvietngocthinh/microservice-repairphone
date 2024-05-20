package iuh.edu.vn.controller;

import iuh.edu.vn.models.Product;
import iuh.edu.vn.models.dtos.ProductCreateDto;
import iuh.edu.vn.models.dtos.ProductUpdateDto;
import iuh.edu.vn.services.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/products")
@CrossOrigin(origins = "http://127.0.0.1:5500/")
public class ProductController {
    @Autowired
    private ProductService productService;

    @PostMapping
    Product productCreate(@RequestBody ProductCreateDto productCreateDto) {
        return productService.createProduct(productCreateDto);
    }

    @GetMapping
    List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    @GetMapping("/{id}")
    Product getProductById(@PathVariable int id) {
        return productService.getProductById(id);
    }

    @PutMapping("/{id}")
    Product updateProduct(@PathVariable int id, @RequestBody ProductUpdateDto productUpdateDto) {
        return productService.updateProduct(id, productUpdateDto);
    }

    @DeleteMapping("/{id}")
    public Map<String, String> deleteProduct(@PathVariable int id) {
        productService.deleteProduct(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Product has been deleted successfully");
        return response;
    }


    @GetMapping("/user/{userId}")
    List<Product> getProductsByUserId(@PathVariable int userId) {
        return productService.getProductsByUserId(userId);
    }
}

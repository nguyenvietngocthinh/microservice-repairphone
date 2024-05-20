package iuh.edu.vn.services.impl;

import iuh.edu.vn.enums.Process;
import iuh.edu.vn.models.Product;
import iuh.edu.vn.models.ProductComponent;
import iuh.edu.vn.models.dtos.ProductCreateDto;
import iuh.edu.vn.models.dtos.ProductUpdateDto;
import iuh.edu.vn.repository.ProductRepository;
import iuh.edu.vn.services.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductServiceImpl implements ProductService {
    @Autowired
    private ProductRepository productRepository;


    @Override
    public Product createProduct(ProductCreateDto productCreateDto) {
        Product product = new Product();

        product.setPhoneName(productCreateDto.getPhoneName());
        product.setDescription(productCreateDto.getDescription());
        product.setUserId(productCreateDto.getUserId());

        HashSet<String> process = new HashSet<>();
        process.add(Process.PENDING.name());

        product.setProcess(process);
        product.setStatus(productCreateDto.getStatus());
        product.setNotes(productCreateDto.getNotes());

        return productRepository.save(product);
    }

    @Override
    public Product updateProduct(int id, ProductUpdateDto productUpdateDto) {
        Product product = getProductById(id);

        product.setPhoneName(productUpdateDto.getPhoneName());
        product.setStatus(productUpdateDto.getStatus());
        product.setProcess(productUpdateDto.getProcess());
        product.setNotes(productUpdateDto.getNotes());

        // Convert ProductComponentDto to ProductComponent
        List<ProductComponent> components = productUpdateDto.getComponents().stream()
                .map(dto -> new ProductComponent(dto.getId(), dto.getComponentName(), dto.getPrice()))
                .collect(Collectors.toList());

        product.setComponents(components);

        return productRepository.save(product);
    }



    @Override
    public void deleteProduct(int id) {
        productRepository.deleteById(id);
    }

    @Override
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @Override
    public Product getProductById(int id) {
        return productRepository.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));
    }

    @Override
    public List<Product> getProductsByUserId(int userId) {
        return productRepository.findProductsByUserId(userId);
    }
}

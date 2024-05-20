package iuh.edu.vn.repository;

import iuh.edu.vn.models.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {
    List<Product> findProductsByUserId(int userId);
}

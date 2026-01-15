package com.example.coffee.repository;

import com.example.coffee.entity.Product;
import com.example.coffee.entity.ProductImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductImageRepository extends JpaRepository<ProductImage, Long> {
    void deleteByProduct(Product product);
    List<ProductImage> findByProductOrderBySortOrder(Product product);
}

package com.example.coffee.repository;

import com.example.coffee.entity.Product;
import com.example.coffee.entity.ProductOption;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductOptionRepository extends JpaRepository<ProductOption, Long> {
    List<ProductOption> findByProduct(Product product);
    void deleteByProduct(Product product);
}
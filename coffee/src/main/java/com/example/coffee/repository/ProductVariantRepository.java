package com.example.coffee.repository;

import com.example.coffee.entity.Product;
import com.example.coffee.entity.ProductOption;
import com.example.coffee.entity.ProductVariant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProductVariantRepository extends JpaRepository<ProductVariant, Long> {
    Optional<ProductVariant> findByProductAndOption(Product product, ProductOption option);
    void deleteByOption(ProductOption option);
}
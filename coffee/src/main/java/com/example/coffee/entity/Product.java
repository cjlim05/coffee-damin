package com.example.coffee.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "product")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_id")
    private Long productId;

    @Column(name = "product_name", nullable = false, length = 200)
    private String productName;

    @Column(name = "base_price", nullable = false)
    private Integer basePrice;

    @Column(name = "type", length = 100)
    private String type;

    @Column(name = "continent", length = 50)
    private String continent;

    @Column(name = "nationality", length = 100)
    private String nationality;

    @Column(name = "thumbnail_img", length = 250)
    private String thumbnailImg;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("sortOrder ASC")
    private List<ProductImage> detailImages = new ArrayList<>();
}

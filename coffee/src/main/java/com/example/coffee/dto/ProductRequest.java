package com.example.coffee.dto;

import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductRequest {
    private String productName;
    private int basePrice;
    private String type;
    private String nationality;
    private Long categoryId;
    private String productImg;
    private String thumbnailImg;
    private String detailImg;
    private List<OptionRequest> options;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class OptionRequest {
        private String optionValue;
        private int extraPrice;
        private int stock;
    }
}

package com.example.coffee.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse {
    private Long productId;
    private String productName;
    private Integer basePrice;
    private String type;
    private String continent;
    private String nationality;
    private String thumbnailImg;
    private String detailImg;
    private List<ImageResponse> detailImages;
    private List<OptionResponse> options;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ImageResponse {
        private Long imageId;
        private String imageUrl;
        private Integer sortOrder;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OptionResponse {
        private Long optionId;
        private String optionValue;
        private Integer extraPrice;
        private Integer stock;
    }
}
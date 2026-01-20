package com.example.coffee.dto;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderResponse {
    private Long orderId;
    private MemberSummary member;
    private String status;
    private String statusDisplayName;
    private Integer totalAmount;
    private String shippingAddress;
    private LocalDateTime orderDate;
    private LocalDateTime updatedAt;
    private List<OrderItemResponse> items;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class MemberSummary {
        private Long memberId;
        private String name;
        private String email;
        private String phone;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class OrderItemResponse {
        private Long orderItemId;
        private Long variantId;
        private String productName;
        private String optionValue;
        private Integer quantity;
        private Integer unitPrice;
        private Integer subtotal;
    }
}

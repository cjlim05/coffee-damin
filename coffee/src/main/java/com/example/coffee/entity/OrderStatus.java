package com.example.coffee.entity;

public enum OrderStatus {
    PENDING("대기"),
    PAID("결제완료"),
    SHIPPING("배송중"),
    COMPLETED("완료"),
    CANCELLED("취소");

    private final String displayName;

    OrderStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}

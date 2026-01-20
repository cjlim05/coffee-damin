package com.example.coffee.service;

import com.example.coffee.dto.OrderRequest;
import com.example.coffee.dto.OrderResponse;
import com.example.coffee.entity.*;
import com.example.coffee.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final MemberRepository memberRepository;
    private final ProductVariantRepository variantRepository;

    @Transactional
    public OrderResponse createOrder(OrderRequest request) {
        Member member = memberRepository.findById(request.getMemberId())
                .orElseThrow(() -> new RuntimeException("회원을 찾을 수 없습니다."));

        Order order = Order.builder()
                .member(member)
                .status(OrderStatus.PENDING)
                .shippingAddress(request.getShippingAddress())
                .totalAmount(0)
                .build();

        orderRepository.save(order);

        int totalAmount = 0;
        for (OrderRequest.OrderItemRequest itemReq : request.getItems()) {
            ProductVariant variant = variantRepository.findById(itemReq.getVariantId())
                    .orElseThrow(() -> new RuntimeException("상품 옵션을 찾을 수 없습니다."));

            int unitPrice = variant.getProduct().getBasePrice() + variant.getOption().getExtraPrice();

            OrderItem item = OrderItem.builder()
                    .order(order)
                    .variant(variant)
                    .quantity(itemReq.getQuantity())
                    .unitPrice(unitPrice)
                    .build();

            orderItemRepository.save(item);
            totalAmount += unitPrice * itemReq.getQuantity();
        }

        order.setTotalAmount(totalAmount);
        return toResponse(order);
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAllWithMember().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public OrderResponse getOrder(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("주문을 찾을 수 없습니다."));
        return toResponse(order);
    }

    @Transactional
    public OrderResponse updateOrderStatus(Long id, String status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("주문을 찾을 수 없습니다."));

        OrderStatus newStatus = OrderStatus.valueOf(status);
        order.setStatus(newStatus);

        return toResponse(order);
    }

    @Transactional
    public void deleteOrder(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("주문을 찾을 수 없습니다."));

        orderItemRepository.deleteByOrder(order);
        orderRepository.delete(order);
    }

    private OrderResponse toResponse(Order order) {
        List<OrderItem> items = orderItemRepository.findByOrderWithDetails(order);

        List<OrderResponse.OrderItemResponse> itemResponses = items.stream()
                .map(item -> OrderResponse.OrderItemResponse.builder()
                        .orderItemId(item.getOrderItemId())
                        .variantId(item.getVariant().getVariantId())
                        .productName(item.getVariant().getProduct().getProductName())
                        .optionValue(item.getVariant().getOption().getOptionValue())
                        .quantity(item.getQuantity())
                        .unitPrice(item.getUnitPrice())
                        .subtotal(item.getUnitPrice() * item.getQuantity())
                        .build())
                .collect(Collectors.toList());

        Member member = order.getMember();
        OrderResponse.MemberSummary memberSummary = OrderResponse.MemberSummary.builder()
                .memberId(member.getMemberId())
                .name(member.getName())
                .email(member.getEmail())
                .phone(member.getPhone())
                .build();

        return OrderResponse.builder()
                .orderId(order.getOrderId())
                .member(memberSummary)
                .status(order.getStatus().name())
                .statusDisplayName(order.getStatus().getDisplayName())
                .totalAmount(order.getTotalAmount())
                .shippingAddress(order.getShippingAddress())
                .orderDate(order.getOrderDate())
                .updatedAt(order.getUpdatedAt())
                .items(itemResponses)
                .build();
    }
}

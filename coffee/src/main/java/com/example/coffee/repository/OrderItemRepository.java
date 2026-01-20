package com.example.coffee.repository;

import com.example.coffee.entity.Order;
import com.example.coffee.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    List<OrderItem> findByOrder(Order order);
    void deleteByOrder(Order order);

    @Query("SELECT oi FROM OrderItem oi " +
           "JOIN FETCH oi.variant v " +
           "JOIN FETCH v.product " +
           "JOIN FETCH v.option " +
           "WHERE oi.order = :order")
    List<OrderItem> findByOrderWithDetails(@Param("order") Order order);
}

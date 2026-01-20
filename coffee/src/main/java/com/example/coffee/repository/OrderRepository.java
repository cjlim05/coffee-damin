package com.example.coffee.repository;

import com.example.coffee.entity.Order;
import com.example.coffee.entity.Member;
import com.example.coffee.entity.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByMember(Member member);
    List<Order> findByStatus(OrderStatus status);
    List<Order> findAllByOrderByOrderDateDesc();

    @Query("SELECT o FROM Order o JOIN FETCH o.member ORDER BY o.orderDate DESC")
    List<Order> findAllWithMember();
}

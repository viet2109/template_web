package com.example.be.dao;

import com.example.be.entities.Order;
import com.example.be.enums.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface OrderDao extends CrudRepository<Order, Long>, JpaSpecificationExecutor<Order> {
    Page<Order> findByUser_Id(Long userId, Pageable pageable);

    long countByUser_Id(Long userId);

    long countByStatus(OrderStatus status);

    long countByCreatedAtAfterAndStatus(LocalDateTime createdAtAfter, OrderStatus status);
}

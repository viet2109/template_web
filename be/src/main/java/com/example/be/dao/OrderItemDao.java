package com.example.be.dao;

import com.example.be.entities.OrderItem;
import com.example.be.entities.Template;
import com.example.be.enums.Category;
import com.example.be.enums.OrderStatus;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;

@Repository
public interface OrderItemDao extends CrudRepository<OrderItem, Long> {
    boolean existsByOrder_User_IdAndTemplate_IdAndOrder_Status(Long orderUserId, Long templateId, OrderStatus orderStatus);

    @Query("""
               SELECT COALESCE(SUM(oi.price), 0)\s
                 FROM OrderItem oi
                 JOIN oi.order o
                WHERE o.user.id = :userId
                  AND o.status = :status
            \s""")
    BigDecimal totalSpentByUser(
            @Param("userId") Long userId,
            @Param("status") OrderStatus status
    );

    @Query("""
              SELECT COALESCE(SUM(oi.price * (100 - oi.commissionRate) / 100), 0)
                FROM OrderItem oi
                JOIN oi.order o
               WHERE o.status = :status
            """)
    BigDecimal totalRevenue(@Param("status") OrderStatus status);

    @Query("""
              SELECT COALESCE(SUM(oi.price * (100 - oi.commissionRate) / 100), 0)
                FROM OrderItem oi
                JOIN oi.order o
               WHERE o.status = :status AND oi.template.category = :category
            """)
    BigDecimal totalRevenueByTemplate_Category(@Param("category") Category category, @Param("status") OrderStatus status);

    @Query("""
              SELECT COALESCE(
                SUM(oi.price * (100 - oi.commissionRate) / 100),
                0
              )
              FROM OrderItem oi
              JOIN oi.order o
              WHERE o.status = :status
            """)
    BigDecimal totalCommissions(@Param("status") OrderStatus status);

    boolean existsByTemplate_Id(Long templateId);
}

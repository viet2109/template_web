package com.example.be.dao;

import com.example.be.dto.admin.AdminOrderAnalyticsDto;
import com.example.be.dto.admin.MonthlySalesDto;
import com.example.be.dto.admin.RevenueByCategoryDto;
import com.example.be.dto.admin.RevenueByPeriodDto;
import com.example.be.entities.Order;
import com.example.be.enums.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderDao extends CrudRepository<Order, Long>, JpaSpecificationExecutor<Order> {
    Page<Order> findByUser_Id(Long userId, Pageable pageable);

    long countByUser_Id(Long userId);

    long countByStatus(OrderStatus status);

    long countByCreatedAtAfterAndStatus(LocalDateTime createdAtAfter, OrderStatus status);


    @Query("""
                SELECT new com.example.be.dto.admin.AdminOrderAnalyticsDto(
                    CAST(COUNT(o) AS integer),
                    CAST(
                      SUM(
                        CASE WHEN o.status = com.example.be.enums.OrderStatus.COMPLETED
                             THEN 1 ELSE 0 END
                      )
                      AS integer
                    ),
                    CAST(
                      SUM(
                        CASE WHEN o.status = com.example.be.enums.OrderStatus.PENDING
                             THEN 1 ELSE 0 END
                      )
                      AS integer
                    ),
                    CAST(
                      COALESCE(
                        SUM(oi.price * (1 - oi.commissionRate / 100)),
                      0)
                      AS bigdecimal
                    )
                )
                FROM Order o
                LEFT JOIN o.orderItems oi
            """)
    AdminOrderAnalyticsDto getOrderAnalytic();

    /**
     * Thống kê doanh thu theo chu kỳ (pattern MySQL DATE_FORMAT).
     *
     * @param start    thời điểm bắt đầu
     * @param end      thời điểm kết thúc
     * @param pattern  format string, ví dụ "%Y-%m" hoặc "%Y-%m-%d"
     * @param sellerId id của seller để lọc theo template.seller.id
     */
    @Query(value = """
            SELECT
              DATE_FORMAT(o.created_at, :pattern) AS period,
              COALESCE(SUM(oi.price * (1 - oi.commission_rate/100)), 0) AS revenue
            FROM orders o
            JOIN order_items oi ON o.id = oi.order_id
            WHERE o.status = 'COMPLETED'
              AND o.created_at BETWEEN :start AND :end
              AND (:sellerId IS NULL OR oi.template_id IN (
                   SELECT t.id FROM templates t WHERE t.seller_id = :sellerId
              ))
            GROUP BY DATE_FORMAT(o.created_at, :pattern)
            ORDER BY DATE_FORMAT(o.created_at, :pattern)
            """, nativeQuery = true)
    List<RevenueByPeriodDto> findRevenueByPeriod(
            LocalDateTime start,
            LocalDateTime end,
            String pattern,
            Long sellerId
    );

    /**
     * Thống kê doanh thu theo danh mục.
     *
     * @param start    thời điểm bắt đầu
     * @param end      thời điểm kết thúc
     * @param sellerId id của seller
     */
    @Query(value = """
            SELECT
              t.category AS category,
              COALESCE(SUM(oi.price * (1 - oi.commission_rate/100)), 0) AS revenue
            FROM orders o
            JOIN order_items oi ON o.id = oi.order_id
            JOIN templates t     ON oi.template_id = t.id
            WHERE o.status = 'COMPLETED'
              AND o.created_at BETWEEN :start AND :end
              AND (:sellerId IS NULL OR t.seller_id = :sellerId)
            GROUP BY t.category
            ORDER BY t.category
            """, nativeQuery = true)
    List<RevenueByCategoryDto> findRevenueByCategory(
            LocalDateTime start,
            LocalDateTime end,
            Long sellerId
    );

    @Query(value = """
            SELECT
              DATE_FORMAT(o.created_at, '%Y-%m') AS monthDto,
              COUNT(o.id)  as totalSales,
              COALESCE(SUM(oi.price * (1 - oi.commission_rate/100)), 0) AS totalRevenue
            FROM orders o
            JOIN order_items oi ON o.id = oi.order_id
            WHERE o.status = 'COMPLETED'
              AND o.created_at BETWEEN :start AND :end
            GROUP BY DATE_FORMAT(o.created_at,'%Y-%m')
            ORDER BY DATE_FORMAT(o.created_at, '%Y-%m')
            """, nativeQuery = true)
    List<MonthlySalesDto> getMonthlySales(LocalDateTime start,
                                          LocalDateTime end);
}

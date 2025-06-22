package com.example.be.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "coupon_usage")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CouponUsage {

    // Khóa chính, tự động tăng, định danh mỗi lần dùng coupon
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Liên kết đến coupon được sử dụng (nhiều lần sử dụng thuộc về 1 coupon)
    @ManyToOne
    @JoinColumn(nullable = false)
    private Coupon coupon;

    // Người dùng đã áp dụng coupon
    @ManyToOne
    @JoinColumn(nullable = false)
    private User user;

    // Đơn hàng mà coupon được áp dụng
    @ManyToOne
    @JoinColumn(nullable = false)
    private Order order;

    // Số tiền đã được giảm thực tế cho đơn hàng này
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal discountAmount;

    // Thời điểm coupon được sử dụng, tự động gán khi tạo bản ghi
    @CreationTimestamp
    private LocalDateTime usedAt;
}
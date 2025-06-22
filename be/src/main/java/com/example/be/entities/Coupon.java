package com.example.be.entities;

import com.example.be.enums.DiscountType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "coupons")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Coupon {

    // Khóa chính, tự sinh để định danh mỗi coupon
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Mã coupon duy nhất, không null, độ dài tối đa 50 ký tự
    @Column(unique = true, nullable = false, length = 50)
    private String code;

    // Mô tả thêm về coupon (ví dụ: điều kiện áp dụng)
    private String description;

    // Kiểu giảm giá (PERCENTAGE hoặc FIXED), lưu dưới dạng chuỗi, không null
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DiscountType discountType;

    // Giá trị giảm (phần trăm hoặc số tiền cố định), không null
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal discountValue;

    // Ngưỡng giá trị đơn hàng tối thiểu để áp dụng coupon (mặc định 0.0)
    @Column(precision = 10, scale = 2)
    private BigDecimal minimumAmount = BigDecimal.ZERO;

    // Giới hạn số tiền được giảm tối đa (áp dụng cho coupon kiểu PERCENTAGE)
    @Column(precision = 10, scale = 2)
    private BigDecimal maximumDiscount;

    // Giới hạn tổng số lần sử dụng coupon (tất cả users)
    private Integer usageLimit;

    // Số lần coupon đã được sử dụng (cache counter), mặc định 0
    @Builder.Default
    private Integer usedCount = 0;

    // Giới hạn số lần mỗi user có thể dùng coupon, mặc định 1
    @Builder.Default
    private Integer userLimit = 1;

    // Thời gian bắt đầu hiệu lực, không null
    @Column(nullable = false)
    private LocalDateTime startDate;

    // Thời gian kết thúc hiệu lực, không null
    @Column(nullable = false)
    private LocalDateTime endDate;

    // Cờ kích hoạt (true = còn hiệu lực, false = tắt), mặc định true
    @Builder.Default
    private Boolean isActive = true;

    // Thời điểm tạo bản ghi coupon
    @CreationTimestamp
    private LocalDateTime createdAt;

    // Thời điểm cập nhật cuối cùng
    @UpdateTimestamp
    private LocalDateTime updatedAt;

    // Danh sách các lần sử dụng coupon (một coupon có thể được dùng nhiều lần)
    @OneToMany(mappedBy = "coupon", cascade = CascadeType.ALL)
    private List<CouponUsage> couponUsages;
}
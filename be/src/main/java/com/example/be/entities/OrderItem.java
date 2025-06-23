package com.example.be.entities;

import com.example.be.enums.LicenseType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "order_items")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
public class OrderItem {

    // Khóa chính, tự động tăng, định danh mỗi mục trong đơn hàng
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Đơn hàng chứa item này (many-to-one)
    @ManyToOne
    @JoinColumn(nullable = false)
    private Order order;

    // Template được mua
    @ManyToOne
    @JoinColumn(nullable = false)
    private Template template;

    // Giá bán tại thời điểm mua (có thể đã áp dụng discount)
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    // Loại license được mua (SINGLE, MULTIPLE, EXTENDED)
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LicenseType licenseType;

    // Tỉ lệ hoa hồng (phần trăm) hướng tới seller
    @Column(nullable = false, precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal commissionRate = BigDecimal.valueOf(30);

    // Thời điểm item này được thêm vào đơn hàng
    @CreationTimestamp
    private LocalDateTime createdAt;

    // Các đánh giá liên quan đến item (nếu user review riêng cho template này trong đơn)
    @OneToMany(mappedBy = "orderItem", cascade = CascadeType.ALL)
    private List<Review> reviews;
}

package com.example.be.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "sales_reports")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SalesReport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(nullable = false)
    private SellerProfile seller;

    @Column(nullable = false)
    private LocalDateTime reportDate;

    @Column(precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal totalSales = BigDecimal.ZERO;

    @Builder.Default
    private Integer totalOrders = 0;

    @Column(precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal commissionAmount = BigDecimal.ZERO;

    @Column(precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal netEarnings = BigDecimal.ZERO;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
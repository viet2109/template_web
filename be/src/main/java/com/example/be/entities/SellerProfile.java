package com.example.be.entities;

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
@Table(name = "seller_profiles")
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class SellerProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(nullable = false)
    private User user;

    @Column(nullable = false)
    private String name;
    private String description;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    private String portfolioUrl;

    private String website;

    @OneToMany(mappedBy = "seller", cascade = CascadeType.ALL)
    private List<Template> templates;

    @Builder.Default
    private Integer totalReviews = 0;

    @Builder.Default
    private Integer totalSales = 0;

    @Column(precision = 2, scale = 1)
    @Builder.Default
    private BigDecimal rating = BigDecimal.ZERO;

    @Column(nullable = false)
    private String taxId;

    @Column(precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal commissionRate = BigDecimal.valueOf(30);

    @Column(nullable = false)
    private String bankAccount;

    @Column(nullable = false)
    private String bankName;

    @OneToMany(mappedBy = "seller", cascade = CascadeType.ALL)
    private List<SalesReport> salesReports;

    @OneToMany(mappedBy = "seller", cascade = CascadeType.ALL)
    private List<Payout> payouts;

    @Builder.Default
    private Boolean isApproved = false;

}
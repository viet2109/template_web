package com.example.be.entities;

import com.example.be.enums.PayoutStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payouts")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Payout {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(nullable = false)
    private SellerProfile seller;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    @Column(length = 3)
    private String currency = "VND";

    @Enumerated(EnumType.STRING)
    private PayoutStatus status = PayoutStatus.PENDING;

    @Column(length = 50)
    private String paymentMethod;

    @Column(length = 100)
    private String transactionId;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @CreationTimestamp
    private LocalDateTime requestedAt;

    private LocalDateTime processedAt;
}

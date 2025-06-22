package com.example.be.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "verification_email_tokens")
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class VerificationEmailToken {
    private static final int EXPIRATION_MINUTES = 60 * 24;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String token;

    @ManyToOne
    @JoinColumn(nullable = false)
    private User user;

    @Column(nullable = false)
    @Builder.Default
    private LocalDateTime expiryDate = LocalDateTime.now().plusMinutes(EXPIRATION_MINUTES);
}

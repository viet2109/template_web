package com.example.be.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "wishlists")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Wishlist {

    // Khóa chính, tự tăng, định danh mỗi mục wishlist
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Người dùng sở hữu wishlist này
    @ManyToOne
    @JoinColumn(nullable = false)
    private User user;

    // Template mà user thêm vào wishlist
    @ManyToOne
    @JoinColumn(nullable = false)
    private Template template;

    // Thời điểm thêm vào wishlist, tự động gán
    @CreationTimestamp
    private LocalDateTime createdAt;
}
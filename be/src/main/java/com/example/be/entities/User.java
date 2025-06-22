package com.example.be.entities;


import com.example.be.enums.AuthProvider;
import com.example.be.enums.Role;
import com.example.be.enums.UserStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "users")
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AuthProvider provider;

    private String phone;

    @OneToOne
    private File avatar;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    private String firstName;
    private String lastName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserStatus status;

    private String providerId;

    private String providerAvatarUrl;

    @ElementCollection(fetch = FetchType.EAGER)
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Set<Role> roles;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private SellerProfile sellerProfile;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private Set<Order> orders;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Review> reviews;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Wishlist> wishlists;
}

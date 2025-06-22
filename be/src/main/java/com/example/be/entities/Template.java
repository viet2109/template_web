package com.example.be.entities;

import com.example.be.enums.Category;
import com.example.be.enums.Color;
import com.example.be.enums.LicenseType;
import com.example.be.enums.TemplateStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Table(name = "templates")
public class Template {

    // Khóa chính, tự sinh để định danh mỗi template
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Tên template, bắt buộc
    @Column(nullable = false)
    private String name;

    // Mô tả chi tiết của template
    @Column(columnDefinition = "TEXT")
    private String description;

    // Phân loại template theo enum
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Category category;

    // Tập hợp màu sắc (enum) liên quan đến template
    @ElementCollection
    @Enumerated(EnumType.STRING)
    private Set<Color> colors;

    // Cờ đánh dấu template miễn phí hay không
    @Builder.Default
    private Boolean isFree = false;

    // Giá gốc của template, bắt buộc
    @Column(nullable = false)
    private BigDecimal price;

    // Giá sau khi giảm, nếu có
    @Column(precision = 10, scale = 2)
    private BigDecimal discountPrice;

    // Danh sách công nghệ sử dụng, lưu dưới dạng JSON
    @Column(columnDefinition = "JSON")
    private String techStack;

    // Các tính năng nổi bật, lưu dưới dạng JSON
    @Column(columnDefinition = "JSON")
    private String features;

    // Môi trường tương thích, lưu dưới dạng JSON
    @Column(columnDefinition = "JSON")
    private String compatibility;

    // Tổng lượt mua đã thực hiện (cache counter)
    @Builder.Default
    private Integer totalSales = 0;

    // Tổng lượt tải về
    @Builder.Default
    private Integer totalDownloads = 0;

    // Điểm trung bình đánh giá (0.00–9.99)
    @Column(precision = 3, scale = 2)
    @Builder.Default
    private BigDecimal rating = BigDecimal.ZERO;

    // Lý do từ chối nếu status = REJECTED
    @Column(columnDefinition = "TEXT")
    private String rejectionReason;

    // Tổng số review đã nhận
    @Builder.Default
    private Integer totalReviews = 0;

    // Tổng số comment đã nhận
    @Builder.Default
    private Integer totalComments = 0;

    // Người bán (seller) sở hữu template
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(nullable = false)
    private SellerProfile seller;

    // Giới hạn số lượt mua tối đa (null = không giới hạn)
    private Integer maxPurchases;

    // Thời điểm tạo bản ghi
    @CreationTimestamp
    private LocalDateTime createdAt;

    // Thời điểm cập nhật cuối
    @UpdateTimestamp
    private LocalDateTime updatedAt;

    // Thời điểm template được duyệt
    private LocalDateTime approvedAt;

    // Link demo trực tiếp
    private String demoUrl;

    // File gốc để user tải về (OneToOne)
    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(nullable = false)
    private File downloadFile;

    // File ảnh thumbnail (OneToOne)
    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    private File thumbnailFile;

    // Danh sách order item đã mua template này
    @OneToMany(mappedBy = "template", fetch = FetchType.LAZY)
    private Set<OrderItem> orderItems;

    // Danh sách review của users
    @OneToMany(mappedBy = "template", cascade = CascadeType.ALL)
    private List<Review> reviews;

    // Danh sách comment của users
    @OneToMany(mappedBy = "template", cascade = CascadeType.ALL)
    private List<Comment> comments;

    // Trạng thái quy trình (PENDING, APPROVED...)
    @Enumerated(EnumType.STRING)
    private TemplateStatus status = TemplateStatus.PENDING;

    // Loại giấy phép (SINGLE, MULTIPLE, EXTENDED)
    @Enumerated(EnumType.STRING)
    private LicenseType licenseType = LicenseType.SINGLE;
}

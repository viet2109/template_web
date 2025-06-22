package com.example.be.specifications;

import com.example.be.entities.SellerProfile;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDateTime;

public class SellerProfileSpecification {

    /**
     * Lọc theo tên chứa chuỗi
     */
    public static Specification<SellerProfile> nameContains(String keyword) {
        return (root, query, cb) ->
                cb.like(cb.lower(root.get("name")), "%" + keyword.toLowerCase() + "%");
    }

    /**
     * Lọc theo trạng thái phê duyệt
     */
    public static Specification<SellerProfile> isApproved(boolean approved) {
        return (root, query, cb) ->
                cb.equal(root.get("isApproved"), approved);
    }

    /**
     * Lọc ngày tạo sau (>=)
     */
    public static Specification<SellerProfile> createdAfter(LocalDateTime dateTime) {
        return (root, query, cb) ->
                cb.greaterThanOrEqualTo(root.get("createdAt"), dateTime);
    }

    /**
     * Lọc ngày tạo trước (<=)
     */
    public static Specification<SellerProfile> createdBefore(LocalDateTime dateTime) {
        return (root, query, cb) ->
                cb.lessThanOrEqualTo(root.get("createdAt"), dateTime);
    }

    /**
     * Lọc rating lớn hơn hoặc bằng
     */
    public static Specification<SellerProfile> ratingAtLeast(double minRating) {
        return (root, query, cb) ->
                cb.greaterThanOrEqualTo(root.get("rating"), minRating);
    }

    /**
     * Lọc rating nhỏ hơn hoặc bằng
     */
    public static Specification<SellerProfile> ratingAtMost(double maxRating) {
        return (root, query, cb) ->
                cb.lessThanOrEqualTo(root.get("rating"), maxRating);
    }

    /**
     * Lọc commissionRate giữa hai giá trị
     */
    public static Specification<SellerProfile> commissionBetween(double min, double max) {
        return (root, query, cb) ->
                cb.between(root.get("commissionRate"), min, max);
    }

    /**
     * Lọc theo taxId chính xác
     */
    public static Specification<SellerProfile> hasTaxId(String taxId) {
        return (root, query, cb) ->
                cb.equal(root.get("taxId"), taxId);
    }
}

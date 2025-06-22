package com.example.be.specifications;

import com.example.be.entities.Order;
import com.example.be.enums.OrderStatus;
import com.example.be.enums.PaymentMethod;
import com.example.be.enums.PaymentStatus;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.JoinType;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class OrderSpecification {

    public static Specification<Order> hasUserId(Long userId) {
        return (root, query, cb) -> cb.equal(root.get("user").get("id"), userId);
    }

    public static Specification<Order> hasStatus(OrderStatus status) {
        return (root, query, cb) -> cb.equal(root.get("status"), status);
    }

    public static Specification<Order> hasPaymentStatus(PaymentStatus paymentStatus) {
        return (root, query, cb) -> cb.equal(root.get("paymentStatus"), paymentStatus);
    }

    public static Specification<Order> hasPaymentMethod(PaymentMethod method) {
        return (root, query, cb) -> cb.equal(root.get("paymentMethod"), method);
    }

    public static Specification<Order> hasCurrency(String currency) {
        return (root, query, cb) -> cb.equal(cb.lower(root.get("currency")), currency.toLowerCase());
    }

    public static Specification<Order> taxAmountBetween(BigDecimal min, BigDecimal max) {
        return (root, query, cb) -> cb.between(root.get("taxAmount"), min, max);
    }

    public static Specification<Order> createdAfter(LocalDateTime dateTime) {
        return (root, query, cb) -> cb.greaterThanOrEqualTo(root.get("createdAt"), dateTime);
    }

    public static Specification<Order> createdBefore(LocalDateTime dateTime) {
        return (root, query, cb) -> cb.lessThanOrEqualTo(root.get("createdAt"), dateTime);
    }

    public static Specification<Order> completedAfter(LocalDateTime dateTime) {
        return (root, query, cb) -> cb.greaterThanOrEqualTo(root.get("completedAt"), dateTime);
    }

    public static Specification<Order> completedBefore(LocalDateTime dateTime) {
        return (root, query, cb) -> cb.lessThanOrEqualTo(root.get("completedAt"), dateTime);
    }

    public static Specification<Order> notesContains(String keyword) {
        return (root, query, cb) -> cb.like(cb.lower(root.get("notes")), "%" + keyword.toLowerCase() + "%");
    }

    public static Specification<Order> billingInfoContains(String keyword) {
        return (root, query, cb) -> cb.like(cb.lower(root.get("billingInfo")), "%" + keyword.toLowerCase() + "%");
    }

    public static Specification<Order> hasPaymentTransactionId(String txId) {
        return (root, query, cb) -> cb.equal(root.get("paymentTransactionId"), txId);
    }

    /**
     * Lọc theo tổng giá của order (sum price + tax)
     *
     * @param min tổng tối thiểu
     * @param max tổng tối đa
     */
    public static Specification<Order> totalAmountBetween(BigDecimal min, BigDecimal max) {
        return (root, query, cb) -> {
            // Tính tổng giá: sum price của orderItems + taxAmount
            var items = root.join("orderItems", JoinType.LEFT);
            Expression<Number> sumPrice = cb.sum(items.get("price"), 0);
            Expression<Number> totalWithTax = cb.sum(sumPrice, root.get("taxAmount"));
            // Sử dụng ge (>=) và le (<=) thay vì between để tránh lỗi kiểu
            return cb.and(
                    cb.ge(totalWithTax, min),
                    cb.le(totalWithTax, max)
            );
        };
    }

    /**
     * Kết hợp các Specification thành một
     */
    @SafeVarargs
    public static Specification<Order> build(Specification<Order>... specs) {
        Specification<Order> result = Specification.where(null);
        for (Specification<Order> spec : specs) {
            if (spec != null) {
                result = result.and(spec);
            }
        }
        return result;
    }
}

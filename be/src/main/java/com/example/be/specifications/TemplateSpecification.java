package com.example.be.specifications;


import com.example.be.entities.Template;
import com.example.be.enums.Category;
import com.example.be.enums.Color;
import com.example.be.enums.TemplateStatus;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;


public class TemplateSpecification {

    public static Specification<Template> hasNameLike(String keyword) {
        return (root, query, cb) -> cb.like(cb.lower(root.get("name")), "%" + keyword.toLowerCase() + "%");
    }

    public static Specification<Template> isFree() {
        return (root, query, cb) -> cb.equal(root.get("isFree"), true);
    }

    public static Specification<Template> hasSellerId(Long sellerId) {
        return (root, query, cb) -> (cb.equal(root.get("seller").get("user").get("id"), sellerId));
    }

    public static Specification<Template> hasCategory(Category category) {
        return (root, query, cb) -> cb.equal(root.get("category"), category);
    }

    public static Specification<Template> hasAnyColor(Set<Color> colors) {
        return (root, query, cb) -> {
            Join<Template, Color> join = root.joinSet("colors", JoinType.INNER);
            return join.in(colors);
        };
    }

    public static Specification<Template> hasPriceLessThanOrEqualTo(BigDecimal max) {
        return (root, query, cb) -> cb.lessThanOrEqualTo(root.get("price"), max);
    }

    public static Specification<Template> hasPriceGreaterThanOrEqualTo(BigDecimal min) {
        return (root, query, cb) -> cb.greaterThanOrEqualTo(root.get("price"), min);
    }

    public static Specification<Template> createdAfter(LocalDateTime from) {
        return (root, query, cb) -> cb.greaterThanOrEqualTo(root.get("createdAt"), from);
    }

    public static Specification<Template> createdBefore(LocalDateTime to) {
        return (root, query, cb) -> cb.lessThanOrEqualTo(root.get("createdAt"), to);
    }

    public static Specification<Template> sellerNameLike(String sellerName) {
        return (root, query, cb) -> cb.like(cb.lower(root.get("seller").get("name")), "%" + sellerName.toLowerCase() + "%");
    }

    public static Specification<Template> hasStatus(TemplateStatus status) {
        return (root, query, cb) -> cb.equal(root.get("status"), status);
    }

    @SafeVarargs
    public static Specification<Template> build(Specification<Template>... specs) {
        Specification<Template> result = Specification.where(null);
        for (Specification<Template> spec : specs) {
            if (spec != null) {
                result = result.and(spec);
            }
        }
        return result;
    }

    public static Specification<Template> isPaid() {
        return (root, query, cb) -> cb.equal(root.get("isFree"), false);
    }
}

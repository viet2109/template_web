package com.example.be.specifications;

import com.example.be.entities.User;
import com.example.be.enums.Role;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDateTime;

public class UserSpecification {

    public static Specification<User> emailContains(String substring) {
        return (root, query, cb) -> cb.like(cb.lower(root.get("email")), "%" + substring.toLowerCase() + "%");
    }

    public static Specification<User> nameContains(String substring) {
        return (root, query, cb) -> {
            Expression<String> fullName = cb.concat(root.get("firstName"), cb.concat(" ", root.get("lastName")));
            return cb.like(cb.lower(fullName), "%" + substring.toLowerCase() + "%");
        };
    }

    public static Specification<User> hasRole(Role role) {
        return (root, query, cb) -> {
            Join<User, Role> roles = root.joinSet("roles", JoinType.INNER);
            return cb.equal(roles, role);
        };
    }

    public static Specification<User> createdAfter(LocalDateTime from) {
        return (root, query, cb) -> cb.greaterThanOrEqualTo(root.get("createdAt"), from);
    }

    public static Specification<User> createdBefore(LocalDateTime to) {
        return (root, query, cb) -> cb.lessThanOrEqualTo(root.get("createdAt"), to);
    }
}

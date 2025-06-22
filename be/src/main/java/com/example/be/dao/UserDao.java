package com.example.be.dao;

import com.example.be.entities.User;
import com.example.be.enums.Role;
import com.example.be.enums.UserStatus;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface UserDao extends CrudRepository<User, Long>, JpaSpecificationExecutor<User> {
    Optional<User> findByEmail(String email);

    List<User> findByRoles(Set<Role> roles);

    Boolean existsByEmail(String email);

    Optional<User> findByEmailAndStatus(String email, UserStatus status);

    long countByStatus(UserStatus status);

    long countByCreatedAtAfter(LocalDateTime createdAtAfter);
}

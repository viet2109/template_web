package com.example.be.dao;

import com.example.be.entities.SellerProfile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface SellerDao extends CrudRepository<SellerProfile, Long>, JpaSpecificationExecutor<SellerProfile> {
    boolean existsByUser_Id(Long userId);

    Optional<SellerProfile> findByUser_Id(Long userI);

    long countByIsApprovedIsTrue();

    List<SellerProfile> findTopByIsApprovedIsTrueOrderByTotalSalesDesc(Pageable pageable);

    long countByCreatedAtAfter(LocalDateTime createdAtAfter);
}

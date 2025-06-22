package com.example.be.dao;

import com.example.be.entities.CouponUsage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CouponUsageDao extends CrudRepository<CouponUsage, Long> {
    long countByCoupon_IdAndUser_Id(Long couponId, Long userId);

    Page<CouponUsage> findByCoupon_Id(Long couponId, Pageable pageable);
}

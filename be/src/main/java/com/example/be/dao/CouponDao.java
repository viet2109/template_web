package com.example.be.dao;

import com.example.be.entities.Coupon;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CouponDao extends CrudRepository<Coupon, Long>, JpaSpecificationExecutor<Coupon> {
    boolean existsByCode(String code);
    Optional<Coupon> findByCode(String code);
}

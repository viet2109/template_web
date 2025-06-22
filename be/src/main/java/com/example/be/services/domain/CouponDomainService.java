package com.example.be.services.domain;

import com.example.be.dao.CouponDao;
import com.example.be.dao.CouponUsageDao;
import com.example.be.dao.OrderDao;
import com.example.be.dao.UserDao;
import com.example.be.dto.admin.CreateCouponDto;
import com.example.be.dto.admin.UpdateCouponDto;
import com.example.be.entities.Coupon;
import com.example.be.entities.CouponUsage;
import com.example.be.entities.Order;
import com.example.be.entities.User;
import com.example.be.enums.AppError;
import com.example.be.enums.DiscountType;
import com.example.be.exceptions.AppException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Transactional
public class CouponDomainService {

    private final CouponDao couponDao;
    private final CouponUsageDao couponUsageDao;
    private final UserDao userDao;
    private final OrderDao orderDao;

    public Coupon createCoupon(CreateCouponDto dto) {
        if (couponDao.existsByCode(dto.getCode())) {
            throw new AppException(AppError.AUTH_ACCESS_DENIED);
        }

        Coupon coupon = new Coupon();
        coupon.setCode(dto.getCode());
        coupon.setDescription(dto.getDescription());
        coupon.setDiscountType(dto.getDiscountType());
        coupon.setDiscountValue(BigDecimal.valueOf(dto.getDiscountValue()));
        coupon.setMinimumAmount(BigDecimal.valueOf(dto.getMinimumAmount()));
        coupon.setMaximumDiscount(BigDecimal.valueOf(dto.getMaximumDiscount()));
        coupon.setUsageLimit(dto.getUsageLimit());
        coupon.setUserLimit(dto.getUserLimit());
        coupon.setStartDate(dto.getStartDate());
        coupon.setEndDate(dto.getEndDate());
        coupon.setIsActive(dto.getIsActive());

        return couponDao.save(coupon);
    }

    public Coupon updateCoupon(Long couponId, UpdateCouponDto dto) throws Exception {
        Coupon coupon = couponDao.findById(couponId)
                .orElseThrow(() -> new Exception("Coupon not found"));

        if (dto.getCode() != null && !dto.getCode().equals(coupon.getCode())) {
            if (couponDao.existsByCode(dto.getCode())) {
                throw new Exception("Coupon code already exists");
            }
            coupon.setCode(dto.getCode());
        }

        if (dto.getDescription() != null) coupon.setDescription(dto.getDescription());
        if (dto.getDiscountType() != null) coupon.setDiscountType(dto.getDiscountType());
        if (dto.getDiscountValue() != null) coupon.setDiscountValue(BigDecimal.valueOf(dto.getDiscountValue()));
        if (dto.getMinimumAmount() != null) coupon.setMinimumAmount(BigDecimal.valueOf(dto.getMinimumAmount()));
        if (dto.getMaximumDiscount() != null) coupon.setMaximumDiscount(BigDecimal.valueOf(dto.getMaximumDiscount()));
        if (dto.getUsageLimit() != null) coupon.setUsageLimit(dto.getUsageLimit());
        if (dto.getUserLimit() != null) coupon.setUserLimit(dto.getUserLimit());
        if (dto.getStartDate() != null) coupon.setStartDate(dto.getStartDate());
        if (dto.getEndDate() != null) coupon.setEndDate(dto.getEndDate());
        if (dto.getIsActive() != null) coupon.setIsActive(dto.getIsActive());

        return couponDao.save(coupon);
    }

    public Double applyCoupon(String couponCode, Double orderAmount, Long userId) throws Exception {
        Coupon coupon = couponDao.findByCode(couponCode)
                .orElseThrow(() -> new Exception("Invalid coupon code"));

        validateCoupon(coupon, orderAmount, userId);

        return calculateDiscount(coupon, orderAmount);
    }

    public void useCoupon(String couponCode, Long userId, Long orderId, Double discountAmount) throws Exception {
        Coupon coupon = couponDao.findByCode(couponCode)
                .orElseThrow(() -> new Exception("Invalid coupon code"));

        User user = userDao.findById(userId)
                .orElseThrow(() -> new Exception("User not found"));

        Order order = orderDao.findById(orderId)
                .orElseThrow(() -> new Exception("Order not found"));

        CouponUsage usage = new CouponUsage();
        usage.setCoupon(coupon);
        usage.setUser(user);
        usage.setOrder(order);
        usage.setDiscountAmount(BigDecimal.valueOf(discountAmount));

        couponUsageDao.save(usage);

        // Update coupon usage count
        coupon.setUsedCount(coupon.getUsedCount() + 1);
        couponDao.save(coupon);
    }

    private void validateCoupon(Coupon coupon, Double orderAmount, Long userId) throws Exception {
        LocalDateTime now = LocalDateTime.now();

        if (!coupon.getIsActive()) {
            throw new Exception("Coupon is not active");
        }

        if (now.isBefore(coupon.getStartDate()) || now.isAfter(coupon.getEndDate())) {
            throw new Exception("Coupon is not valid at this time");
        }

        if (orderAmount < coupon.getMinimumAmount().doubleValue()) {
            throw new Exception("Order amount does not meet minimum requirement");
        }

        if (coupon.getUsageLimit() != null && coupon.getUsedCount() >= coupon.getUsageLimit()) {
            throw new Exception("Coupon usage limit exceeded");
        }

        int userUsageCount = (int) couponUsageDao.countByCoupon_IdAndUser_Id(coupon.getId(), userId);
        if (userUsageCount >= coupon.getUserLimit()) {
            throw new Exception("You have exceeded the usage limit for this coupon");
        }
    }

    private Double calculateDiscount(Coupon coupon, Double orderAmount) {
        double discount;

        if (coupon.getDiscountType() == DiscountType.PERCENTAGE) {
            discount = (orderAmount * coupon.getDiscountValue().doubleValue()) / 100;
            if (coupon.getMaximumDiscount() != null && discount > coupon.getMaximumDiscount().doubleValue()) {
                discount = coupon.getMaximumDiscount().doubleValue();
            }
        } else {
            discount = coupon.getDiscountValue().doubleValue();
        }

        return Math.min(discount, orderAmount);
    }

    public Page<Coupon> getAllCoupons(Pageable pageable) {
        return couponDao.findAll(Specification.where(null), pageable);
    }

    public Coupon getCouponById(Long couponId) throws Exception {
        return couponDao.findById(couponId)
                .orElseThrow(() -> new Exception("Coupon not found"));
    }

    public void deleteCoupon(Long couponId) throws Exception {
        Coupon coupon = getCouponById(couponId);
        if (coupon.getUsedCount() > 0) {
            throw new Exception("Cannot delete coupon that has been used");
        }
        couponDao.delete(coupon);
    }
}
package com.example.be.services.domain;

import com.example.be.dao.SalesReportDao;
import com.example.be.dao.SellerDao;
import com.example.be.dao.TemplateDao;
import com.example.be.dao.UserDao;
import com.example.be.dto.seller.*;
import com.example.be.entities.SalesReport;
import com.example.be.entities.SellerProfile;
import com.example.be.entities.Template;
import com.example.be.entities.User;
import com.example.be.enums.Role;
import com.example.be.enums.TemplateStatus;
import com.example.be.specifications.SellerProfileSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class SellerDomainService {

    private final SellerDao sellerProfileDao;
    private final UserDao userDao;
    private final TemplateDao templateDao;
    private final SalesReportDao salesReportDao;

    /**
     * Tạo seller profile mới
     * Kiểm tra:
     * - User phải tồn tại và chưa có seller profile
     * - Thông tin seller hợp lệ
     */
    @Transactional
    public SellerProfile createSellerProfile(Long userId, SellerRegisterDto registerDto) throws Exception {
        User user = userDao.findById(userId)
                .orElseThrow(() -> new Exception("User not found"));

        // Check if user already has a seller profile
        if (sellerProfileDao.existsByUser_Id(user.getId())) {
            throw new Exception("User already has a seller profile");
        }

        SellerProfile sellerProfile = SellerProfile.builder()
                .user(user)
                .name(registerDto.getName())
                .description(registerDto.getDescription())
                .portfolioUrl(registerDto.getPortfolioUrl())
                .website(registerDto.getWebsite())
                .taxId(registerDto.getTaxId())
                .bankAccount(registerDto.getBankAccount())
                .bankName(registerDto.getBankName())
                .build();

        sellerProfile = sellerProfileDao.save(sellerProfile);

        // Add SELLER role to user
        user.getRoles().add(Role.SELLER);
        userDao.save(user);

        return sellerProfile;
    }

    /**
     * Cập nhật seller profile
     * Kiểm tra:
     * - Seller profile phải tồn tại
     * - Thông tin cập nhật hợp lệ
     */
    @Transactional
    public SellerProfile updateSellerProfile(Long sellerId, UpdateSellerProfileDto updateDto) throws Exception {
        SellerProfile seller = getSellerById(sellerId);

        if (updateDto.getName() != null) {
            seller.setName(updateDto.getName());
        }
        if (updateDto.getDescription() != null) {
            seller.setDescription(updateDto.getDescription());
        }
        if (updateDto.getPortfolioUrl() != null) {
            seller.setPortfolioUrl(updateDto.getPortfolioUrl());
        }
        if (updateDto.getWebsite() != null) {
            seller.setWebsite(updateDto.getWebsite());
        }
        if (updateDto.getBankAccount() != null) {
            seller.setBankAccount(updateDto.getBankAccount());
        }
        if (updateDto.getBankName() != null) {
            seller.setBankName(updateDto.getBankName());
        }

        return sellerProfileDao.save(seller);
    }

    /**
     * Duyệt đăng ký seller
     * Kiểm tra:
     * - Seller profile phải tồn tại
     * - Chưa được duyệt trước đó
     */
    @Transactional
    public SellerProfile approveSellerRegistration(Long sellerId) throws Exception {
        SellerProfile seller = getSellerById(sellerId);

        if (seller.getIsApproved()) {
            throw new Exception("Seller is already approved");
        }

        seller.setIsApproved(true);

        seller = sellerProfileDao.save(seller);

        return seller;
    }

    /**
     * Tính toán thu nhập của seller
     */
    public Map<String, Double> calculateEarnings(Long sellerId, LocalDateTime from, LocalDateTime to) throws Exception {
        SellerProfile seller = getSellerById(sellerId);

        List<SalesReport> salesReports = salesReportDao
                .findBySellerAndReportDateBetween(seller, from, to);

        Double totalSales = salesReports.stream()
                .mapToDouble(salesReport -> salesReport.getTotalSales().doubleValue())
                .sum();

        Double totalCommission = salesReports.stream()
                .mapToDouble(salesReport -> salesReport.getCommissionAmount().doubleValue())
                .sum();

        Double netEarnings = salesReports.stream()
                .mapToDouble(salesReport -> salesReport.getNetEarnings().doubleValue())
                .sum();

        Map<String, Double> earnings = new HashMap<>();
        earnings.put("totalSales", totalSales);
        earnings.put("totalCommission", totalCommission);
        earnings.put("netEarnings", netEarnings);

        return earnings;
    }

    /**
     * Cập nhật rating của seller
     */
    @Transactional
    public void updateSellerRating(Long sellerId) throws Exception {
        SellerProfile seller = getSellerById(sellerId);

        List<Template> templates = templateDao.findBySeller(seller);

        double avgRating = templates.stream()
                .mapToDouble(value -> value.getRating().doubleValue())
                .average()
                .orElse(0.0);

        Integer totalReviews = templates.stream()
                .mapToInt(Template::getTotalReviews)
                .sum();

        seller.setRating(BigDecimal.valueOf(avgRating));
        seller.setTotalReviews(totalReviews);

        sellerProfileDao.save(seller);
    }

    /**
     * Lấy thống kê của seller
     */
    public SellerDashboardDto getSellerStats(Long sellerId) throws Exception {
        SellerProfile seller = getSellerById(sellerId);

        List<Template> templates = templateDao.findBySeller(seller);
        List<SalesReport> recentSales = salesReportDao
                .findBySellerOrderByReportDate(seller, PageRequest.of(0, 10, Sort.by("reportDate").descending())).toList();

        return SellerDashboardDto.builder()
                .totalEarnings(calculateTotalEarnings(seller))
                .totalSales(seller.getTotalSales())
                .totalTemplates(templates.size())
                .pendingTemplates((int) templates.stream()
                        .filter(t -> t.getStatus() == TemplateStatus.PENDING)
                        .count())
                .approvedTemplates((int) templates.stream()
                        .filter(t -> t.getStatus() == TemplateStatus.APPROVED)
                        .count())
                .rejectedTemplates((int) templates.stream()
                        .filter(t -> t.getStatus() == TemplateStatus.REJECTED)
                        .count())
                .averageRating(seller.getRating().doubleValue())
                .totalReviews(seller.getTotalReviews())
                .recentSales(recentSales.stream()
                        .map(this::convertToSalesReportDto)
                        .toList())
                .topSellingTemplates(getTopSellingTemplates(seller))
                .build();
    }

    /**
     * Tìm kiếm seller
     */
    public Page<SellerProfile> searchSeller(String nameKeyword, Boolean approved, Double minRating, Double maxRating, LocalDateTime createdAfter, LocalDateTime createdBefore, Pageable pageable) throws Exception {
        Specification<SellerProfile> spec = Specification.where(null);

        if (nameKeyword != null && !nameKeyword.isBlank()) {
            spec = spec.and(SellerProfileSpecification.nameContains(nameKeyword));
        }
        if (approved != null) {
            spec = spec.and(SellerProfileSpecification.isApproved(approved));
        }
        if (minRating != null) {
            spec = spec.and(SellerProfileSpecification.ratingAtLeast(minRating));
        }
        if (maxRating != null) {
            spec = spec.and(SellerProfileSpecification.ratingAtMost(maxRating));
        }
        if (createdAfter != null) {
            spec = spec.and(SellerProfileSpecification.createdAfter(createdAfter));
        }
        if (createdBefore != null) {
            spec = spec.and(SellerProfileSpecification.createdBefore(createdBefore));
        }

        return sellerProfileDao.findAll(spec, pageable);
    }

    /**
     * Cập nhật hoa hồng của seller
     */
    @Transactional
    public SellerProfile updateCommissionRate(Long sellerId, Double rate) throws Exception {
        SellerProfile seller = getSellerById(sellerId);

        validateCommissionRate(rate);
        seller.setCommissionRate(BigDecimal.valueOf(rate));

        seller = sellerProfileDao.save(seller);

        return seller;
    }

    public SellerProfile getSellerById(Long id) throws Exception {
        return sellerProfileDao.findById(id)
                .orElseThrow(() -> new Exception("Seller not found with id: " + id));
    }

    private void validateCommissionRate(Double rate) throws Exception {
        if (rate < 0 || rate > 100) {
            throw new Exception("Commission rate must be between 0 and 100");
        }
    }

    private Double calculateTotalEarnings(SellerProfile seller) {
        return salesReportDao.sumNetEarningsBySeller(seller);
    }

    private List<SellerTemplateDto> getTopSellingTemplates(SellerProfile seller) {
        return templateDao.findTopBySellerOrderByTotalSalesDesc(seller, PageRequest.of(0, 5))
                .stream()
                .map(this::convertToSellerTemplateDto)
                .toList();
    }

    private SalesReportDto convertToSalesReportDto(SalesReport report) {
        return SalesReportDto.builder()
                .id(report.getId())
                .reportDate(report.getReportDate())
                .totalSales(report.getTotalSales().doubleValue())
                .totalOrders(report.getTotalOrders())
                .commissionAmount(report.getCommissionAmount().doubleValue())
                .netEarnings(report.getNetEarnings().doubleValue())
                .createdAt(report.getCreatedAt())
                .build();
    }

    private SellerTemplateDto convertToSellerTemplateDto(Template template) {
        return SellerTemplateDto.builder()
                .id(template.getId())
                .name(template.getName())
                .totalSales(template.getTotalSales())
                .totalDownloads(template.getTotalDownloads())
                .rating(template.getRating().doubleValue())
                .status(template.getStatus())
                .price(template.getPrice())
                .discountPrice(template.getDiscountPrice())
                .build();
    }
}
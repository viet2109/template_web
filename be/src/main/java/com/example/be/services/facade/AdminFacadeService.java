package com.example.be.services.facade;

import com.example.be.dao.*;
import com.example.be.dto.admin.*;
import com.example.be.entities.*;
import com.example.be.enums.*;
import com.example.be.mappers.*;
import com.example.be.services.domain.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class AdminFacadeService {

    private final UserDao userDao;
    private final SellerDao sellerProfileDao;
    private final TemplateDao templateDao;
    private final OrderDao orderDao;
    private final OrderItemDao orderItemDao;
    private final CouponDao couponDao;
    private final CouponUsageDao couponUsageDao;
    private final PayoutDao payoutDao;
    private final SalesReportDao salesReportDao;
    private final TemplateDomainService templateDomainService;
    private final UserMapper userMapper;
    private final UserDomainService userDomainService;
    private final OrderDomainService orderDomainService;
    private final SellerDomainService sellerDomainService;
    private final TemplateMapper templateMapper;
    private final SellerProfileMapper sellerProfileMapper;
    private final OrderMapper orderMapper;
    private final CouponMapper couponMapper;
    private final CouponDomainService couponDomainService;
    private final CouponUsageMapper couponUsageMapper;

    public AdminDashboardDto getDashboard() {
        log.info("Generating admin dashboard data");

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startOfMonth = now.with(TemporalAdjusters.firstDayOfMonth()).withHour(0).withMinute(0).withSecond(0);

        // Basic counts
        Integer totalUsers = Math.toIntExact(userDao.count());
        Integer totalSellers = Math.toIntExact(sellerProfileDao.countByIsApprovedIsTrue());
        Integer totalTemplates = Math.toIntExact(templateDao.countByStatus(TemplateStatus.APPROVED));
        Integer totalOrders = Math.toIntExact(orderDao.countByStatus(OrderStatus.COMPLETED));

        // Revenue calculations
        Double totalRevenue = orderItemDao.totalRevenue(OrderStatus.COMPLETED).doubleValue();
        Double totalCommissions = orderItemDao.totalCommissions(OrderStatus.COMPLETED).doubleValue();

        // Monthly counts
        Integer newUsersThisMonth = Math.toIntExact(userDao.countByCreatedAtAfter(startOfMonth));
        Integer newSellersThisMonth = Math.toIntExact(sellerProfileDao.countByCreatedAtAfter(startOfMonth));
        Integer newTemplatesThisMonth = Math.toIntExact(templateDao.countByCreatedAtAfterAndStatus(startOfMonth, TemplateStatus.APPROVED));
        Integer newOrdersThisMonth = Math.toIntExact(orderDao.countByCreatedAtAfterAndStatus(startOfMonth, OrderStatus.COMPLETED));

        // Category sales
        List<CategorySalesDto> categorySales = getCategorySales();

        // Monthly sales
        List<MonthlySalesDto> monthlySales = getMonthlySales();

        // Top performers
        List<TopSellerDto> topSellers = getTopSellers();
        List<TopTemplateDto> topTemplates = getTopTemplates();

        return AdminDashboardDto.builder().totalUsers(totalUsers).totalSellers(totalSellers).totalTemplates(totalTemplates).totalOrders(totalOrders).totalRevenue(totalRevenue).totalCommissions(totalCommissions).newUsersThisMonth(newUsersThisMonth).newSellersThisMonth(newSellersThisMonth).newTemplatesThisMonth(newTemplatesThisMonth).newOrdersThisMonth(newOrdersThisMonth).categorySales(categorySales).monthlySales(monthlySales).topSellers(topSellers).topTemplates(topTemplates).build();
    }

    public List<CategorySalesDto> getCategorySales() {
        List<CategorySalesDto> categorySalesDtos = templateDao.findTopCategorySales(PageRequest.of(0, 10));
        categorySalesDtos.forEach(categorySalesDto -> {
            categorySalesDto.setTotalRevenue(orderItemDao.totalRevenueByTemplate_Category(categorySalesDto.getCategory(), OrderStatus.COMPLETED).doubleValue());
        });
        return categorySalesDtos;
    }

    public AdminOrderAnalyticsDto getOrderAnalytic() {
        return orderDao.getOrderAnalytic();
    }

    public List<MonthlySalesDto> getMonthlySales() {
        LocalDate now = LocalDate.now();
        LocalDateTime start = now.withDayOfMonth(1).atStartOfDay();
        LocalDateTime end = now.withDayOfMonth(now.lengthOfMonth())
                .plusDays(1)
                .atStartOfDay();
        return orderDao.getMonthlySales(start, end);
    }

    private List<TopSellerDto> getTopSellers() {
        Pageable topSellers = PageRequest.of(0, 10, Sort.by("totalSales").descending());
        return sellerProfileDao.findTopByIsApprovedIsTrueOrderByTotalSalesDesc(topSellers).stream().map(seller -> TopSellerDto.builder().id(seller.getId()).name(seller.getName()).totalSales(Double.valueOf(seller.getTotalSales())).totalTemplates(seller.getTemplates().size()).rating(seller.getRating().doubleValue()).build()).collect(Collectors.toList());
    }

    private List<TopTemplateDto> getTopTemplates() {
        return templateDomainService.findTopSellingTemplates().stream().map(template -> TopTemplateDto.builder().id(template.getId()).name(template.getName()).sellerName(template.getSeller().getName()).totalSales(template.getTotalSales()).totalRevenue(template.getTotalSales() * template.getPrice().doubleValue()).rating(template.getRating().doubleValue()).build()).collect(Collectors.toList());
    }

    public Page<AdminUserDto> searchUsers(String email, String name, Role role, LocalDate createdFrom, LocalDate createdTo, Pageable pageable) {
        return userDomainService.searchUsers(email, name, role, createdFrom, createdTo, pageable).map(user -> {
            AdminUserDto userDto = userMapper.entityToAdminDto(user);
            userDto.setTotalOrders((int) orderDao.countByUser_Id(userDto.getId()));
            userDto.setTotalSpent(orderItemDao.totalSpentByUser(userDto.getId(), OrderStatus.COMPLETED).doubleValue());
            return userDto;
        });
    }

    public AdminUserDto getUserDetail(Long userId) {
        log.info("Getting user detail for ID: {}", userId);
        User user = userDao.findById(userId).orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
        AdminUserDto userDto = userMapper.entityToAdminDto(user);
        userDto.setTotalOrders((int) orderDao.countByUser_Id(userDto.getId()));
        userDto.setTotalSpent(orderItemDao.totalSpentByUser(userDto.getId(), OrderStatus.COMPLETED).doubleValue());
        return userDto;
    }

    public AdminUserDto updateUserStatus(Long userId, UserStatus status) {
        log.info("Updating user status for ID: {} to {}", userId, status);

        User user = userDao.findById(userId).orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        user.setStatus(status);
        user.setUpdatedAt(LocalDateTime.now());

        User savedUser = userDao.save(user);
        log.info("User status updated successfully for ID: {}", userId);

        AdminUserDto userDto = userMapper.entityToAdminDto(savedUser);
        userDto.setTotalOrders((int) orderDao.countByUser_Id(userDto.getId()));
        userDto.setTotalSpent(orderItemDao.totalSpentByUser(userDto.getId(), OrderStatus.COMPLETED).doubleValue());
        return userDto;
    }

    public Page<AdminSellerDto> searchSellers(String nameKeyword, Boolean approved, Double minRating, Double maxRating, LocalDateTime createdAfter, LocalDateTime createdBefore, Pageable pageable) throws Exception {
        return sellerDomainService.searchSeller(nameKeyword, approved, minRating, maxRating, createdAfter, createdBefore, pageable).map(sellerProfile -> {
            AdminSellerDto adminSellerDto = sellerProfileMapper.entityToAdminDto(sellerProfile);
            adminSellerDto.setTotalTemplates(sellerProfile.getTemplates().size());
            adminSellerDto.setApprovedTemplates((int) sellerProfile.getTemplates().stream().filter(template -> template.getStatus() == TemplateStatus.APPROVED).count());
            adminSellerDto.setPendingTemplates((int) sellerProfile.getTemplates().stream().filter(template -> template.getStatus() == TemplateStatus.PENDING).count());
            adminSellerDto.setRejectedTemplates((int) sellerProfile.getTemplates().stream().filter(template -> template.getStatus() == TemplateStatus.REJECTED).count());
            return adminSellerDto;
        });
    }

    public AdminSellerDto getSellerDetail(Long sellerId) {
        log.info("Getting seller detail for ID: {}", sellerId);

        SellerProfile seller = sellerProfileDao.findById(sellerId).orElseThrow(() -> new RuntimeException("Seller not found with ID: " + sellerId));

        AdminSellerDto adminSellerDto = sellerProfileMapper.entityToAdminDto(seller);
        adminSellerDto.setTotalTemplates(seller.getTemplates().size());
        adminSellerDto.setApprovedTemplates((int) seller.getTemplates().stream().filter(template -> template.getStatus() == TemplateStatus.APPROVED).count());
        adminSellerDto.setPendingTemplates((int) seller.getTemplates().stream().filter(template -> template.getStatus() == TemplateStatus.PENDING).count());
        adminSellerDto.setRejectedTemplates((int) seller.getTemplates().stream().filter(template -> template.getStatus() == TemplateStatus.REJECTED).count());
        return adminSellerDto;
    }

    public AdminSellerDto approveSeller(Long sellerId, ApproveSellerDto dto) {
        log.info("Approving seller ID: {} with approval status: {}", sellerId, dto.getIsApproved());

        SellerProfile seller = sellerProfileDao.findById(sellerId).orElseThrow(() -> new RuntimeException("Seller not found with ID: " + sellerId));

        if (!dto.getIsApproved()) {
            throw new RuntimeException("Seller is not approved");
        }
        seller.setIsApproved(true);
        if (dto.getCommissionRate() != null) {
            seller.setCommissionRate(BigDecimal.valueOf(dto.getCommissionRate()));
        }

        SellerProfile savedSeller = sellerProfileDao.save(seller);
        log.info("Seller approval status updated successfully for ID: {}", sellerId);

        AdminSellerDto adminSellerDto = sellerProfileMapper.entityToAdminDto(savedSeller);
        adminSellerDto.setTotalTemplates(savedSeller.getTemplates().size());
        adminSellerDto.setApprovedTemplates((int) savedSeller.getTemplates().stream().filter(template -> template.getStatus() == TemplateStatus.APPROVED).count());
        adminSellerDto.setPendingTemplates((int) savedSeller.getTemplates().stream().filter(template -> template.getStatus() == TemplateStatus.PENDING).count());
        adminSellerDto.setRejectedTemplates((int) savedSeller.getTemplates().stream().filter(template -> template.getStatus() == TemplateStatus.REJECTED).count());
        return adminSellerDto;
    }

    public AdminSellerDto rejectSeller(Long sellerId, String reason) {
        log.info("Rejecting seller ID: {} with reason: {}", sellerId, reason);
        ApproveSellerDto dto = new ApproveSellerDto();
        dto.setIsApproved(false);
        dto.setReason(reason);

        return approveSeller(sellerId, dto);
    }

    public void updateSellerCommissionRate(Long sellerId, Double commissionRate) {
        log.info("Updating commission rate for seller ID: {} to {}", sellerId, commissionRate);

        SellerProfile seller = sellerProfileDao.findById(sellerId).orElseThrow(() -> new RuntimeException("Seller not found with ID: " + sellerId));

        seller.setCommissionRate(BigDecimal.valueOf(commissionRate));

        sellerProfileDao.save(seller);
        log.info("Commission rate updated successfully for seller ID: {}", sellerId);
    }

    public Page<AdminTemplateDto> searchTemplates(String keyword, Category category, Set<Color> colors, BigDecimal minPrice, BigDecimal maxPrice, Boolean isFree, TemplateStatus templateStatus, LocalDateTime createdAfter, LocalDateTime createdBefore, String sellerName, Long sellerId, Pageable pageable) {
        return templateDomainService.searchTemplates(keyword, category, colors, minPrice, maxPrice, isFree, templateStatus, createdAfter, createdBefore, sellerName, sellerId, pageable).map(templateMapper::entityToAdminDto);
    }

    public AdminTemplateDto getTemplateDetail(Long templateId) {
        log.info("Getting template detail for ID: {}", templateId);

        Template template = templateDao.findById(templateId).orElseThrow(() -> new RuntimeException("Template not found with ID: " + templateId));

        return templateMapper.entityToAdminDto(template);
    }

    public AdminTemplateDto approveTemplate(Long templateId, ApproveTemplateDto dto) {
        log.info("Approving template ID: {} with status: {}", templateId, dto.getStatus());

        Template template = templateDao.findById(templateId).orElseThrow(() -> new RuntimeException("Template not found with ID: " + templateId));

        template.setStatus(dto.getStatus());
        if (dto.getStatus() == TemplateStatus.APPROVED) {
            template.setApprovedAt(LocalDateTime.now());
            template.setRejectionReason(null);
        } else if (dto.getStatus() == TemplateStatus.REJECTED) {
            template.setRejectionReason(dto.getRejectionReason());
            template.setApprovedAt(null);
        }
        template.setUpdatedAt(LocalDateTime.now());

        Template savedTemplate = templateDao.save(template);
        log.info("Template status updated successfully for ID: {}", templateId);

        return templateMapper.entityToAdminDto(savedTemplate);
    }

    public AdminTemplateDto rejectTemplate(Long templateId, String reason) {
        log.info("Rejecting template ID: {} with reason: {}", templateId, reason);

        ApproveTemplateDto dto = new ApproveTemplateDto();
        dto.setStatus(TemplateStatus.REJECTED);
        dto.setRejectionReason(reason);

        return approveTemplate(templateId, dto);
    }

    public void deleteTemplate(Long templateId) {
        log.info("Deleting template ID: {}", templateId);

        Template template = templateDao.findById(templateId).orElseThrow(() -> new RuntimeException("Template not found with ID: " + templateId));

        // Check if template has any orders
        boolean hasOrders = orderItemDao.existsByTemplate_Id(templateId);
        if (hasOrders) {
            throw new RuntimeException("Cannot delete template with existing orders");
        }

        templateDao.delete(template);
        log.info("Template deleted successfully: {}", templateId);
    }

    public Page<AdminOrderDto> searchOrders(OrderStatus status, PaymentStatus paymentStatus, PaymentMethod paymentMethod, LocalDateTime createdFrom, LocalDateTime createdTo, BigDecimal min, BigDecimal max, Pageable pageable) {
        return orderDomainService.searchOrders(status, paymentStatus, paymentMethod, createdFrom, createdTo, min, max, pageable).map(orderMapper::entityToAdminOrderDto);
    }

    public AdminOrderDto getOrderDetail(Long orderId) {
        log.info("Getting order detail for ID: {}", orderId);

        Order order = orderDao.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found with ID: " + orderId));

        return orderMapper.entityToAdminOrderDto(order);
    }

    public void updateOrderStatus(Long orderId, UpdateOrderStatusDto dto) {
        log.info("Updating order status for ID: {} to {}", orderId, dto.getStatus());

        Order order = orderDao.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found with ID: " + orderId));

        order.setStatus(dto.getStatus());
        order.setPaymentStatus(dto.getPaymentStatus());
        if (dto.getNotes() != null) {
            order.setNotes(dto.getNotes());
        }

        if (dto.getStatus() == OrderStatus.COMPLETED) {
            order.setCompletedAt(LocalDateTime.now());
        }

        orderDao.save(order);
        log.info("Order status updated successfully for ID: {}", orderId);
    }

    public void refundOrder(Long orderId, String reason) {
        log.info("Refunding order ID: {} with reason: {}", orderId, reason);

        UpdateOrderStatusDto dto = new UpdateOrderStatusDto();
        dto.setStatus(OrderStatus.REFUNDED);
        dto.setPaymentStatus(PaymentStatus.REFUNDED);
        dto.setNotes(reason);

        updateOrderStatus(orderId, dto);
    }

    public AdminCouponDto createCoupon(CreateCouponDto dto) {
        AdminCouponDto coupon = couponMapper.entityToDto(couponDomainService.createCoupon(dto));
        coupon.setCouponUsagesPage(couponUsageDao.findByCoupon_Id(coupon.getId(), PageRequest.of(0, 5)).map(couponUsageMapper::entityToDto));
        return coupon;
    }

    public AdminCouponDto updateCoupon(Long couponId, UpdateCouponDto dto) throws Exception {
        AdminCouponDto coupon = couponMapper.entityToDto(couponDomainService.updateCoupon(couponId, dto));
        coupon.setCouponUsagesPage(couponUsageDao.findByCoupon_Id(coupon.getId(), PageRequest.of(0, 5)).map(couponUsageMapper::entityToDto));
        return coupon;
    }

    public Page<AdminCouponDto> getCoupons(Pageable pageable) {
        return couponDomainService.getAllCoupons(pageable).map(c -> {
            AdminCouponDto coupon = couponMapper.entityToDto(c);
            coupon.setCouponUsagesPage(couponUsageDao.findByCoupon_Id(coupon.getId(), PageRequest.of(0, 5)).map(couponUsageMapper::entityToDto));
            return coupon;
        });
    }

    public AdminCouponDto getCouponDetail(Long couponId) throws Exception {
        AdminCouponDto coupon = couponMapper.entityToDto(couponDomainService.getCouponById(couponId));
        coupon.setCouponUsagesPage(couponUsageDao.findByCoupon_Id(coupon.getId(), PageRequest.of(0, 5)).map(couponUsageMapper::entityToDto));
        return coupon;
    }

    public void activateCoupon(Long couponId) {
        log.info("Activating coupon ID: {}", couponId);

        Coupon coupon = couponDao.findById(couponId).orElseThrow(() -> new RuntimeException("Coupon not found with ID: " + couponId));

        coupon.setIsActive(true);
        coupon.setUpdatedAt(LocalDateTime.now());

        couponDao.save(coupon);
        log.info("Coupon activated successfully: {}", couponId);
    }

    public void deactivateCoupon(Long couponId) {
        log.info("Deactivating coupon ID: {}", couponId);

        Coupon coupon = couponDao.findById(couponId).orElseThrow(() -> new RuntimeException("Coupon not found with ID: " + couponId));

        coupon.setIsActive(false);

        couponDao.save(coupon);
        log.info("Coupon deactivated successfully: {}", couponId);
    }

    public void deleteCoupon(Long couponId) throws Exception {
        couponDomainService.deleteCoupon(couponId);
    }

    public void deleteUser(Long userId) {
        userDomainService.deleteUser(userId);
    }

//    // Payout Management
//    public Page<AdminPayoutDto> searchPayouts(AdminPayoutSearchDto searchDto) {
//        log.info("Searching payouts with criteria: {}", searchDto);
//
//        Pageable pageable = PageRequest.of(
//                searchDto.getPage(),
//                searchDto.getSize(),
//                Sort.by(Sort.Direction.fromString(searchDto.getSortDir()), searchDto.getSortBy())
//        );
//
//        Page<Payout> payouts = payoutDao.findPayoutsWithCriteria(
//                searchDto.getSellerId(),
//                searchDto.getStatus(),
//                searchDto.getPaymentMethod(),
//                searchDto.getRequestedFrom(),
//                searchDto.getRequestedTo(),
//                searchDto.getMinAmount(),
//                searchDto.getMaxAmount(),
//                pageable
//        );
//
//        return payouts.map(adminMapper::toAdminPayoutDto);
//    }
//
//    public AdminPayoutDto getPayoutDetail(Long payoutId) {
//        log.info("Getting payout detail for ID: {}", payoutId);
//
//        Payout payout = payoutDao.findById(payoutId)
//                .orElseThrow(() -> new RuntimeException("Payout not found with ID: " + payoutId));
//
//        return adminMapper.toAdminPayoutDto(payout);
//    }
//
//    public AdminPayoutDto processPayout(Long payoutId, ProcessPayoutDto dto) {
//        log.info("Processing payout ID: {} with status: {}", payoutId, dto.getStatus());
//
//        Payout payout = payoutDao.findById(payoutId)
//                .orElseThrow(() -> new RuntimeException("Payout not found with ID: " + payoutId));
//
//        payout.setStatus(dto.getStatus());
//        if (dto.getTransactionId() != null) {
//            payout.setTransactionId(dto.getTransactionId());
//        }
//        if (dto.getNotes() != null) {
//            payout.setNotes(dto.getNotes());
//        }
//
//        if (dto.getStatus() == PayoutStatus.COMPLETED || dto.getStatus() == PayoutStatus.REJECTED) {
//            payout.setProcessedAt(LocalDateTime.now());
//        }
//
//        Payout savedPayout = payoutDao.save(payout);
//        log.info("Payout processed successfully for ID: {}", payoutId);
//
//        return adminMapper.toAdminPayoutDto(savedPayout);
//    }
//
//    public void approvePayout(Long payoutId, String transactionId) {
//        log.info("Approving payout ID: {} with transaction ID: {}", payoutId, transactionId);
//
//        ProcessPayoutDto dto = new ProcessPayoutDto();
//        dto.setStatus(PayoutStatus.COMPLETED);
//        dto.setTransactionId(transactionId);
//
//        processPayout(payoutId, dto);
//    }
//
//    public void rejectPayout(Long payoutId, String reason) {
//        log.info("Rejecting payout ID: {} with reason: {}", payoutId, reason);
//
//        ProcessPayoutDto dto = new ProcessPayoutDto();
//        dto.setStatus(PayoutStatus.REJECTED);
//        dto.setNotes(reason);
//
//        processPayout(payoutId, dto);
//    }
//
//    // System Configuration
//    public SystemConfigDto getSystemConfig() {
//        log.info("Getting system configuration");
//
//        // This would typically be stored in a configuration table or properties
//        // For now, returning default values
//        return SystemConfigDto.builder()
//                .defaultCommissionRate(30.0)
//                .defaultTaxRate(10.0)
//                .defaultCurrency("VND")
//                .maxFileSize(50 * 1024 * 1024) // 50MB
//                .allowedFileTypes(Set.of("zip", "rar", "7z"))
//                .maxTemplatesPerSeller(100)
//                .minPayoutAmount(100000.0)
//                .tokenExpirationHours(24)
//                .build();
//    }
//
//    public SystemConfigDto updateSystemConfig(UpdateSystemConfigDto dto) {
//        log.info("Updating system configuration");
//
//        // This would typically update a configuration table or properties
//        // For now, just returning the updated values
//        SystemConfigDto currentConfig = getSystemConfig();
//
//        if (dto.getDefaultCommissionRate() != null) {
//            currentConfig.setDefaultCommissionRate(dto.getDefaultCommissionRate());
//        }
//        if (dto.getDefaultTaxRate() != null) {
//            currentConfig.setDefaultTaxRate(dto.getDefaultTaxRate());
//        }
//        if (dto.getDefaultCurrency() != null) {
//            currentConfig.setDefaultCurrency(dto.getDefaultCurrency());
//        }
//        if (dto.getMaxFileSize() != null) {
//            currentConfig.setMaxFileSize(dto.getMaxFileSize());
//        }
//        if (dto.getAllowedFileTypes() != null) {
//            currentConfig.setAllowedFileTypes(dto.getAllowedFileTypes());
//        }
//        if (dto.getMaxTemplatesPerSeller() != null) {
//            currentConfig.setMaxTemplatesPerSeller(dto.getMaxTemplatesPerSeller());
//        }
//        if (dto.getMinPayoutAmount() != null) {
//            currentConfig.setMinPayoutAmount(dto.getMinPayoutAmount());
//        }
//        if (dto.getTokenExpirationHours() != null) {
//            currentConfig.setTokenExpirationHours(dto.getTokenExpirationHours());
//        }
//
//        log.info("System configuration updated successfully");
//        return currentConfig;
//    }
//
//    // Reports & Export
//    public byte[] exportUsersReport(AdminUserSearchDto searchDto) {
//        log.info("Exporting users report with criteria: {}", searchDto);
//
//        // Set large page size for export
//        searchDto.setSize(Integer.MAX_VALUE);
//        Page<AdminUserDto> users = searchUsers(searchDto);
//
//        return reportService.generateUsersReport(users.getContent());
//    }
//
//    public byte[] exportSalesReport(LocalDateTime from, LocalDateTime to) {
//        log.info("Exporting sales report from {} to {}", from, to);
//
//        List<Order> orders = orderDao.findByCreatedAtBetweenAndStatus(from, to, OrderStatus.COMPLETED);
//        return reportService.generateSalesReport(orders);
//    }
//
//    public byte[] exportPayoutReport(LocalDateTime from, LocalDateTime to) {
//        log.info("Exporting payout report from {} to {}", from, to);
//
//        List<Payout> payouts = payoutDao.findByRequestedAtBetween(from, to);
//        return reportService.generatePayoutReport(payouts);
//    }
}
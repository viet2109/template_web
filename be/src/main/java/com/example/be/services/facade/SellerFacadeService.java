package com.example.be.services.facade;

import com.example.be.dao.*;
import com.example.be.dto.seller.*;
import com.example.be.entities.SellerProfile;
import com.example.be.entities.Template;
import com.example.be.mappers.*;
import com.example.be.services.SecurityService;
import com.example.be.services.domain.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@PreAuthorize("hasRole('SELLER')")
public class SellerFacadeService {

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
    private final WishlistDomainService wishlistDomainService;
    private final SecurityService securityService;
    private final CartDomainService cartDomainService;
    private final CartMapper cartMapper;
    private final ReviewsDomainService reviewsDomainService;
    private final ReviewsMapper reviewsMapper;
    private final CommentDomainService commentDomainService;
    private final CommentMapper commentMapper;
    private final WishlistMapper wishlistMapper;

    // Seller Profile Management
    @PreAuthorize("#userId == authentication.principal.id")
    public SellerProfileDto createSellerProfile(Long userId, SellerRegisterDto dto) throws Exception {
        return sellerProfileMapper.entityToDto(sellerDomainService.createSellerProfile(userId, dto));
    }

    @PreAuthorize("@sellerSecurityService.isSellerOwner(#sellerId, authentication.principal.id)")
    public SellerProfileDto updateSellerProfile(Long sellerId, UpdateSellerProfileDto dto) throws Exception {
        SellerProfile updatedProfile = sellerDomainService.updateSellerProfile(sellerId, dto);
        return sellerProfileMapper.entityToDto(updatedProfile);
    }

    @PreAuthorize("@sellerSecurityService.isSellerOwner(#sellerId, authentication.principal.id)")
    public SellerProfileDto getSellerProfile(Long sellerId) throws Exception {
        SellerProfile sellerProfile = sellerDomainService.getSellerById(sellerId);
        return sellerProfileMapper.entityToDto(sellerProfile);
    }

    // Template Management
    @PreAuthorize("@sellerSecurityService.isSellerOwner(#sellerId, authentication.principal.id)")
    public SellerTemplateDto createTemplate(Long sellerId, CreateTemplateDto dto) {
        Template template = templateDomainService.createTemplate(sellerId, dto);
        return templateMapper.entityToSellerTemplateDto(template);
    }

    @PreAuthorize("@sellerSecurityService.isTemplateOwner(#templateId, authentication.principal.id)")
    public SellerTemplateDto getTemplate(Long templateId) {
        Template template = templateDomainService.getTemplateById(templateId);
        return templateMapper.entityToSellerTemplateDto(template);
    }

    @PreAuthorize("@sellerSecurityService.isTemplateOwner(#templateId, authentication.principal.id)")
    public SellerTemplateDto updateTemplate(Long templateId, UpdateTemplateDto dto) {
        Template updatedTemplate = templateDomainService.updateTemplate(templateId, dto);
        return templateMapper.entityToSellerTemplateDto(updatedTemplate);
    }

    @PreAuthorize("@sellerSecurityService.isTemplateOwner(#templateId, authentication.principal.id)")
    public void deleteTemplate(Long templateId) {
        templateDomainService.deleteTemplate(templateId);
    }

    @PreAuthorize("@sellerSecurityService.isSellerOwner(#sellerId, authentication.principal.id)")
    public Page<SellerTemplateDto> getSellerTemplates(Long sellerId, Pageable pageable) {
        Page<Template> templates = templateDomainService.searchTemplates(null, null, null, null, null, null
                , null, null, null, null, sellerId, pageable);
        return templates.map(templateMapper::entityToSellerTemplateDto);
    }

    // Sales & Analytics
    @PreAuthorize("@sellerSecurityService.isSellerOwner(#sellerId, authentication.principal.id)")
    public SellerDashboardDto getDashboard(Long sellerId) throws Exception {
        return sellerDomainService.getSellerStats(sellerId);
    }

//    @PreAuthorize("@sellerSecurityService.isSellerOwner(#sellerId, authentication.principal.id)")
//    public List<SalesReportDto> getSalesReports(Long sellerId, LocalDateTime from, LocalDateTime to) {
//        List<SalesReport> salesReports = salesReportDomainService.getSalesReports(sellerId, from, to);
//        return salesReports.stream()
//                .map(salesReportMapper::entityToDto)
//                .collect(Collectors.toList());
//    }
//
//    @PreAuthorize("@sellerSecurityService.isSellerOwner(#sellerId, authentication.principal.id)")
//    public Page<ReviewDto> getTemplateReviews(Long sellerId, Long templateId, Pageable pageable) {
//        // Validate that template belongs to seller
//        if (!templateDomainService.isTemplateOwnedBySeller(templateId, sellerId)) {
//            throw new IllegalArgumentException("Template does not belong to seller");
//        }
//
//        Page<Review> reviews = reviewDomainService.getTemplateReviews(templateId, pageable);
//        return reviews.map(reviewMapper::entityToDto);
//    }

    // Payout Management
    @PreAuthorize("@sellerSecurityService.isSellerOwner(#sellerId, authentication.principal.id)")
    public PayoutDto requestPayout(Long sellerId, PayoutRequestDto dto) {
        return null;
    }

    @PreAuthorize("@sellerSecurityService.isSellerOwner(#sellerId, authentication.principal.id)")
    public Page<PayoutDto> getPayoutHistory(Long sellerId, Pageable pageable) {
        return null;
    }

    @PreAuthorize("@sellerSecurityService.isSellerOwner(#sellerId, authentication.principal.id)")
    public Double getAvailableBalance(Long sellerId) {
        return null;
    }
}

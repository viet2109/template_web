package com.example.be.services.facade;

import com.example.be.dao.OrderItemDao;
import com.example.be.dao.SellerDao;
import com.example.be.dao.TemplateDao;
import com.example.be.dao.UserDao;
import com.example.be.dto.user.*;
import com.example.be.entities.Template;
import com.example.be.entities.User;
import com.example.be.enums.Category;
import com.example.be.enums.Color;
import com.example.be.enums.TemplateStatus;
import com.example.be.enums.UserStatus;
import com.example.be.mappers.*;
import com.example.be.services.SecurityService;
import com.example.be.services.domain.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@PreAuthorize("permitAll()")
public class PublicFacadeService {
    private final AuthenticationDomainService authenticationDomainService;
    private final UserDomainService userDomainService;
    private final UserMapper userMapper;
    private final TemplateDomainService templateDomainService;
    private final TemplateMapper templateMapper;
    private final ReviewsDomainService reviewsDomainService;
    private final CommentDomainService commentDomainService;
    private final CommentMapper commentMapper;
    private final ReviewsMapper reviewsMapper;
    private final SellerDomainService sellerDomainService;
    private final SellerProfileMapper sellerProfileMapper;
    private final WishlistDomainService wishlistDomainService;
    private final OrderDomainService orderDomainService;
    private final TemplateDao templateDao;
    private final UserDao userDao;
    private final SellerDao sellerDao;
    private final OrderItemDao orderItemDao;
    private final SecurityService securityService;

    public AuthenticationResponse login(UserLoginDto dto) {
        return authenticationDomainService.authenticate(dto);
    }

    public AuthenticationResponse login(GoogleUserInfo dto) {
        return authenticationDomainService.loginGoogleUser(dto);
    }

    public AuthenticationResponse login(FacebookUserInfo dto) {
        return authenticationDomainService.loginFacebookUser(dto);
    }

    public UserProfileDto register(UserRegisterDto dto) throws Exception {
        return userMapper.entityToDto(userDomainService.createUser(dto));
    }

    public void forgotPassword(String email) throws Exception {
        authenticationDomainService.resetPassword(email);
    }

    public void resetPassword(String token, String newPassword) throws Exception {
        authenticationDomainService.confirmPasswordReset(token, newPassword);
    }

    public void verifyEmail(String token) throws Exception {
        authenticationDomainService.verifyEmail(token);
    }

    public Page<TemplateCardDto> getPublicTemplates(String keyword, Category category, Set<Color> colors, BigDecimal minPrice, Boolean isFree, BigDecimal maxPrice, LocalDateTime createdAfter, LocalDateTime createdBefore, String sellerName, Long userId, Pageable pageable) {
        return templateDomainService.searchTemplates(keyword, category, colors, minPrice, maxPrice, isFree, TemplateStatus.APPROVED, createdAfter, createdBefore, sellerName, null, pageable).map(template -> {
            TemplateCardDto dto = templateMapper.entityToCardDto(template);
            dto.setIsInWishlist(wishlistDomainService.isInWishlist(userId, template.getId()));
            dto.setIsPurchased(orderDomainService.hasUserPurchasedTemplate(userId, template.getId()));
            return dto;
        });
    }

    public TemplateDetailDto getPublicTemplateDetail(Long userId, Long templateId) throws Exception {
        Template template = templateDomainService.getTemplateById(templateId);
        if (template.getStatus() != TemplateStatus.APPROVED) {
            throw new Exception("Template not available");
        }
        TemplateDetailDto dto = templateMapper.entityToDto(template);
        dto.setIsInWishlist(userId != null && wishlistDomainService.isInWishlist(userId, templateId));
        dto.setIsPurchased(userId != null && orderDomainService.hasUserPurchasedTemplate(userId, templateId));
        dto.setCommentDtoPage(getTemplateComments(templateId, PageRequest.of(0, 5)));
        dto.setReviewDtoPage(getTemplateReviews(templateId, PageRequest.of(0, 5)));
        return dto;
    }

    public SellerBasicDto getPublicSellerDetail(Long sellerId) throws Exception {
        return sellerProfileMapper.entityToBasicDto(sellerDomainService.getSellerById(sellerId));
    }

    public Page<TemplateCardDto> searchTemplates(
            String keyword,
            Category category,
            Set<Color> colors,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Boolean isFree,
            LocalDateTime createdAfter,
            LocalDateTime createdBefore,
            Pageable pageable) {
        User user = securityService.getUserFromRequest();
        return templateDomainService.searchTemplates(keyword, category, colors, minPrice, maxPrice, isFree, TemplateStatus.APPROVED, createdAfter, createdBefore, null, null, pageable).map(template -> {
            TemplateCardDto dto = templateMapper.entityToCardDto(template);
            dto.setIsInWishlist(user != null && wishlistDomainService.isInWishlist(user.getId(), template.getId()));
            dto.setIsPurchased(user != null && orderDomainService.hasUserPurchasedTemplate(user.getId(), template.getId()));
            return dto;
        });
    }

    public Page<ReviewDto> getTemplateReviews(Long templateId, Pageable pageable) {
        return reviewsDomainService.getTemplateReviews(templateId, pageable).map(reviewsMapper::entityToDto);
    }

    public List<TemplateCardDto> getFeaturedTemplates(Long userId) {
        // Get templates with high ratings and sales
        Pageable pageable = PageRequest.of(0, 8, Sort.by("rating", "totalSales").descending());

        Page<Template> templates = templateDao.findByStatus(
                TemplateStatus.APPROVED, pageable);

        return templates.getContent().stream()
                .map(template -> {
                    TemplateCardDto dto = templateMapper.entityToCardDto(template);
                    dto.setIsInWishlist(wishlistDomainService.isInWishlist(userId, template.getId()));
                    dto.setIsPurchased(orderDomainService.hasUserPurchasedTemplate(userId, template.getId()));

                    return dto;
                })
                .collect(Collectors.toList());
    }

    public List<TemplateCardDto> getPopularTemplates(Long userId) {
        // Get templates with most sales
        Pageable pageable = PageRequest.of(0, 8, Sort.by("totalSales").descending());

        return getTemplateCardDtos(userId, pageable);
    }

    private List<TemplateCardDto> getTemplateCardDtos(Long userId, Pageable pageable) {
        Page<Template> templates = templateDao.findByStatus(
                TemplateStatus.APPROVED, pageable);

        return templates.getContent().stream()
                .map(template -> {
                    TemplateCardDto dto = templateMapper.entityToCardDto(template);
                    dto.setIsInWishlist(userId != null && wishlistDomainService.isInWishlist(userId, template.getId()));
                    dto.setIsPurchased(userId != null && orderDomainService.hasUserPurchasedTemplate(userId, template.getId()));
                    ;
                    return dto;
                })
                .collect(Collectors.toList());
    }

    public List<TemplateCardDto> getNewTemplates(Long userId) {
        // Get newest approved templates
        Pageable pageable = PageRequest.of(0, 8, Sort.by("createdAt").descending());

        return getTemplateCardDtos(userId, pageable);
    }

    public Page<CommentDto> getTemplateComments(Long templateId, Pageable pageable) {
        return commentDomainService.getTemplateComments(templateId, pageable).map(commentMapper::entityToDto);
    }

    public List<Category> getCategories() {
        return Arrays.asList(Category.values());
    }

    public List<Color> getColors() {
        return Arrays.asList(Color.values());
    }

    public SiteStatsDto getSiteStatistics() {
        long totalUsers = userDao.countByStatus(UserStatus.ACTIVE);
        long totalSellers = sellerDao.countByIsApprovedIsTrue();
        long totalTemplates = templateDao.countByStatus(TemplateStatus.APPROVED);
        long totalSales = orderItemDao.count();

        return SiteStatsDto.builder()
                .totalUsers(totalUsers)
                .totalSellers(totalSellers)
                .totalTemplates(totalTemplates)
                .totalSales(totalSales)
                .build();
    }

    public List<String> getTechStacks() {
        // Get unique tech stacks from approved templates
        List<Template> templates = templateDao.findByStatus(TemplateStatus.APPROVED);

        return templates.stream()
                .map(Template::getTechStack)
                .filter(StringUtils::hasText)
                .flatMap(techStack -> Arrays.stream(techStack.split(",")))
                .map(String::trim)
                .distinct()
                .sorted()
                .collect(Collectors.toList());
    }
}

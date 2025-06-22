package com.example.be.services.domain;

import com.example.be.dao.SellerDao;
import com.example.be.dao.TemplateDao;
import com.example.be.dto.admin.ApproveTemplateDto;
import com.example.be.dto.seller.CreateTemplateDto;
import com.example.be.dto.seller.UpdateTemplateDto;
import com.example.be.entities.SellerProfile;
import com.example.be.entities.Template;
import com.example.be.enums.AppError;
import com.example.be.enums.Category;
import com.example.be.enums.Color;
import com.example.be.enums.TemplateStatus;
import com.example.be.exceptions.AppException;
import com.example.be.services.FileService;
import com.example.be.specifications.TemplateSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class TemplateDomainService {
    private final TemplateDao templateDao;
    private final FileService fileService;
    private final SellerDao sellerDao;


    /**
     * Tìm kiếm các Template.
     *
     * @param keyword        Từ khóa tìm kiếm trong tên hoặc mô tả template (có thể null để bỏ qua).
     * @param category       Danh mục của template (có thể null để không lọc theo danh mục).
     * @param colors         Tập hợp màu sắc mà template phải có ít nhất một (có thể null hoặc rỗng để bỏ qua).
     * @param minPrice       Giá tối thiểu (có thể null nếu không giới hạn bên dưới).
     * @param maxPrice       Giá tối đa (có thể null nếu không giới hạn bên trên).
     * @param templateStatus Trạng thái của template (PUBLISHED, DRAFT, v.v.; null để bỏ qua).
     * @param createdAfter   Lọc template tạo sau mốc thời gian này (có thể null).
     * @param createdBefore  Lọc template tạo trước mốc thời gian này (có thể null).
     * @param sellerName     Tên người bán (có thể null để không lọc theo tên).
     * @param sellerId       ID người bán (có thể null để không lọc theo seller cụ thể).
     * @param pageable       Thông tin phân trang và sắp xếp.
     * @return Trang kết quả chứa các Template thỏa mãn các tiêu chí.
     */
    public Page<Template> searchTemplates(
            String keyword,
            Category category,
            Set<Color> colors,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Boolean isFree,
            TemplateStatus templateStatus,
            LocalDateTime createdAfter,
            LocalDateTime createdBefore,
            String sellerName,
            Long sellerId,
            Pageable pageable
    ) {
        Specification<Template> spec = Specification.where(null);

        if (isFree != null) {
            if (isFree) {
                spec = spec.and(TemplateSpecification.isFree());
            } else {
                spec = spec.and(TemplateSpecification.isPaid());
            }
        }

        if (keyword != null) {
            spec = spec.and(TemplateSpecification.hasNameLike(keyword));
        }
        if (category != null) {
            spec = spec.and(TemplateSpecification.hasCategory(category));
        }
        if (colors != null && !colors.isEmpty()) {
            spec = spec.and(TemplateSpecification.hasAnyColor(colors));
        }

        if (Boolean.FALSE.equals(isFree)) {
            if (minPrice != null) {
                spec = spec.and(TemplateSpecification.hasPriceGreaterThanOrEqualTo(minPrice));
            }
            if (maxPrice != null) {
                spec = spec.and(TemplateSpecification.hasPriceLessThanOrEqualTo(maxPrice));
            }
        }

        if (templateStatus != null) {
            spec = spec.and(TemplateSpecification.hasStatus(templateStatus));
        }
        if (createdAfter != null) {
            spec = spec.and(TemplateSpecification.createdAfter(createdAfter));
        }
        if (createdBefore != null) {
            spec = spec.and(TemplateSpecification.createdBefore(createdBefore));
        }
        if (sellerName != null) {
            spec = spec.and(TemplateSpecification.sellerNameLike(sellerName));
        }
        if (sellerId != null) {
            spec = spec.and(TemplateSpecification.hasSellerId(sellerId));
        }

        return templateDao.findAll(spec, pageable);
    }

    public Template getTemplateById(Long templateId) {
        return templateDao.findById(templateId)
                .orElseThrow(() -> new AppException(AppError.TEMPLATE_NOT_FOUND));
    }

    /**
     * Tạo template
     */
    public Template createTemplate(Long sellerId, CreateTemplateDto dto) {
        SellerProfile seller = getSellerById(sellerId);
        if (!seller.getIsApproved()) {
            throw new AppException(AppError.BAD_REQUEST);
        }

        Template template = Template.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .category(dto.getCategory())
                .colors(dto.getColors())
                .isFree(dto.getIsFree())
                .price(dto.getPrice())
                .downloadFile(fileService.upload(dto.getDownloadFile()))
                .licenseType(dto.getLicenseType())
                .seller(seller)
                .status(TemplateStatus.PENDING)
                .build();

        Optional.ofNullable(dto.getThumbnailFile()).ifPresent(thumb -> {
            template.setThumbnailFile(fileService.upload(thumb));
        });
        Optional.ofNullable(dto.getDiscountPrice()).ifPresent(template::setDiscountPrice);
        Optional.ofNullable(dto.getTechStack()).ifPresent(template::setTechStack);
        Optional.ofNullable(dto.getFeatures()).ifPresent(template::setFeatures);
        Optional.ofNullable(dto.getCompatibility()).ifPresent(template::setCompatibility);
        Optional.ofNullable(dto.getMaxPurchases()).ifPresent(template::setMaxPurchases);
        Optional.ofNullable(dto.getDemoUrl()).ifPresent(template::setDemoUrl);

        return templateDao.save(template);
    }

    /**
     * Cập nhật template
     */
    public Template updateTemplate(Long templateId, UpdateTemplateDto dto) {
        Template template = getTemplateById(templateId);

        if (template.getStatus() == TemplateStatus.APPROVED) {
            // Only allow certain fields to be updated for approved templates
            if (dto.getPrice() != null) template.setPrice(dto.getPrice());
            if (dto.getDiscountPrice() != null) template.setDiscountPrice(dto.getDiscountPrice());
            if (dto.getDemoUrl() != null) template.setDemoUrl(dto.getDemoUrl());
            if (dto.getMaxPurchases() != null) template.setMaxPurchases(dto.getMaxPurchases());
        } else {
            // Allow all fields for non-approved templates
            if (dto.getName() != null) template.setName(dto.getName());
            if (dto.getDescription() != null) template.setDescription(dto.getDescription());
            if (dto.getCategory() != null) template.setCategory(dto.getCategory());
            if (dto.getColors() != null) template.setColors(dto.getColors());
            if (dto.getIsFree() != null) template.setIsFree(dto.getIsFree());
            if (dto.getPrice() != null) template.setPrice(dto.getPrice());
            if (dto.getDiscountPrice() != null) template.setDiscountPrice(dto.getDiscountPrice());
            if (dto.getTechStack() != null) template.setTechStack(dto.getTechStack());
            if (dto.getFeatures() != null) template.setFeatures(dto.getFeatures());
            if (dto.getCompatibility() != null) template.setCompatibility(dto.getCompatibility());
            if (dto.getMaxPurchases() != null) template.setMaxPurchases(dto.getMaxPurchases());
            if (dto.getDemoUrl() != null) template.setDemoUrl(dto.getDemoUrl());
            if (dto.getLicenseType() != null) template.setLicenseType(dto.getLicenseType());
            if (dto.getDownloadFile() != null) {
                template.setDownloadFile(fileService.upload(dto.getDownloadFile()));
            }
            if (dto.getThumbnailFile() != null) {
                template.setThumbnailFile(fileService.upload(dto.getThumbnailFile()));
            }
        }

        return templateDao.save(template);
    }

    /**
     * Cập nhật trạng thái phê duyệt cho một Template.
     */
    public Template approveTemplate(Long templateId, ApproveTemplateDto dto) {
        Template template = getTemplateById(templateId);

        template.setStatus(dto.getStatus());
        if (dto.getStatus() == TemplateStatus.APPROVED) {
            template.setApprovedAt(LocalDateTime.now());
        } else if (dto.getStatus() == TemplateStatus.REJECTED) {
            template.setRejectionReason(dto.getRejectionReason());
        }

        return templateDao.save(template);
    }

    private SellerProfile getSellerById(Long sellerId) {
        return sellerDao.findById(sellerId)
                .orElseThrow(() -> new AppException(AppError.USER_NOT_FOUND));
    }

    /**
     * Xóa một Template nếu thỏa mãn điều kiện.
     *
     * @param templateId ID của Template cần xóa.
     */
    public void deleteTemplate(Long templateId) {
        Template template = getTemplateById(templateId);

        if (template.getTotalSales() > 0) {
            throw new IllegalStateException("Cannot delete template with existing sales");
        }

        templateDao.delete(template);
    }

    /**
     * Lấy danh sách các Template bán chạy nhất.
     */
    public List<Template> findTopSellingTemplates() {
        return templateDao.findTopByTotalSales(PageRequest.of(0, 10));
    }

    public void updateRating(Long templateId, double averageRating, int reviewSize) {
        Template template = templateDao.findById(templateId).orElseThrow(() -> new AppException(AppError.TEMPLATE_NOT_FOUND));
        template.setRating(BigDecimal.valueOf(averageRating));
        template.setTotalReviews(reviewSize);
        templateDao.save(template);
    }
}

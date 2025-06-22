package com.example.be.services.domain;

import com.example.be.dao.OrderItemDao;
import com.example.be.dao.ReviewsDao;
import com.example.be.dao.SellerDao;
import com.example.be.dao.TemplateDao;
import com.example.be.dto.user.CreateReviewDto;
import com.example.be.dto.user.UpdateReviewDto;
import com.example.be.entities.OrderItem;
import com.example.be.entities.Review;
import com.example.be.entities.SellerProfile;
import com.example.be.entities.Template;
import com.example.be.enums.AppError;
import com.example.be.enums.OrderStatus;
import com.example.be.exceptions.AppException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ReviewsDomainService {

    private final ReviewsDao reviewsDao;
    private final OrderItemDao orderItemDao;
    private final TemplateDomainService templateDomainService;
    private final TemplateDao templateDao;
    private final SellerDao sellerDao;

    public Review createReview(Long userId, CreateReviewDto dto) throws Exception {
        OrderItem orderItem = orderItemDao.findById(dto.getOrderItemId())
                .orElseThrow(() -> new Exception("Order item not found"));

        if (!orderItem.getOrder().getUser().getId().equals(userId)) {
            throw new Exception("Not authorized to review this template");
        }

        if (orderItem.getOrder().getStatus() != OrderStatus.COMPLETED) {
            throw new Exception("Can only review completed orders");
        }

        if (!orderItem.getTemplate().getId().equals(dto.getTemplateId())) {
            throw new Exception("Template ID mismatch");
        }

        if (reviewsDao.existsByUser_IdAndTemplate_Id(userId, dto.getTemplateId())) {
            throw new Exception("You have already reviewed this template");
        }

        Review review = new Review();
        review.setUser(orderItem.getOrder().getUser());
        review.setTemplate(orderItem.getTemplate());
        review.setOrderItem(orderItem);
        review.setRating(dto.getRating());
        review.setComment(dto.getComment());

        Review savedReview = reviewsDao.save(review);

        // Update template stats
        updateTemplateRating(dto.getTemplateId());
        updateSellerRating(dto.getTemplateId());
        return savedReview;
    }

    public Page<Review> getTemplateReviews(Long templateId, Pageable pageable) {
        return reviewsDao.findByTemplate_Id(templateId, pageable);
    }

    public Review updateReview(Long reviewId, UpdateReviewDto dto) throws Exception {
        Review review = reviewsDao.findById(reviewId)
                .orElseThrow(() -> new Exception("Review not found"));

        review.setRating(dto.getRating());
        review.setComment(dto.getComment());

        Review savedReview = reviewsDao.save(review);

        // Update template rating
        updateTemplateRating(review.getTemplate().getId());
        updateSellerRating(review.getTemplate().getId());
        return savedReview;
    }

    public void deleteReview(Long reviewId) throws Exception {
        Review review = reviewsDao.findById(reviewId)
                .orElseThrow(() -> new Exception("Review not found"));

        Long templateId = review.getTemplate().getId();
        reviewsDao.delete(review);

        // Update template rating
        updateTemplateRating(templateId);
    }

    private void updateTemplateRating(Long templateId) {
        List<Review> reviews = reviewsDao.findByTemplate_Id(templateId);
        if (!reviews.isEmpty()) {
            double averageRating = reviews.stream()
                    .mapToInt(Review::getRating)
                    .average()
                    .orElse(0.0);
            templateDomainService.updateRating(templateId, averageRating, reviews.size());
        }
    }

    private void updateSellerRating(Long templateId) {
        Template template = templateDao.findById(templateId).orElseThrow(() -> new AppException(AppError.TEMPLATE_NOT_FOUND));
        SellerProfile sellerProfile = template.getSeller();
        List<Review> reviews = reviewsDao.findByTemplate_Id(templateId);
        if (!reviews.isEmpty()) {
            double averageRating = reviews.stream()
                    .mapToInt(Review::getRating)
                    .average()
                    .orElse(0.0);
            sellerProfile.setRating(BigDecimal.valueOf(averageRating));
            sellerProfile.setTotalReviews(reviews.size() + 1);
            sellerDao.save(sellerProfile);
        }
    }


    public Page<Review> getUserReviews(Long userId, Pageable pageable) {
        return reviewsDao.findByUser_Id(userId, pageable);
    }
}
package com.example.be.controllers;

import com.example.be.dto.user.CreateReviewDto;
import com.example.be.dto.user.ReviewDto;
import com.example.be.dto.user.UpdateReviewDto;
import com.example.be.services.SecurityService;
import com.example.be.services.facade.UserFacadeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/reviews")
@RequiredArgsConstructor
@PreAuthorize("hasRole('USER')")
@Tag(
        name = "Đánh giá",
        description = "Các API tạo, sửa, xóa đánh giá dành cho người dùng đã đăng nhập"
)
@SecurityRequirement(name = "bearerAuth")
public class ReviewController {

    private final UserFacadeService userFacadeService;
    private final SecurityService securityService;

    @Operation(
            summary = "Tạo đánh giá",
            description = "Gửi đánh giá cho một template hoặc người bán, bao gồm điểm số và nội dung"
    )
    @PostMapping
    public ResponseEntity<ReviewDto> createReview(
            @Valid @RequestBody CreateReviewDto request) throws Exception {

        Long userId = securityService.getUserFromRequest().getId();
        ReviewDto review = userFacadeService.createReview(userId, request);
        return ResponseEntity.ok(review);
    }

    @Operation(
            summary = "Cập nhật đánh giá",
            description = "Chỉnh sửa nội dung và/hoặc điểm số của đánh giá đã tạo trước đó"
    )
    @PutMapping("/{id}")
    public ResponseEntity<ReviewDto> updateReview(
            @PathVariable Long id,
            @Valid @RequestBody UpdateReviewDto request) throws Exception {

        Long userId = securityService.getUserFromRequest().getId();
        ReviewDto review = userFacadeService.updateReview(userId, id, request);
        return ResponseEntity.ok(review);
    }

    @Operation(
            summary = "Xóa đánh giá",
            description = "Xóa đánh giá theo ID, chỉ người tạo đánh giá mới có quyền"
    )
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long id) throws Exception {
        Long userId = securityService.getUserFromRequest().getId();
        userFacadeService.deleteReview(userId, id);
        return ResponseEntity.ok().build();
    }
}

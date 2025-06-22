package com.example.be.controller;

import com.example.be.Utils;
import com.example.be.dto.user.CommentDto;
import com.example.be.dto.user.ReviewDto;
import com.example.be.dto.user.TemplateCardDto;
import com.example.be.dto.user.TemplateDetailDto;
import com.example.be.entities.User;
import com.example.be.enums.Category;
import com.example.be.enums.Color;
import com.example.be.services.SecurityService;
import com.example.be.services.facade.PublicFacadeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

@RestController
@RequestMapping("/templates")
@RequiredArgsConstructor
@Tag(
        name = "Template công khai",
        description = "Các API tìm kiếm, xem chi tiết và lấy đánh giá/bình luận của template"
)
public class TemplateController {

    private final PublicFacadeService publicFacadeService;
    private final SecurityService securityService;

    @Operation(
            summary = "Tìm kiếm và phân trang template",
            description = "Lọc template theo từ khóa, danh mục, màu sắc, giá, miễn phí, ngày tạo và phân trang"
    )
    @GetMapping
    public ResponseEntity<Page<TemplateCardDto>> getTemplates(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Category category,
            @RequestParam(required = false) Set<Color> colors,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Boolean isFree,
            @RequestParam(required = false) LocalDateTime createdAfter,
            @RequestParam(required = false) LocalDateTime createdBefore,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt,desc") String[] sort
    ) {
        Pageable pageable = PageRequest.of(page, size, Utils.parseSort(sort));
        Page<TemplateCardDto> templates = publicFacadeService.searchTemplates(
                keyword, category, colors, minPrice, maxPrice, isFree, createdAfter, createdBefore, pageable
        );
        return ResponseEntity.ok(templates);
    }

    @Operation(
            summary = "Xem chi tiết template",
            description = "Trả về thông tin chi tiết của template, bao gồm metadata, đánh giá, bình luận"
    )
    @GetMapping("/{id}")
    public ResponseEntity<TemplateDetailDto> getTemplate(@PathVariable Long id) throws Exception {
        User user = securityService.getUserFromRequest();
        TemplateDetailDto template = publicFacadeService.getPublicTemplateDetail(
                user != null ? user.getId() : null, id
        );
        return ResponseEntity.ok(template);
    }

    @Operation(
            summary = "Lấy đánh giá của template",
            description = "Phân trang danh sách đánh giá cho template theo ID"
    )
    @GetMapping("/{id}/reviews")
    public ResponseEntity<Page<ReviewDto>> getTemplateReviews(
            @PathVariable Long id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ReviewDto> reviews = publicFacadeService.getTemplateReviews(id, pageable);
        return ResponseEntity.ok(reviews);
    }

    @Operation(
            summary = "Lấy bình luận của template",
            description = "Phân trang danh sách bình luận cho template theo ID"
    )
    @GetMapping("/{id}/comments")
    public ResponseEntity<Page<CommentDto>> getTemplateComments(
            @PathVariable Long id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<CommentDto> comments = publicFacadeService.getTemplateComments(id, pageable);
        return ResponseEntity.ok(comments);
    }
}

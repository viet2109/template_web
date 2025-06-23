package com.example.be.controllers;

import com.example.be.Utils;
import com.example.be.dto.admin.AdminTemplateDto;
import com.example.be.dto.admin.ApproveTemplateDto;
import com.example.be.enums.Category;
import com.example.be.enums.Color;
import com.example.be.enums.TemplateStatus;
import com.example.be.services.facade.AdminFacadeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

@Slf4j
@RestController
@RequestMapping("/admin/templates")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(
        name = "Quản trị template",
        description = "Các API quản lý template (duyệt, xóa, tìm kiếm) dành cho ADMIN"
)
@SecurityRequirement(name = "bearerAuth")
public class AdminTemplateController {

    private final AdminFacadeService adminFacadeService;

    @Operation(
            summary = "Tìm kiếm và phân trang template",
            description = "Lọc template theo từ khoá, danh mục, màu sắc, giá, trạng thái, ngày tạo, tên người bán"
    )
    @GetMapping
    public ResponseEntity<Page<AdminTemplateDto>> getTemplates(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Category category,
            @RequestParam(required = false) Set<Color> colors,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Boolean isFree,
            @RequestParam(required = false) TemplateStatus templateStatus,
            @RequestParam(required = false) LocalDateTime createdAfter,
            @RequestParam(required = false) LocalDateTime createdBefore,
            @RequestParam(required = false) String sellerName,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt,desc") String[] sort) {

        Pageable pageable = PageRequest.of(page, size, Utils.parseSort(sort));
        Page<AdminTemplateDto> templates = adminFacadeService
                .searchTemplates(keyword, category, colors, minPrice, maxPrice, isFree,
                        templateStatus, createdAfter, createdBefore, sellerName,
                        null, pageable);
        return ResponseEntity.ok(templates);
    }

    @Operation(
            summary = "Lấy chi tiết template",
            description = "Trả về thông tin chi tiết của một template theo ID"
    )
    @GetMapping("/{id}")
    public ResponseEntity<AdminTemplateDto> getTemplate(@PathVariable Long id) {
        AdminTemplateDto template = adminFacadeService.getTemplateDetail(id);
        return ResponseEntity.ok(template);
    }

    @Operation(
            summary = "Duyệt template",
            description = "Phê duyệt một template với lý do và ghi chú kèm theo"
    )
    @PutMapping("/{id}/approve")
    public ResponseEntity<AdminTemplateDto> approveTemplate(
            @PathVariable Long id
    ) {
        AdminTemplateDto template = adminFacadeService.approveTemplate(id, ApproveTemplateDto.builder().status(TemplateStatus.APPROVED).build());
        log.info(template.toString());
        return ResponseEntity.ok(template);
    }

    @Operation(
            summary = "Từ chối template",
            description = "Từ chối một template với lý do từ chối được cung cấp"
    )
    @PutMapping("/{id}/reject")
    public ResponseEntity<AdminTemplateDto> rejectTemplate(
            @PathVariable Long id,
            @Valid @RequestBody String reason) {

        AdminTemplateDto template = adminFacadeService.rejectTemplate(id, reason);
        log.info(template.toString());

        return ResponseEntity.ok(template);
    }

    @Operation(
            summary = "Xóa template",
            description = "Xóa hoàn toàn một template theo ID"
    )
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTemplate(@PathVariable Long id) {
        adminFacadeService.deleteTemplate(id);
        return ResponseEntity.ok().build();
    }
}

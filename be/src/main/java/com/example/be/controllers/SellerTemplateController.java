package com.example.be.controllers;

import com.example.be.Utils;
import com.example.be.dto.seller.CreateTemplateDto;
import com.example.be.dto.seller.SellerTemplateDto;
import com.example.be.dto.seller.UpdateTemplateDto;
import com.example.be.services.facade.SellerFacadeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/sellers/{id}/templates")
@RequiredArgsConstructor
@PreAuthorize("hasRole('SELLER')")
@Tag(
        name = "Template của Seller",
        description = "Các API quản lý template (tạo, xem, cập nhật, xóa) cho Seller"
)
@SecurityRequirement(name = "bearerAuth")
public class SellerTemplateController {

    private final SellerFacadeService sellerTemplateFacadeService;

    @Operation(
            summary = "Tạo template mới",
            description = "Cho phép Seller tạo một template mới với các thông tin chi tiết"
    )
    @PostMapping
    public ResponseEntity<SellerTemplateDto> createTemplate(
            @PathVariable Long id,
            @ModelAttribute @Valid CreateTemplateDto request) {

        SellerTemplateDto template = sellerTemplateFacadeService.createTemplate(id, request);
        return ResponseEntity.ok(template);
    }

    @Operation(
            summary = "Lấy danh sách template của Seller",
            description = "Trả về trang các template đã tạo bởi Seller, hỗ trợ phân trang và sắp xếp"
    )
    @GetMapping
    public ResponseEntity<Page<SellerTemplateDto>> getMyTemplates(
            @PathVariable Long id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt,desc") String[] sort) {

        Pageable pageable = PageRequest.of(page, size, Utils.parseSort(sort));
        Page<SellerTemplateDto> templates = sellerTemplateFacadeService.getSellerTemplates(id, pageable);
        return ResponseEntity.ok(templates);
    }

    @Operation(
            summary = "Lấy chi tiết template",
            description = "Trả về thông tin chi tiết của một template theo ID"
    )
    @GetMapping("/{templateId}")
    public ResponseEntity<SellerTemplateDto> getTemplate(
            @PathVariable Long templateId) {

        SellerTemplateDto template = sellerTemplateFacadeService.getTemplate(templateId);
        return ResponseEntity.ok(template);
    }

    @Operation(
            summary = "Cập nhật template",
            description = "Chỉnh sửa thông tin của template đã tồn tại"
    )
    @PutMapping("/{templateId}")
    public ResponseEntity<SellerTemplateDto> updateTemplate(
            @PathVariable Long templateId,
            @Valid @RequestBody UpdateTemplateDto request) {

        SellerTemplateDto template = sellerTemplateFacadeService.updateTemplate(templateId, request);
        return ResponseEntity.ok(template);
    }

    @Operation(
            summary = "Xóa template",
            description = "Xóa vĩnh viễn một template theo ID"
    )
    @DeleteMapping("/{templateId}")
    public ResponseEntity<Void> deleteTemplate(
            @PathVariable Long templateId) {
        sellerTemplateFacadeService.deleteTemplate(templateId);
        return ResponseEntity.ok().build();
    }
}

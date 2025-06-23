package com.example.be.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

//    private final CategoryFacadeService categoryFacadeService;
//
//    @GetMapping
//    public ResponseEntity<ApiResponse<List<CategoryDto>>> getCategories() {
//        List<CategoryDto> categories = categoryFacadeService.getAllCategories();
//        return ResponseEntity.ok(ApiResponse.success("Categories fetched successfully", categories));
//    }
//
//    @GetMapping("/{id}")
//    public ResponseEntity<ApiResponse<CategoryDto>> getCategory(@PathVariable Long id) {
//        CategoryDto category = categoryFacadeService.getCategoryById(id);
//        return ResponseEntity.ok(ApiResponse.success("Category fetched successfully", category));
//    }
//
//    @GetMapping("/{id}/templates")
//    public ResponseEntity<ApiResponse<PagedResponse<TemplateDto>>> getCategoryTemplates(
//            @PathVariable Long id,
//            @RequestParam(defaultValue = "0") int page,
//            @RequestParam(defaultValue = "20") int size,
//            @RequestParam(defaultValue = "createdAt") String sortBy,
//            @RequestParam(defaultValue = "desc") String sortDirection) {
//        PagedResponse<TemplateDto> templates = categoryFacadeService
//                .getCategoryTemplates(id, page, size, sortBy, sortDirection);
//        return ResponseEntity.ok(ApiResponse.success("Category templates fetched successfully", templates));
//    }
}

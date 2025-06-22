//package com.example.be.controllers;
//
//import lombok.RequiredArgsConstructor;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//@RestController
//@RequiredArgsConstructor
//@RequestMapping("/templates")
//public class TemplateController {
//
////    private final TemplateService templateService;
////
////    @GetMapping("/{id}")
////    public ResponseEntity<TemplateDetailDto> getTemplateById(
////            @PathVariable Long id
////    ) {
////        return ResponseEntity.ok(templateService.getTemplateById(id));
////    }
////
////    @PostMapping
////    public ResponseEntity<TemplateDetailDto> createTemplate(
////            @RequestBody TemplateCreateRequestDto templateCreateRequestDto
////    ) {
////        return ResponseEntity.ok(templateService.createTemplate(templateCreateRequestDto));
////    }
////
////    @GetMapping
////    public ResponseEntity<Page<TemplateDetailDto>> searchTemplates(
////            @RequestParam(required = false) String keyword,
////            @RequestParam(required = false) String sellerName,
////            @RequestParam(required = false) Category category,
////            @RequestParam(required = false) Color[] colors,
////            @RequestParam(required = false) BigDecimal minPrice,
////            @RequestParam(required = false) BigDecimal maxPrice,
////            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate createdAfter,
////            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate createdBefore,
////            @RequestParam(defaultValue = "createdAt,desc") String[] sort,
////            @RequestParam(defaultValue = "0") int page,
////            @RequestParam(defaultValue = "10") int size
////    ) {
////        Pageable pageable = PageRequest.of(page, size, Utils.parseSort(sort));
////        return ResponseEntity.ok(templateService.searchTemplates(keyword, category, Arrays.stream(colors).collect(Collectors.toSet()), minPrice, maxPrice, createdAfter.atStartOfDay(), createdBefore.atStartOfDay(), sellerName, null, pageable));
////    }
////
////    @DeleteMapping("/{id}")
////    public ResponseEntity<Void> deleteTemplateById(
////            @PathVariable Long id
////    ) {
////        templateService.deleteTemplate(id);
////        return ResponseEntity.noContent().build();
////    }
//}

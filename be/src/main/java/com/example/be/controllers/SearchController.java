package com.example.be.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
public class SearchController {

//    private final SearchFacadeService searchFacadeService;
//
//    @GetMapping("/templates")
//    public ResponseEntity<ApiResponse<PagedResponse<TemplateDto>>> searchTemplates(
//            @RequestParam String query,
//            @RequestParam(defaultValue = "0") int page,
//            @RequestParam(defaultValue = "20") int size,
//            @RequestParam(required = false) Category category,
//            @RequestParam(required = false) Set<Color> colors,
//            @RequestParam(required = false) Boolean isFree,
//            @RequestParam(required = false) BigDecimal minPrice,
//            @RequestParam(required = false) BigDecimal maxPrice,
//            @RequestParam(defaultValue = "relevance") String sortBy,
//            @RequestParam(defaultValue = "desc") String sortDirection) {
//
//        TemplateSearchRequest searchRequest = TemplateSearchRequest.builder()
//                .search(query)
//                .category(category)
//                .colors(colors)
//                .isFree(isFree)
//                .minPrice(minPrice)
//                .maxPrice(maxPrice)
//                .build();
//
//        PagedResponse<TemplateDto> templates = searchFacadeService
//                .searchTemplates(searchRequest, page, size, sortBy, sortDirection);
//        return ResponseEntity.ok(ApiResponse.success("Search results fetched successfully", templates));
//    }
//
//    @GetMapping("/suggestions")
//    public ResponseEntity<ApiResponse<List<String>>> getSearchSuggestions(@RequestParam String query) {
//        List<String> suggestions = searchFacadeService.getSearchSuggestions(query);
//        return ResponseEntity.ok(ApiResponse.success("Search suggestions fetched successfully", suggestions));
//    }
//
//    @GetMapping("/popular")
//    public ResponseEntity<ApiResponse<List<String>>> getPopularSearches() {
//        List<String> popularSearches = searchFacadeService.getPopularSearches();
//        return ResponseEntity.ok(ApiResponse.success("Popular searches fetched successfully", popularSearches));
//    }
}

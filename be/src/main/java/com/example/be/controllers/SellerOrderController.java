package com.example.be.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/sellers/{id}/orders")
@RequiredArgsConstructor
@PreAuthorize("hasRole('SELLER')")
public class SellerOrderController {

//    private final SellerFacadeService sellerOrderFacadeService;
//
//    @GetMapping
//    public ResponseEntity<ApiResponse<PagedResponse<OrderDto>>> getSellerOrders(
//            @RequestParam(defaultValue = "0") int page,
//            @RequestParam(defaultValue = "20") int size,
//            @RequestParam(required = false) OrderStatus status,
//            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
//            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
//            Authentication auth) {
//        String userEmail = auth.getName();
//        PagedResponse<OrderDto> orders = sellerOrderFacadeService
//                .getSellerOrders(userEmail, page, size, status, startDate, endDate);
//        return ResponseEntity.ok(ApiResponse.success("Orders fetched successfully", orders));
//    }
//
//    @GetMapping("/{id}")
//    public ResponseEntity<ApiResponse<OrderDetailDto>> getOrder(@PathVariable Long id, Authentication auth) {
//        String userEmail = auth.getName();
//        OrderDetailDto order = sellerOrderFacadeService.getSellerOrder(userEmail, id);
//        return ResponseEntity.ok(ApiResponse.success("Order fetched successfully", order));
//    }
//
//    @GetMapping("/analytics")
//    public ResponseEntity<ApiResponse<SellerOrderAnalyticsDto>> getOrderAnalytics(
//            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
//            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
//            Authentication auth) {
//        String userEmail = auth.getName();
//        SellerOrderAnalyticsDto analytics = sellerOrderFacadeService
//                .getOrderAnalytics(userEmail, startDate, endDate);
//        return ResponseEntity.ok(ApiResponse.success("Analytics fetched successfully", analytics));
//    }
}

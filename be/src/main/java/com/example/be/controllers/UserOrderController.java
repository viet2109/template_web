//package com.example.be.controllers;
//
//import lombok.RequiredArgsConstructor;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//@RestController
//@RequestMapping("/users/{userId}/orders")
//@RequiredArgsConstructor
//public class UserOrderController {
////    private final OrderService orderService;
////    private final SecurityService securityService;
////
////    @GetMapping
////    public ResponseEntity<Page<Order>> searchOrders(
////            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
////
////            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
////
////            @RequestParam(required = false) BigDecimal minTotal,
////
////            @RequestParam(defaultValue = "createdAt,desc") String[] sort,
////
////            @RequestParam(defaultValue = "0") int page,
////
////            @RequestParam(defaultValue = "10") int size,
////            @PathVariable Long userId) {
////        Pageable pageable = PageRequest.of(page, size, Utils.parseSort(sort));
////        if (!securityService.getUserFromRequest().getId().equals(userId)) {
////            throw new AppException(AppError.AUTH_ACCESS_DENIED);
////        }
////        return ResponseEntity.ok(orderService.searchOrders(from, to, minTotal, userId, null, pageable));
////    }
//}

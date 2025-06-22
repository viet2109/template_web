//package com.example.be.controllers;
//
//import lombok.RequiredArgsConstructor;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//@RestController
//@RequestMapping("/seller/orders")
//@RequiredArgsConstructor
//public class SellerOrderController {
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
////            @RequestParam(defaultValue = "10") int size
////    ) {
////        Pageable pageable = PageRequest.of(page, size, Utils.parseSort(sort));
////        User user = securityService.getUserFromRequest();
////        return ResponseEntity.ok(orderService.searchOrders(from, to, minTotal, null, user.getId(), pageable));
////    }
//}

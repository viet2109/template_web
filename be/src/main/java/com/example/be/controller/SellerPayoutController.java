package com.example.be.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/seller/payouts")
@RequiredArgsConstructor
@PreAuthorize("hasRole('SELLER')")
public class SellerPayoutController {
//
//    private final SellerPayoutFacadeService sellerPayoutFacadeService;
//
//    @PostMapping("/request")
//    public ResponseEntity<ApiResponse<PayoutDto>> requestPayout(
//            @Valid @RequestBody PayoutRequest request, Authentication auth) {
//        String userEmail = auth.getName();
//        PayoutDto payout = sellerPayoutFacadeService.requestPayout(userEmail, request);
//        return ResponseEntity.ok(ApiResponse.success("Payout requested successfully", payout));
//    }
//
//    @GetMapping
//    public ResponseEntity<ApiResponse<PagedResponse<PayoutDto>>> getPayouts(
//            @RequestParam(defaultValue = "0") int page,
//            @RequestParam(defaultValue = "20") int size,
//            @RequestParam(required = false) PayoutStatus status,
//            Authentication auth) {
//        String userEmail = auth.getName();
//        PagedResponse<PayoutDto> payouts = sellerPayoutFacadeService
//                .getSellerPayouts(userEmail, page, size, status);
//        return ResponseEntity.ok(ApiResponse.success("Payouts fetched successfully", payouts));
//    }
//
//    @GetMapping("/balance")
//    public ResponseEntity<ApiResponse<SellerBalanceDto>> getBalance(Authentication auth) {
//        String userEmail = auth.getName();
//        SellerBalanceDto balance = sellerPayoutFacadeService.getSellerBalance(userEmail);
//        return ResponseEntity.ok(ApiResponse.success("Balance fetched successfully", balance));
//    }
}
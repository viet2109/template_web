package com.example.be.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/payouts")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminPayoutController {
//
//    private final AdminPayoutFacadeService adminPayoutFacadeService;
//
//    @GetMapping
//    public ResponseEntity<ApiResponse<PagedResponse<PayoutDto>>> getPayouts(
//            @RequestParam(defaultValue = "0") int page,
//            @RequestParam(defaultValue = "20") int size,
//            @RequestParam(required = false) String search,
//            @RequestParam(required = false) PayoutStatus status,
//            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
//            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
//        PagedResponse<PayoutDto> payouts = adminPayoutFacadeService
//                .getPayouts(page, size, search, status, startDate, endDate);
//        return ResponseEntity.ok(ApiResponse.success("Payouts fetched successfully", payouts));
//    }
//
//    @GetMapping("/{id}")
//    public ResponseEntity<ApiResponse<PayoutDetailDto>> getPayout(@PathVariable Long id) {
//        PayoutDetailDto payout = adminPayoutFacadeService.getPayoutDetail(id);
//        return ResponseEntity.ok(ApiResponse.success("Payout fetched successfully", payout));
//    }
//
//    @PostMapping("/{id}/approve")
//    public ResponseEntity<ApiResponse<PayoutDto>> approvePayout(
//            @PathVariable Long id,
//            @Valid @RequestBody ApprovePayoutRequest request) {
//        PayoutDto payout = adminPayoutFacadeService.approvePayout(id, request);
//        return ResponseEntity.ok(ApiResponse.success("Payout approved successfully", payout));
//    }
//
//    @PostMapping("/{id}/reject")
//    public ResponseEntity<ApiResponse<PayoutDto>> rejectPayout(
//            @PathVariable Long id,
//            @Valid @RequestBody RejectPayoutRequest request) {
//        PayoutDto payout = adminPayoutFacadeService.rejectPayout(id, request);
//        return ResponseEntity.ok(ApiResponse.success("Payout rejected successfully", payout));
//    }
//
//    @PostMapping("/{id}/process")
//    public ResponseEntity<ApiResponse<PayoutDto>> processPayout(
//            @PathVariable Long id,
//            @Valid @RequestBody ProcessPayoutRequest request) {
//        PayoutDto payout = adminPayoutFacadeService.processPayout(id, request);
//        return ResponseEntity.ok(ApiResponse.success("Payout processed successfully", payout));
//    }
//
//    @GetMapping("/pending")
//    public ResponseEntity<ApiResponse<PagedResponse<PayoutDto>>> getPendingPayouts(
//            @RequestParam(defaultValue = "0") int page,
//            @RequestParam(defaultValue = "20") int size) {
//        PagedResponse<PayoutDto> payouts = adminPayoutFacadeService.getPendingPayouts(page, size);
//        return ResponseEntity.ok(ApiResponse.success("Pending payouts fetched successfully", payouts));
//    }
}
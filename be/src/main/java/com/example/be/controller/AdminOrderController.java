package com.example.be.controller;

import com.example.be.Utils;
import com.example.be.dto.admin.AdminOrderDto;
import com.example.be.dto.admin.UpdateOrderStatusDto;
import com.example.be.enums.OrderStatus;
import com.example.be.enums.PaymentMethod;
import com.example.be.enums.PaymentStatus;
import com.example.be.services.facade.AdminFacadeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/admin/orders")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(
        name = "Quản trị đơn hàng",
        description = "Các API quản lý đơn hàng dành cho ADMIN"
)
@SecurityRequirement(name = "bearerAuth")
public class AdminOrderController {

    private final AdminFacadeService adminFacadeService;

    @Operation(
            summary = "Lấy danh sách đơn hàng",
            description = "Tìm kiếm và phân trang đơn hàng theo trạng thái, phương thức thanh toán, khoảng ngày tạo và giá trị đơn hàng"
    )
    @GetMapping
    public ResponseEntity<Page<AdminOrderDto>> getOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt,desc") String[] sort,
            @RequestParam(required = false) OrderStatus status,
            @RequestParam(required = false) PaymentStatus paymentStatus,
            @RequestParam(required = false) PaymentMethod paymentMethod,
            @RequestParam(required = false) LocalDateTime createdFrom,
            @RequestParam(required = false) LocalDateTime createdTo,
            @RequestParam(required = false) BigDecimal min,
            @RequestParam(required = false) BigDecimal max) {

        Pageable pageable = PageRequest.of(page, size, Utils.parseSort(sort));
        Page<AdminOrderDto> orders = adminFacadeService
                .searchOrders(status, paymentStatus, paymentMethod, createdFrom, createdTo, min, max, pageable);
        return ResponseEntity.ok(orders);
    }

    @Operation(
            summary = "Lấy chi tiết một đơn hàng",
            description = "Trả về thông tin chi tiết đơn hàng theo ID"
    )
    @GetMapping("/{id}")
    public ResponseEntity<AdminOrderDto> getOrder(@PathVariable Long id) {
        AdminOrderDto order = adminFacadeService.getOrderDetail(id);
        return ResponseEntity.ok(order);
    }

    @Operation(
            summary = "Cập nhật trạng thái đơn hàng",
            description = "Chuyển trạng thái đơn hàng (ví dụ: PENDING → SHIPPED → DELIVERED)"
    )
    @PutMapping("/{id}/status")
    public ResponseEntity<Void> updateOrderStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateOrderStatusDto request) {

        adminFacadeService.updateOrderStatus(id, request);
        return ResponseEntity.ok().build();
    }

    @Operation(
            summary = "Xử lý hoàn tiền cho đơn hàng",
            description = "Thực hiện refund đơn hàng với lý do cung cấp trong request"
    )
    @PostMapping("/{id}/refund")
    public ResponseEntity<Void> processRefund(
            @PathVariable Long id,
            @Valid @RequestBody String reason) {

        adminFacadeService.refundOrder(id, reason);
        return ResponseEntity.ok().build();
    }

//    @Operation(
//        summary = "Thống kê doanh thu theo tháng",
//        description = "Lấy dữ liệu doanh thu trong khoảng thời gian"
//    )
//    @GetMapping("/analytics")
//    public ResponseEntity<ApiResponse<AdminOrderAnalyticsDto>> getOrderAnalytics(
//            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
//            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
//        AdminOrderAnalyticsDto analytics = adminFacadeService.getMonthlySales(startDate, endDate);
//        return ResponseEntity.ok(ApiResponse.success("Order analytics fetched successfully", analytics));
//    }
}

package com.example.be.controllers;

import com.example.be.Utils;
import com.example.be.dto.user.CreateOrderDto;
import com.example.be.dto.user.OrderDto;
import com.example.be.services.SecurityService;
import com.example.be.services.facade.UserFacadeService;
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
@RequestMapping("/orders")
@RequiredArgsConstructor
@PreAuthorize("hasRole('USER')")
@Tag(
        name = "Đơn hàng",
        description = "Các API tạo và quản lý đơn hàng dành cho người dùng"
)
@SecurityRequirement(name = "bearerAuth")
public class OrderController {

    private final UserFacadeService userFacadeService;
    private final SecurityService securityService;

    @Operation(
            summary = "Tạo đơn hàng mới",
            description = "Tạo một đơn hàng từ các mục trong giỏ hàng và thông tin thanh toán"
    )
    @PostMapping
    public ResponseEntity<OrderDto> createOrder(
            @Valid @RequestBody CreateOrderDto request) throws Exception {

        Long userId = securityService.getUserFromRequest().getId();
        OrderDto order = userFacadeService.createOrder(userId, request);
        return ResponseEntity.ok(order);
    }

    @Operation(
            summary = "Lấy lịch sử đơn hàng",
            description = "Trả về danh sách đơn hàng của người dùng hiện tại, có phân trang và sắp xếp"
    )
    @GetMapping
    public ResponseEntity<Page<OrderDto>> getUserOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt,desc") String[] sort) {

        Pageable pageable = PageRequest.of(page, size, Utils.parseSort(sort));
        Long userId = securityService.getUserFromRequest().getId();
        Page<OrderDto> orders = userFacadeService.getOrderHistory(userId, pageable);
        return ResponseEntity.ok(orders);
    }

    @Operation(
            summary = "Lấy chi tiết đơn hàng",
            description = "Trả về thông tin chi tiết của một đơn hàng theo ID"
    )
    @GetMapping("/{id}")
    public ResponseEntity<OrderDto> getOrder(
            @PathVariable Long id) throws Exception {

        Long userId = securityService.getUserFromRequest().getId();
        OrderDto order = userFacadeService.getOrderDetail(userId, id);
        return ResponseEntity.ok(order);
    }

//    @Operation(
//            summary = "Cập nhật trạng thái thanh toán",
//            description = "Xử lý callback từ cổng thanh toán và cập nhật trạng thái đơn hàng"
//    )
//    @PutMapping("/{id}/payment/callback")
//    public ResponseEntity<OrderDto> payment(
//            @PathVariable Long id,
//            @Valid @RequestBody UpdateOrderStatusDto dto) throws Exception {
//
//        Long userId = securityService.getUserFromRequest().getId();
//        OrderDto order = userFacadeService.updateOrderStatus(userId, id, dto, ORDER_ID_PREFIX);
//        return ResponseEntity.ok(order);
//    }
}

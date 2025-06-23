package com.example.be.controllers;

import com.example.be.Utils;
import com.example.be.dto.user.CartItemDto;
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
@RequestMapping("/cart")
@RequiredArgsConstructor
@PreAuthorize("hasRole('USER')")
@Tag(
        name = "Giỏ hàng",
        description = "Các API quản lý giỏ hàng của người dùng"
)
@SecurityRequirement(name = "bearerAuth")
public class CartController {

    private final UserFacadeService userFacadeService;
    private final SecurityService securityService;

    @Operation(
            summary = "Lấy danh sách mục trong giỏ hàng",
            description = "Trả về trang các mục đã thêm vào giỏ hàng của người dùng hiện tại"
    )
    @GetMapping
    public ResponseEntity<Page<CartItemDto>> getCart(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt,desc") String[] sort) {

        Pageable pageable = PageRequest.of(page, size, Utils.parseSort(sort));
        Long userId = securityService.getUserFromRequest().getId();
        Page<CartItemDto> cart = userFacadeService.getCartItems(userId, pageable);
        return ResponseEntity.ok(cart);
    }

    @Operation(
            summary = "Thêm template vào giỏ hàng",
            description = "Thêm một template vào giỏ hàng của người dùng hiện tại"
    )
    @PostMapping("/items")
    public ResponseEntity<CartItemDto> addToCart(
            @Valid @RequestBody Long templateId) throws Exception {

        Long userId = securityService.getUserFromRequest().getId();
        CartItemDto cart = userFacadeService.addToCart(userId, templateId);
        return ResponseEntity.ok(cart);
    }

    @Operation(
            summary = "Xóa một template khỏi giỏ hàng",
            description = "Loại bỏ template có ID tương ứng khỏi giỏ hàng của người dùng"
    )
    @DeleteMapping("/items/{templateId}")
    public ResponseEntity<Void> removeFromCart(
            @PathVariable Long templateId) throws Exception {

        Long userId = securityService.getUserFromRequest().getId();
        userFacadeService.removeFromCart(userId, templateId);
        return ResponseEntity.ok().build();
    }

    @Operation(
            summary = "Xóa toàn bộ giỏ hàng",
            description = "Loại bỏ tất cả mục trong giỏ hàng của người dùng hiện tại"
    )
    @DeleteMapping("/clear")
    public ResponseEntity<Void> clearCart() throws Exception {

        Long userId = securityService.getUserFromRequest().getId();
        userFacadeService.clearCart(userId);
        return ResponseEntity.ok().build();
    }
}

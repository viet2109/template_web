package com.example.be.controllers;

import com.example.be.Utils;
import com.example.be.dto.user.WishlistDto;
import com.example.be.services.SecurityService;
import com.example.be.services.facade.UserFacadeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/wishlists")
@RequiredArgsConstructor
@PreAuthorize("hasRole('USER')")
@Tag(name = "Danh sách yêu thích", description = "Quản lý danh sách template yêu thích của người dùng")
public class WishlistController {

    private final UserFacadeService userFacadeService;
    private final SecurityService securityService;

    @Operation(
            summary = "Lấy danh sách yêu thích",
            description = "Trả về danh sách các template mà người dùng đã thêm vào yêu thích"
    )
    @GetMapping
    public ResponseEntity<Page<WishlistDto>> getWishlist(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt,desc") String[] sort
    ) {
        Pageable pageable = PageRequest.of(page, size, Utils.parseSort(sort));
        Page<WishlistDto> wishlist = userFacadeService.getWishlist(
                securityService.getUserFromRequest().getId(), pageable
        );
        return ResponseEntity.ok(wishlist);
    }

    @Operation(
            summary = "Thêm template vào yêu thích",
            description = "Người dùng có thể thêm một template cụ thể vào danh sách yêu thích"
    )
    @PostMapping
    public ResponseEntity<WishlistDto> addToWishlist(@RequestBody Long templateId) throws Exception {
        WishlistDto wishlistDto = userFacadeService.addToWishlist(
                securityService.getUserFromRequest().getId(), templateId
        );
        return ResponseEntity.ok(wishlistDto);
    }

    @Operation(
            summary = "Xoá template khỏi yêu thích",
            description = "Người dùng có thể xoá một template khỏi danh sách yêu thích của mình"
    )
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removeFromWishlist(@PathVariable Long id) throws Exception {
        userFacadeService.removeFromWishlist(
                securityService.getUserFromRequest().getId(), id
        );
        return ResponseEntity.ok().build();
    }
}

package com.example.be.controllers;

import com.example.be.Utils;
import com.example.be.dto.admin.AdminUserDto;
import com.example.be.enums.Role;
import com.example.be.enums.UserStatus;
import com.example.be.services.facade.AdminFacadeService;
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

import java.time.LocalDate;

@RestController
@RequestMapping("/admin/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(
        name = "Quản trị người dùng",
        description = "Các API quản lý người dùng (tìm kiếm, thay đổi trạng thái, xóa) dành cho ADMIN"
)
@SecurityRequirement(name = "bearerAuth")
public class AdminUserController {

    private final AdminFacadeService adminFacadeService;

    @Operation(
            summary = "Tìm kiếm và phân trang người dùng",
            description = "Lọc danh sách người dùng theo email, tên, vai trò, khoảng thời gian đăng ký"
    )
    @GetMapping
    public ResponseEntity<Page<AdminUserDto>> getUsers(
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Role role,
            @RequestParam(required = false) LocalDate createdFrom,
            @RequestParam(required = false) LocalDate createdTo,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt,desc") String[] sort) {

        Pageable pageable = PageRequest.of(page, size, Utils.parseSort(sort));
        Page<AdminUserDto> users = adminFacadeService
                .searchUsers(email, name, role, createdFrom, createdTo, pageable);
        return ResponseEntity.ok(users);
    }

    @Operation(
            summary = "Lấy chi tiết người dùng",
            description = "Trả về thông tin chi tiết của một người dùng theo ID"
    )
    @GetMapping("/{id}")
    public ResponseEntity<AdminUserDto> getUser(@PathVariable Long id) {
        AdminUserDto user = adminFacadeService.getUserDetail(id);
        return ResponseEntity.ok(user);
    }

    @Operation(
            summary = "Cập nhật trạng thái người dùng",
            description = "Thay đổi trạng thái (ACTIVE, INACTIVE, BLOCKED, …) của người dùng"
    )
    @PutMapping("/{id}/status")
    public ResponseEntity<AdminUserDto> updateUserStatus(
            @PathVariable Long id,
            @Valid @RequestBody UserStatus status) {

        AdminUserDto user = adminFacadeService.updateUserStatus(id, status);
        return ResponseEntity.ok(user);
    }

    @Operation(
            summary = "Xóa người dùng",
            description = "Xóa hoàn toàn tài khoản người dùng theo ID"
    )
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        adminFacadeService.deleteUser(id);
        return ResponseEntity.ok().build();
    }
}

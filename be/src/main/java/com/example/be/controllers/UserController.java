package com.example.be.controllers;

import com.example.be.dto.user.ChangePasswordDto;
import com.example.be.dto.user.UserProfileDto;
import com.example.be.dto.user.UserUpdateProfileDto;
import com.example.be.services.facade.UserFacadeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/users/{id}")
@RequiredArgsConstructor
@PreAuthorize("hasRole('USER')")
@Tag(name = "Người dùng", description = "Quản lý tài khoản người dùng")
public class UserController {

    private final UserFacadeService userFacadeService;

    @Operation(
            summary = "Lấy thông tin hồ sơ người dùng",
            description = "Trả về thông tin hồ sơ chi tiết của người dùng theo ID"
    )
    @GetMapping("/profile")
    public ResponseEntity<UserProfileDto> getProfile(@PathVariable Long id) throws Exception {
        UserProfileDto profile = userFacadeService.getUserProfile(id);
        return ResponseEntity.ok(profile);
    }

    @Operation(
            summary = "Cập nhật hồ sơ người dùng",
            description = "Cập nhật tên, giới tính, số điện thoại,... của người dùng"
    )
    @PutMapping("/profile")
    public ResponseEntity<UserProfileDto> updateProfile(
            @Valid @RequestBody UserUpdateProfileDto request,
            @PathVariable Long id) throws Exception {
        UserProfileDto profile = userFacadeService.updateProfile(id, request);
        return ResponseEntity.ok(profile);
    }

    @Operation(
            summary = "Cập nhật ảnh đại diện",
            description = "Tải lên ảnh đại diện mới cho người dùng"
    )
    @PostMapping("/avatar")
    public ResponseEntity<UserProfileDto> uploadAvatar(
            @RequestParam("file") MultipartFile file,
            @PathVariable Long id) throws Exception {
        UserProfileDto profile = userFacadeService.updateAvatar(id, file);
        return ResponseEntity.ok(profile);
    }

    @Operation(
            summary = "Đổi mật khẩu",
            description = "Thực hiện đổi mật khẩu nếu người dùng cung cấp mật khẩu hiện tại hợp lệ"
    )
    @PutMapping("/change-password")
    public ResponseEntity<Void> changePassword(
            @Valid @RequestBody ChangePasswordDto request,
            @PathVariable Long id) throws Exception {
        userFacadeService.changePassword(id, request);
        return ResponseEntity.ok().build();
    }
}

package com.example.be.controller;

import com.example.be.dto.user.*;
import com.example.be.services.facade.PublicFacadeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(
        name = "Xác thực người dùng",
        description = "Các API đăng ký, đăng nhập và quản lý mật khẩu/đăng ký email"
)
public class AuthController {
    private final PublicFacadeService publicFacadeService;

    @Operation(
            summary = "Đăng ký người dùng mới",
            description = "Tạo tài khoản mới với email, password, họ tên, v.v. Trả về profile người dùng vừa tạo."
    )
    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<UserProfileDto> register(
            @Valid @RequestBody UserRegisterDto request) throws Exception {
        UserProfileDto user = publicFacadeService.register(request);
        return ResponseEntity.ok(user);
    }

    @Operation(
            summary = "Đăng nhập (email/password)",
            description = "Xác thực bằng email & password, trả về JWT token."
    )
    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> login(
            @Valid @RequestBody UserLoginDto request) {
        AuthenticationResponse response = publicFacadeService.login(request);
        return ResponseEntity.ok(response);
    }

    @Operation(
            summary = "Đăng nhập bằng Google",
            description = "Xác thực qua OAuth2 Google, cần token Google."
    )
    @PostMapping("/login/google")
    public ResponseEntity<AuthenticationResponse> loginWithGoogle(
            @Valid @RequestBody GoogleUserInfo request) {
        AuthenticationResponse response = publicFacadeService.login(request);
        return ResponseEntity.ok(response);
    }

    @Operation(
            summary = "Đăng nhập bằng Facebook",
            description = "Xác thực qua OAuth2 Facebook, cần token Facebook."
    )
    @PostMapping("/login/facebook")
    public ResponseEntity<AuthenticationResponse> loginWithFacebook(
            @Valid @RequestBody FacebookUserInfo request) {
        AuthenticationResponse response = publicFacadeService.login(request);
        return ResponseEntity.ok(response);
    }

    @Operation(
            summary = "Quên mật khẩu",
            description = "Gửi email chứa link reset mật khẩu tới địa chỉ email đã đăng ký."
    )
    @PostMapping("/forgot-password")
    public ResponseEntity<Void> forgotPassword(
            @Valid @RequestBody String email) throws Exception {
        publicFacadeService.forgotPassword(email);
        return ResponseEntity.ok().build();
    }

    @Operation(
            summary = "Reset mật khẩu",
            description = "Thiết lập mật khẩu mới dựa trên token nhận được qua email."
    )
    @PostMapping("/reset-password")
    public ResponseEntity<Void> resetPassword(
            @Valid @RequestBody String newPassword,
            @RequestParam String token) throws Exception {
        publicFacadeService.resetPassword(token, newPassword);
        return ResponseEntity.ok().build();
    }

    @Operation(
            summary = "Xác thực email",
            description = "Xác nhận tài khoản thông qua token gửi qua email."
    )
    @PostMapping("/verify-email")
    public ResponseEntity<Void> verifyEmail(
            @RequestParam String token) throws Exception {
        publicFacadeService.verifyEmail(token);
        return ResponseEntity.ok().build();
    }
}

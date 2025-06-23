package com.example.be.controllers;

import com.example.be.dto.user.*;
import com.example.be.services.GoogleAuthService;
import com.example.be.services.facade.PublicFacadeService;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(
        name = "Xác thực người dùng",
        description = "Các API đăng ký, đăng nhập và quản lý mật khẩu/đăng ký email"
)
public class AuthController {
    private final PublicFacadeService publicFacadeService;
    private final GoogleAuthService googleAuthService;
    @Value("${app.google.client-id}")
    private String CLIENT_ID;

    @Value("${app.google.client-secret}")
    private String CLIENT_SECRET;

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
            @RequestBody Map<String, String> request) {
        try {
            String code = request.get("code");
            String redirectUri = request.get("redirect_uri");

            // Validate required parameters
            if (code == null || code.isEmpty()) {
                return ResponseEntity.badRequest().body(null);
            }
            if (redirectUri == null || redirectUri.isEmpty()) {
                return ResponseEntity.badRequest().body(null);
            }

            RestTemplate restTemplate = new RestTemplate();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
            params.add("client_id", CLIENT_ID);
            params.add("client_secret", CLIENT_SECRET);
            params.add("code", code);
            params.add("grant_type", "authorization_code");
            params.add("redirect_uri", redirectUri);

            HttpEntity<MultiValueMap<String, String>> requestEntity = new HttpEntity<>(params, headers);

            // Gọi Google OAuth2 API
            ResponseEntity<Map> response = restTemplate.postForEntity(
                    "https://oauth2.googleapis.com/token",
                    requestEntity,
                    Map.class
            );

            if (response.getBody() == null) {
                return ResponseEntity.badRequest().build();
            }

            Map tokenData = response.getBody();
            String idToken = (String) tokenData.get("id_token");

            if (idToken != null) {
                // Verify ID token
                GoogleIdToken.Payload payload = googleAuthService.verify(idToken);
                if (payload != null) {
                    String email = payload.getEmail();
                    String givenName = (String) payload.get("given_name");
                    String familyName = (String) payload.get("family_name");
                    String picture = (String) payload.get("picture");
                    String sub = (String) payload.get("sub");
                    Boolean emailVerified = (Boolean) payload.get("email_verified");

                    GoogleUserInfo userInfo = GoogleUserInfo.builder()
                            .emailVerified(emailVerified != null ? emailVerified : false)
                            .email(email)
                            .givenName(givenName)
                            .familyName(familyName)
                            .sub(sub)
                            .picture(picture)
                            .build();

                    AuthenticationResponse authenticationResponse = publicFacadeService.login(userInfo);
                    return ResponseEntity.ok(authenticationResponse);
                } else {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
                }
            }
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            // Log the error for debugging
            System.err.println("Google login error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
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

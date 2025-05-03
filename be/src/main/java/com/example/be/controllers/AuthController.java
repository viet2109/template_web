package com.example.be.controllers;

import com.example.be.dto.request.UserLoginRequestDto;
import com.example.be.dto.request.UserSignUpRequest;
import com.example.be.dto.response.UserLoginResponseDto;
import com.example.be.services.AuthService;
import com.example.be.services.EmailService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;
    private final EmailService emailService;


    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody @Valid UserLoginRequestDto userLoginRequestDto) {
        return ResponseEntity.ok(authService.login(userLoginRequestDto));
    }

    @PostMapping("/signup")
    public ResponseEntity<UserLoginResponseDto.UserInfo> signup(
            @RequestBody @Valid UserSignUpRequest userSignUpRequest) {
        UserLoginResponseDto.UserInfo user = authService.signUp(userSignUpRequest);
        String verificationUrl = "http://localhost:8080/auth/verify?token="
                + authService.createVerificationToken(user.getId());
        emailService.sendSimpleMessage(userSignUpRequest.getEmail(), "Verify account",
                "Please click the link to verify your account: " + verificationUrl);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(user.getId())
                .toUri();
        return ResponseEntity.created(location).body(user);
    }

    @GetMapping("/verify")
    public ResponseEntity<?> verifyEmailToken(
            @RequestParam String token) {
        authService.verifyEmail(token);
        return ResponseEntity.noContent().build();
    }
}

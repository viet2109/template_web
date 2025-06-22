//package com.example.be.controllers;
//
//import lombok.RequiredArgsConstructor;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//@RestController
//@RequiredArgsConstructor
//@RequestMapping("/auth")
//public class AuthController {
//
////    private final AuthService authService;
////    private final UserService userService;
////    private final EmailService emailService;
////
////    @PostMapping("/login")
////    public ResponseEntity<?> login(
////            @RequestBody @Valid UserLoginDto userLoginRequestDto) {
////        return ResponseEntity.ok(authService.login(userLoginRequestDto));
////    }
////
////    @PostMapping("/signup")
////    public ResponseEntity<UserProfileDto> signup(
////            @RequestBody @Valid UserRegisterDto userSignUpRequest) {
////        Map<String, Object> result = userService.createUser(userSignUpRequest);
////        UserProfileDto user = (UserProfileDto) result.get("user");
////        String token = result.get("token").toString();
////        String verificationUrl = "http://localhost:8080/auth/verify?token="
////                + token;
////        emailService.sendSimpleMessage(userSignUpRequest.getEmail(), "Verify account",
////                "Please click the link to verify your account: " + verificationUrl);
////        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
////                .path("/{id}")
////                .buildAndExpand(user.getId())
////                .toUri();
////        return ResponseEntity.created(location).body(user);
////    }
////
////    @GetMapping("/verify")
////    public ResponseEntity<?> verifyEmailToken(
////            @RequestParam String token) {
////        authService.verifyEmail(token);
////        return ResponseEntity.noContent().build();
////    }
//}

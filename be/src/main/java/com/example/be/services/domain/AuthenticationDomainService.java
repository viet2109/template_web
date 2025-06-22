package com.example.be.services.domain;

import com.example.be.dao.UserDao;
import com.example.be.dao.VerificationEmailTokenDao;
import com.example.be.dto.user.*;
import com.example.be.entities.User;
import com.example.be.entities.VerificationEmailToken;
import com.example.be.enums.AuthProvider;
import com.example.be.enums.Role;
import com.example.be.enums.UserStatus;
import com.example.be.mappers.UserMapper;
import com.example.be.services.EmailService;
import com.example.be.services.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class AuthenticationDomainService {
    private final UserDao userDao;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserMapper userMapper;
    private final VerificationEmailTokenDao verificationEmailTokenDao;
    private final EmailService emailService;

    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    /**
     * Xác thực người dùng và tạo tokens
     *
     * @param loginDto thông tin đăng nhập
     * @return thông tin xác thực và tokens
     */
    public AuthenticationResponse authenticate(UserLoginDto loginDto) {
        log.info("Attempting authentication for email: {}", loginDto.getEmail());

        // Lấy thông tin user
        User user = userDao.findByEmailAndStatus(loginDto.getEmail(), UserStatus.ACTIVE)
                .orElseThrow(() -> new BadCredentialsException("Invalid credentials"));

        if (!passwordEncoder.matches(loginDto.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Invalid password");
        }
        // Tạo tokens
        String accessToken = jwtTokenProvider.generateToken(user.getEmail());

        log.info("Authentication successful for user: {}", user.getEmail());

        return AuthenticationResponse.builder()
                .accessToken(accessToken)
                .user(userMapper.entityToDto(user))
                .build();
    }

    /**
     * Tạo user mới từ Google OAuth
     */
    public AuthenticationResponse loginGoogleUser(GoogleUserInfo googleUserInfo) {
        AuthenticationResponse authenticationResponse = AuthenticationResponse.builder().build();
        // Check if email exists with different provider
        userDao.findByEmail(googleUserInfo.getEmail()).ifPresentOrElse(user -> {
            String accessToken = jwtTokenProvider.generateToken(user.getEmail());
            authenticationResponse.setAccessToken(accessToken);
            authenticationResponse.setUser(userMapper.entityToDto(user));
        }, () -> {
            User user = User.builder()
                    .email(googleUserInfo.getEmail().toLowerCase().trim())
                    .password(null) // No password for OAuth users
                    .firstName(googleUserInfo.getGivenName())
                    .lastName(googleUserInfo.getFamilyName())
                    .status(UserStatus.ACTIVE) // Google users are active immediately
                    .roles(Set.of(Role.USER))
                    .provider(AuthProvider.GOOGLE)
                    .providerId(googleUserInfo.getSub()) // Google user ID
                    .providerAvatarUrl(googleUserInfo.getPicture())
                    .build();
            User savedUser = userDao.save(user);
            String accessToken = jwtTokenProvider.generateToken(savedUser.getEmail());
            authenticationResponse.setAccessToken(accessToken);
            authenticationResponse.setUser(userMapper.entityToDto(savedUser));
        });

        return authenticationResponse;
    }

    /**
     * Tạo user mới từ Facebook OAuth
     */
    public AuthenticationResponse loginFacebookUser(FacebookUserInfo facebookUserInfo) {

        AuthenticationResponse authenticationResponse = AuthenticationResponse.builder().build();
        // Check if email exists with different provider
        userDao.findByEmail(facebookUserInfo.getEmail()).ifPresentOrElse(user -> {
            String accessToken = jwtTokenProvider.generateToken(user.getEmail());
            authenticationResponse.setAccessToken(accessToken);
            authenticationResponse.setUser(userMapper.entityToDto(user));
        }, () -> {
            User user = User.builder()
                    .email(facebookUserInfo.getEmail().toLowerCase().trim())
                    .password(null) // No password for OAuth users
                    .firstName(facebookUserInfo.getFirstName())
                    .lastName(facebookUserInfo.getLastName())
                    .status(UserStatus.ACTIVE) // Facebook users are active immediately
                    .roles(Set.of(Role.USER))
                    .provider(AuthProvider.FACEBOOK)
                    .providerId(facebookUserInfo.getId()) // Facebook user ID
                    .providerAvatarUrl(facebookUserInfo.getPicture())
                    .build();
            User savedUser = userDao.save(user);
            String accessToken = jwtTokenProvider.generateToken(savedUser.getEmail());
            authenticationResponse.setAccessToken(accessToken);
            authenticationResponse.setUser(userMapper.entityToDto(savedUser));
        });

        return authenticationResponse;
    }

    /**
     * Generic method để tạo OAuth user
     */
//    public User createOAuthUser(OAuthUserInfo oauthInfo, AuthProvider provider) throws Exception {
//        log.info("Creating new {} user with email: {}", provider, oauthInfo.getEmail());
//
//
//
//        // Create user entity for OAuth
//        User user = User.builder()
//                .email(oauthInfo.getEmail().toLowerCase().trim())
//                .password(null) // No password for OAuth users
//                .firstName(oauthInfo.getFirstName())
//                .lastName(oauthInfo.getLastName())
//                .status(UserStatus.ACTIVE) // OAuth users are active immediately
//                .roles(Set.of(Role.USER))
//                .provider(provider)
//                .providerId(oauthInfo.getProviderId())
//                .providerAvatarUrl(oauthInfo.getAvatarUrl())
//                .build();
//
//        User savedUser = userDao.save(user);
//        log.info("{} user created successfully with ID: {}", provider, savedUser.getId());
//        return savedUser;
//    }

    /**
     * Đăng xuất - thu hồi token
     *
     * @param token access token hoặc refresh token
     */
    public void logout(String token) {
        log.debug("Logging out user with token");

        if (token != null && !token.isEmpty()) {
            log.info("User logged out successfully");
        }
    }

    /**
     * Xác thực email bằng token
     *
     * @param token verification token
     */
    public void verifyEmail(String token) throws Exception {
        log.info("Verifying email with token: {}", token);

        VerificationEmailToken verificationToken = verificationEmailTokenDao.findByToken(token)
                .orElseThrow(() -> new Exception("Invalid verification token"));

        // Kiểm tra token hết hạn
        if (verificationToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            verificationEmailTokenDao.delete(verificationToken);
            throw new Exception("Verification token has expired");
        }

        User user = verificationToken.getUser();

        // Kích hoạt user nếu đang inactive
        if (user.getStatus() == UserStatus.PENDING) {
            user.setStatus(UserStatus.ACTIVE);
            userDao.save(user);
            log.info("User activated successfully: {}", user.getEmail());
        }

        // Xóa token đã sử dụng
        verificationEmailTokenDao.deleteAllByUser(user);

        log.info("Email verified successfully for user: {}", user.getEmail());
    }

    /**
     * Gửi email reset mật khẩu
     *
     * @param email email của user
     */
    public void resetPassword(String email) throws Exception {
        log.info("Password reset requested for email: {}", email);

        // Tìm user theo email
        User user = userDao.findByEmail(email)
                .orElseThrow(() -> new Exception("Email không tồn tại trong hệ thống"));

        // Kiểm tra trạng thái user
        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new Exception("Tài khoản không ở trạng thái hoạt động");
        }

        // Xóa token reset cũ nếu có
        verificationEmailTokenDao.deleteAllByUser(user);

        // Tạo token reset mới
        String token = UUID.randomUUID().toString();

        VerificationEmailToken resetToken = VerificationEmailToken.builder()
                .token(token)
                .user(user)
                .build();

        verificationEmailTokenDao.save(resetToken);

        // Tạo reset URL
        String resetUrl = frontendUrl + "/reset-password?token=" + token;

        // Gửi email
        try {
            emailService.sendSimpleMessage(user.getEmail(), "Reset password", resetUrl);
            log.info("Password reset email sent successfully to: {}", email);
        } catch (Exception e) {
            log.error("Failed to send password reset email to: {}", email, e);
            throw new Exception("Không thể gửi email reset mật khẩu");
        }
    }

    /**
     * Confirm reset mật khẩu với token và mật khẩu mới
     *
     * @param token       reset token
     * @param newPassword mật khẩu mới
     */
    public void confirmPasswordReset(String token, String newPassword) throws Exception {
        log.info("Attempting to confirm password reset");

        // Tìm reset token
        VerificationEmailToken resetToken = verificationEmailTokenDao.findByToken(token)
                .orElseThrow(() -> new Exception("Token reset mật khẩu không hợp lệ"));

        // Kiểm tra token có hết hạn không
        if (resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            verificationEmailTokenDao.delete(resetToken);
            throw new Exception("Token reset mật khẩu đã hết hạn");
        }

        // Cập nhật mật khẩu
        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userDao.save(user);

        // Xóa token đã sử dụng
        verificationEmailTokenDao.deleteAllByUser(user);

        log.info("Password reset successfully for user: {}", user.getEmail());
    }

}
package com.example.be.services.domain;

import com.example.be.dao.UserDao;
import com.example.be.dao.VerificationEmailTokenDao;
import com.example.be.dto.common.EmailNotificationDto;
import com.example.be.dto.user.*;
import com.example.be.entities.File;
import com.example.be.entities.User;
import com.example.be.entities.VerificationEmailToken;
import com.example.be.enums.AuthProvider;
import com.example.be.enums.Role;
import com.example.be.enums.UserStatus;
import com.example.be.services.FileService;
import com.example.be.specifications.UserSpecification;
import jakarta.validation.ValidationException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.Set;
import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class UserDomainService {
    private final UserDao userDao;
    private final FileService fileService;
    private final VerificationEmailTokenDao verificationTokenDao;
    private final PasswordEncoder passwordEncoder;
    private final NotificationDomainService notificationDomainService;

    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    /**
     * Tạo user mới với thông tin cơ bản
     */
    public User createUser(UserRegisterDto dto) throws Exception {
        log.info("Creating new user with email: {}", dto.getEmail());

        // Check if email already exists
        if (isEmailExists(dto.getEmail())) {
            throw new Exception("Email already exists: " + dto.getEmail());
        }

        // Create user entity
        User user = User.builder()
                .email(dto.getEmail().toLowerCase().trim())
                .password(passwordEncoder.encode(dto.getPassword()))
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .phone(dto.getPhone())
                .status(UserStatus.PENDING) // User needs to verify email first
                .roles(Set.of(Role.USER)) // Default role
                .provider(AuthProvider.LOCAL)
                .build();

        User savedUser = userDao.save(user);

        // Send verification email
        sendVerificationEmail(savedUser.getId());

        log.info("User created successfully with ID: {}", savedUser.getId());
        return savedUser;
    }

    /**
     * Cập nhật thông tin profile của user
     */
    public User updateProfile(Long userId, UserUpdateProfileDto dto) throws Exception {
        User user = findById(userId);
        if (dto.getFirstName() != null) user.setFirstName(dto.getFirstName());
        if (dto.getLastName() != null) user.setLastName(dto.getLastName());
        if (dto.getPhone() != null) user.setPhone(dto.getPhone());
        if (dto.getAvatar() != null && !dto.getAvatar().isEmpty()) {
            user.setAvatar(fileService.upload(dto.getAvatar()));
        }
        return userDao.save(user);
    }

    /**
     * Thay đổi mật khẩu
     */
    public void changePassword(Long userId, ChangePasswordDto dto) throws Exception {
        log.info("Changing password for user ID: {}", userId);

        User user = findById(userId);

        // Kiểm tra mật khẩu hiện tại
        if (!passwordEncoder.matches(dto.getCurrentPassword(), user.getPassword())) {
            throw new Exception("Current password is incorrect");
        }

        // Không cho phép dùng lại mật khẩu cũ
        if (passwordEncoder.matches(dto.getNewPassword(), user.getPassword())) {
            throw new Exception("New password must be different from current password");
        }

        // Cập nhật mật khẩu mới
        user.setPassword(passwordEncoder.encode(dto.getNewPassword()));
        userDao.save(user);

        log.info("Password changed successfully for user ID: {}", userId);
    }

    /**
     * Cập nhật avatar của user
     */
    public User updateUserAvatar(Long userId, MultipartFile file) throws Exception {
        if (!isImageFile(file.getContentType())) {
            throw new ValidationException("Avatar must be an image file");
        }
        User user = findById(userId);
        File avatar = fileService.upload(file);
        user.setAvatar(avatar);
        return userDao.save(user);
    }

    /**
     * Gửi email xác thực
     */
    public void sendVerificationEmail(Long userId) throws Exception {
        log.info("Sending verification email for user ID: {}", userId);

        User user = findById(userId);

        // Không gửi lại nếu user đã active
        if (user.getStatus() == UserStatus.ACTIVE) {
            throw new Exception("User is already verified");
        }

        // Xóa token cũ nếu có
        verificationTokenDao.deleteAllByUser(user);

        // Tạo token mới
        String token = UUID.randomUUID().toString();
        VerificationEmailToken verificationToken = VerificationEmailToken.builder()
                .token(token)
                .user(user)
                .build();

        verificationTokenDao.save(verificationToken);


        String subject = "Xác thực tài khoản trên YourApp";

        // Tạo link xác thực
        String verifyUrl = String.format("%s/auth/verify-email?token=%s", frontendUrl, token);

        // Xây dựng nội dung email (HTML) bằng StringBuilder
        StringBuilder sb = new StringBuilder();
        sb.append("<div style='font-family:Segoe UI,Arial,sans-serif; line-height:1.6; color:#333333; margin:0; padding:0; background-color:#f5f5f5;'>");
        sb.append("<div style='max-width:600px; margin:40px auto; background-color:#ffffff; border-radius:12px; box-shadow:0 4px 6px rgba(0,0,0,0.1); padding:32px;'>");
        sb.append("<h2 style='color:#2d3748; margin-bottom:24px; font-size:24px; font-weight:600;'>");
        sb.append("Chào ").append(user.getFirstName()).append(",");
        sb.append("</h2>");

        sb.append("<p style='margin-bottom:16px; font-size:16px; color:#4a5568;'>")
                .append("Cảm ơn bạn đã đăng ký tài khoản trên YourApp. Để bắt đầu sử dụng tài khoản của bạn, vui lòng xác thực địa chỉ email của bạn bằng cách nhấp vào nút bên dưới:")
                .append("</p>");

        sb.append("<div style='text-align:center;'>");
        sb.append("<a href='").append(verifyUrl).append("' ")
                .append("style='display:inline-block; padding:12px 24px; background-color:#3182ce; color:#ffffff !important; text-decoration:none; border-radius:6px; font-weight:500; margin:24px 0;'>")
                .append("Xác thực tài khoản")
                .append("</a>");
        sb.append("</div>");

        sb.append("<p style='margin-bottom:16px; font-size:16px; color:#4a5568;'>")
                .append("Nếu bạn không thể nhấp vào nút, vui lòng sao chép và dán liên kết sau vào trình duyệt của bạn:")
                .append("</p>");

        sb.append("<p style='word-break:break-all; font-size:14px; color:#718096;'>")
                .append(verifyUrl)
                .append("</p>");

        sb.append("<p style='margin-bottom:16px; font-size:16px; color:#4a5568;'>")
                .append("Vì lý do bảo mật, liên kết này sẽ hết hạn sau 24 giờ. Nếu bạn không đăng ký tài khoản này, vui lòng bỏ qua email này.")
                .append("</p>");

        sb.append("<div style='margin-top:32px; padding-top:24px; border-top:1px solid #e2e8f0; font-size:14px; color:#718096;'>");
        sb.append("<p style='margin-bottom:16px;'>")
                .append("Trân trọng,<br>Đội ngũ YourApp")
                .append("</p>");

        sb.append("<div style='text-align:center; margin-top:24px;'>");
        sb.append("<a href='https://facebook.com/yourapp' style='display:inline-block; margin:0 8px; color:#4a5568; text-decoration:none;'>Facebook</a>");
        sb.append("<a href='https://twitter.com/yourapp' style='display:inline-block; margin:0 8px; color:#4a5568; text-decoration:none;'>Twitter</a>");
        sb.append("<a href='https://linkedin.com/company/yourapp' style='display:inline-block; margin:0 8px; color:#4a5568; text-decoration:none;'>LinkedIn</a>");
        sb.append("</div>");
        sb.append("</div>");
        sb.append("</div>");
        sb.append("</div>");

        String body = sb.toString();

        EmailNotificationDto emailDto = EmailNotificationDto.builder()
                .to(user.getEmail())
                .subject(subject)
                .body(body)
                .html(true)
                .build();

        notificationDomainService.sendEmailNotification(emailDto);
        log.info("Verification email sent to: {}", user.getEmail());
    }

    /**
     * Cập nhật trạng thái user
     */
    public void updateUserStatus(Long userId, UserStatus status) throws Exception {
        log.info("Update status user ID: {}", userId);

        User user = findById(userId);

        switch (status) {
            case ACTIVE:
                user.setStatus(UserStatus.ACTIVE);
                break;
            case DISABLED:
                user.setStatus(UserStatus.DISABLED);
                break;
            case SUSPENDED:
                user.setStatus(UserStatus.SUSPENDED);
                break;
            case DELETED:
                user.setStatus(UserStatus.DELETED);
                break;
            default:
                throw new Exception("Invalid user status");
        }

        userDao.save(user);

        log.info("User status updated successfully: {}", user.getEmail());
    }

    /**
     * Tìm user theo email
     */
    @Transactional(readOnly = true)
    public User findByEmail(String email) throws Exception {
        return userDao.findByEmail(email.toLowerCase().trim())
                .orElseThrow(() -> new Exception("User not found with email: " + email));
    }

    /**
     * Tìm user theo ID
     */
    @Transactional(readOnly = true)
    public User findById(Long userId) throws Exception {
        return userDao.findById(userId)
                .orElseThrow(() -> new Exception("User not found with ID: " + userId));
    }

    /**
     * Tìm kiếm user theo criteria
     */
    @Transactional(readOnly = true)
    public Page<User> searchUsers(String email, String name, Role role, LocalDate createdFrom, LocalDate createdTo, Pageable pageable) {
        Specification<User> spec = Specification.where(null);
        if (email != null && !email.isEmpty()) {
            spec = spec.and(UserSpecification.emailContains(email));
        }

        if (name != null && !name.isEmpty()) {
            spec = spec.and(UserSpecification.nameContains(name));
        }

        if (role != null) {
            spec = spec.and(UserSpecification.hasRole(role));
        }

        if (createdFrom != null) {
            spec = spec.and(UserSpecification.createdAfter(createdFrom.atStartOfDay()));
        }

        if (createdTo != null) {
            spec = spec.and(UserSpecification.createdBefore(createdTo.atStartOfDay()));
        }

        return userDao.findAll(spec, pageable);
    }

    /**
     * Kiểm tra email đã tồn tại
     */
    @Transactional(readOnly = true)
    public boolean isEmailExists(String email) {
        return userDao.existsByEmail(email.toLowerCase().trim());
    }

    private boolean isImageFile(String fileType) {
        return fileType != null && fileType.startsWith("image/");
    }

    @Transactional
    public void deleteUser(Long userId) {
        userDao.deleteById(userId);
    }
}

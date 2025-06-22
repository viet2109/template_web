package com.example.be.services;

import com.example.be.dao.UserDao;
import com.example.be.dao.VerificationEmailTokenDao;
import com.example.be.dto.user.UserLoginDto;
import com.example.be.dto.user.UserProfileDto;
import com.example.be.entities.User;
import com.example.be.enums.AppError;
import com.example.be.exceptions.AppException;
import com.example.be.mappers.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserMapper userMapper;
    private final UserDao userDao;
    private final PasswordEncoder passwordEncoder;
    private final VerificationEmailTokenDao verificationEmailTokenDao;
    private final JwtTokenProvider jwtTokenProvider;

    public Map<String, Object> login(UserLoginDto userLoginRequestDto) {
        User user = userDao.findByEmail(userLoginRequestDto.getEmail()).orElseThrow(() -> new AppException(AppError.AUTH_INVALID_CREDENTIALS));
        if (!passwordEncoder.matches(userLoginRequestDto.getPassword(), user.getPassword())) {
            throw new AppException(AppError.AUTH_INVALID_CREDENTIALS);
        }
        UserProfileDto userInfo = userMapper.entityToDto(user);
        return Map.of("user", userInfo, "accessToken", jwtTokenProvider.generateToken(userInfo.getEmail()));
    }

    @Transactional
    public void verifyEmail(String token) {
        verificationEmailTokenDao.findByToken(token).ifPresentOrElse(verificationEmailToken -> {
            if (LocalDateTime.now().isAfter(verificationEmailToken.getExpiryDate())) {
                throw new AppException(AppError.TOKEN_EXPIRED);
            }
            User user = verificationEmailToken.getUser();
            userDao.save(user);
            verificationEmailTokenDao.deleteAllByUser(user);
        }, () -> {
            throw new AppException(AppError.TOKEN_NOT_FOUND);
        });
    }
}

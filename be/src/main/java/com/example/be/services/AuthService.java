package com.example.be.services;

import com.example.be.dao.UserDao;
import com.example.be.dao.VerificationEmailTokenDao;
import com.example.be.dto.request.UserLoginRequestDto;
import com.example.be.dto.request.UserSignUpRequest;
import com.example.be.dto.response.UserLoginResponseDto;
import com.example.be.entities.User;
import com.example.be.entities.VerificationEmailToken;
import com.example.be.enums.AppError;
import com.example.be.enums.UserStatus;
import com.example.be.exceptions.AppException;
import com.example.be.mappers.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserMapper userMapper;
    private final UserDao userDao;
    private final PasswordEncoder passwordEncoder;
    private final VerificationEmailTokenDao verificationEmailTokenDao;
    private final JwtTokenProvider jwtTokenProvider;

    public UserLoginResponseDto login(UserLoginRequestDto userLoginRequestDto) {
        User user = userDao.findByEmail(userLoginRequestDto.getEmail()).orElseThrow(() -> new AppException(AppError.AUTH_INVALID_CREDENTIALS));
        if (!passwordEncoder.matches(userLoginRequestDto.getPassword(), user.getPassword()) || user.getStatus() != UserStatus.ACTIVE) {
            throw new AppException(AppError.AUTH_INVALID_CREDENTIALS);
        }
        UserLoginResponseDto.UserInfo userInfo = userMapper.entityToDto(user);
        return UserLoginResponseDto.builder().user(userInfo).accessToken(jwtTokenProvider.generateToken(userInfo.getEmail())).build();
    }

    @Transactional
    public UserLoginResponseDto.UserInfo signUp(UserSignUpRequest dto) {
        User existUser = userDao.findByEmail(dto.getEmail()).orElse(null);
        if (existUser != null && existUser.getStatus() != UserStatus.INACTIVE) {
            throw new AppException(AppError.USER_EMAIL_ALREADY_EXISTS);
        } else if (existUser != null) {
            return userMapper.entityToDto(existUser);
        }
        dto.setPassword(passwordEncoder.encode(dto.getPassword()));
        User user = userMapper.dtoToEntity(dto);
        return userMapper.entityToDto(userDao.save(user));
    }

    @Transactional
    public String createVerificationToken(Long userId) {
        String token = UUID.randomUUID().toString();
        verificationEmailTokenDao.save(VerificationEmailToken.builder().token(token).user(userDao.findById(userId).orElseThrow(() -> new AppException(AppError.USER_NOT_FOUND))).build());
        return token;
    }

    @Transactional
    public void verifyEmail(String token) {
        verificationEmailTokenDao.findByToken(token).ifPresentOrElse(verificationEmailToken -> {
            if (LocalDateTime.now().isAfter(verificationEmailToken.getExpiryDate())) {
                throw new AppException(AppError.TOKEN_EXPIRED);
            }
            User user = verificationEmailToken.getUser();
            user.setStatus(UserStatus.ACTIVE);
            userDao.save(user);
            verificationEmailTokenDao.deleteAllByUser(user);
        }, () -> {
            throw new AppException(AppError.TOKEN_NOT_FOUND);
        });
    }
}

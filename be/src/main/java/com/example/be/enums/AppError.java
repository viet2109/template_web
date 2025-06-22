package com.example.be.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public enum AppError {
    // Authentication Errors
    AUTH_INVALID_CREDENTIALS("Invalid username or password", HttpStatus.UNAUTHORIZED),
    AUTH_TOKEN_EXPIRED("Authentication token has expired", HttpStatus.UNAUTHORIZED),
    AUTH_TOKEN_INVALID("Invalid authentication token", HttpStatus.UNAUTHORIZED),
    AUTH_ACCESS_DENIED("Access denied for the requested resource", HttpStatus.FORBIDDEN),

    // User Errors
    USER_NOT_FOUND("The requested user was not found", HttpStatus.NOT_FOUND),
    USER_NOT_ACTIVE("The requested user was not active", HttpStatus.BAD_REQUEST),
    USER_EMAIL_ALREADY_EXISTS("The email is already registered", HttpStatus.CONFLICT),
    USER_PHONE_ALREADY_EXISTS("The phone is already registered", HttpStatus.CONFLICT),
    USER_PROFILE_NOT_UPDATED("Failed to update user profile", HttpStatus.BAD_REQUEST),

    //VerificationEmailToken Errors
    TOKEN_NOT_FOUND("The token was not found", HttpStatus.NOT_FOUND),
    TOKEN_EXPIRED("Token has expired", HttpStatus.UNAUTHORIZED),

    FILE_NOT_FOUND("The file was not found", HttpStatus.NOT_FOUND),
    FILE_UPLOAD_FAILED("The file was upload failed", HttpStatus.INTERNAL_SERVER_ERROR),

    // General Errors
    INTERNAL_SERVER_ERROR("An unexpected error occurred on the server", HttpStatus.INTERNAL_SERVER_ERROR),
    BAD_REQUEST("The request could not be understood or was missing required parameters", HttpStatus.BAD_REQUEST),

    ORDER_NOT_FOUND("The requested order was not found", HttpStatus.NOT_FOUND),

    //Template Error
    TEMPLATE_NOT_FOUND("The requested template was not found", HttpStatus.NOT_FOUND);

    String message;
    HttpStatus httpStatus;
}


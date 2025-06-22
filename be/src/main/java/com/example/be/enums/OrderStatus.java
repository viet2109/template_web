package com.example.be.enums;

public enum OrderStatus {
    PENDING,       // Đã tạo đơn nhưng chưa xử lý
    PROCESSING,    // Đang xử lý
    COMPLETED,     // Hoàn thành
    CANCELLED,     // Người dùng hoặc hệ thống hủy
    REFUNDED       // Đã hoàn tiền
}

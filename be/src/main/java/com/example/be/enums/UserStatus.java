package com.example.be.enums;

public enum UserStatus {
    PENDING,    // chờ kích hoạt
    ACTIVE,     // đang hoạt động
    SUSPENDED,  // tạm khoá
    DISABLED,   // vô hiệu hoá
    DELETED,    // đã xoá (soft delete)
}

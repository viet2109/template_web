package com.example.be.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@PreAuthorize("hasRole('USER')")
public class NotificationController {
//
//    private final NotificationFacadeService notificationFacadeService;
//
//    @GetMapping
//    public ResponseEntity<ApiResponse<PagedResponse<NotificationDto>>> getNotifications(
//            @RequestParam(defaultValue = "0") int page,
//            @RequestParam(defaultValue = "20") int size,
//            @RequestParam(required = false) Boolean unreadOnly,
//            Authentication auth) {
//        String userEmail = auth.getName();
//        PagedResponse<NotificationDto> notifications = notificationFacadeService
//                .getUserNotifications(userEmail, page, size, unreadOnly);
//        return ResponseEntity.ok(ApiResponse.success("Notifications fetched successfully", notifications));
//    }
//
//    @PutMapping("/{id}/read")
//    public ResponseEntity<ApiResponse<String>> markAsRead(@PathVariable Long id, Authentication auth) {
//        String userEmail = auth.getName();
//        notificationFacadeService.markAsRead(userEmail, id);
//        return ResponseEntity.ok(ApiResponse.success("Notification marked as read", null));
//    }
//
//    @PutMapping("/read-all")
//    public ResponseEntity<ApiResponse<String>> markAllAsRead(Authentication auth) {
//        String userEmail = auth.getName();
//        notificationFacadeService.markAllAsRead(userEmail);
//        return ResponseEntity.ok(ApiResponse.success("All notifications marked as read", null));
//    }
//
//    @GetMapping("/unread-count")
//    public ResponseEntity<ApiResponse<Long>> getUnreadCount(Authentication auth) {
//        String userEmail = auth.getName();
//        Long count = notificationFacadeService.getUnreadCount(userEmail);
//        return ResponseEntity.ok(ApiResponse.success("Unread count fetched successfully", count));
//    }
}

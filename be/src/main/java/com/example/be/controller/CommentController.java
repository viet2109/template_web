package com.example.be.controller;

import com.example.be.dto.user.CommentDto;
import com.example.be.dto.user.CreateCommentDto;
import com.example.be.services.SecurityService;
import com.example.be.services.facade.UserFacadeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/comments")
@RequiredArgsConstructor
@PreAuthorize("hasRole('USER')")
@Tag(
        name = "Bình luận",
        description = "Các API tạo, sửa, xóa bình luận dành cho người dùng đã đăng nhập"
)
@SecurityRequirement(name = "bearerAuth")
public class CommentController {

    private final UserFacadeService userFacadeService;
    private final SecurityService securityService;

    @Operation(
            summary = "Tạo bình luận",
            description = "Tạo một bình luận mới cho template hoặc bài viết, yêu cầu nội dung trong request body"
    )
    @PostMapping
    public ResponseEntity<CommentDto> createComment(
            @Valid @RequestBody CreateCommentDto createCommentDto) throws Exception {

        Long userId = securityService.getUserFromRequest().getId();
        log.info(userId.toString());
        CommentDto comment = userFacadeService.createComment(userId, createCommentDto);
        return ResponseEntity.ok(comment);
    }

    @Operation(
            summary = "Cập nhật bình luận",
            description = "Chỉnh sửa nội dung bình luận theo ID, chỉ cho phép người tạo bình luận thực hiện"
    )
    @PutMapping("/{id}")
    public ResponseEntity<CommentDto> updateComment(
            @PathVariable Long id,
            @Valid @RequestBody String content) throws Exception {

        Long userId = securityService.getUserFromRequest().getId();
        CommentDto comment = userFacadeService.updateComment(userId, id, content);
        return ResponseEntity.ok(comment);
    }

    @Operation(
            summary = "Xóa bình luận",
            description = "Xóa bình luận theo ID, chỉ cho phép người tạo bình luận thực hiện"
    )
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long id) throws Exception {
        Long userId = securityService.getUserFromRequest().getId();
        userFacadeService.deleteComment(userId, id);
        return ResponseEntity.ok().build();
    }
}

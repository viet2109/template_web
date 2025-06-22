package com.example.be.services.domain;

import com.example.be.dao.CommentDao;
import com.example.be.dao.TemplateDao;
import com.example.be.dao.UserDao;
import com.example.be.dto.user.CreateCommentDto;
import com.example.be.entities.Comment;
import com.example.be.entities.Template;
import com.example.be.entities.User;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class CommentDomainService {

    private final CommentDao commentDao;
    private final TemplateDao templateDao;
    private final UserDao userDao;

    public Comment createComment(Long userId, CreateCommentDto dto) throws Exception {
        User user = userDao.findById(userId)
                .orElseThrow(() -> new Exception("User not found"));

        Template template = templateDao.findById(dto.getTemplateId())
                .orElseThrow(() -> new Exception("Template not found"));

        Comment parent = null;
        if (dto.getParentId() != null) {
            parent = commentDao.findById(dto.getParentId())
                    .orElseThrow(() -> new Exception("Parent comment not found"));
        }

        Comment comment = new Comment();
        comment.setUser(user);
        comment.setTemplate(template);
        comment.setContent(dto.getContent());
        comment.setParent(parent);

        Comment savedComment = commentDao.save(comment);

        // Update template stats
        template.setTotalComments(template.getTotalComments() + 1);
        templateDao.save(template);

        return savedComment;
    }

    @Transactional(readOnly = true)
    public Page<Comment> getTemplateComments(Long templateId, Pageable pageable) {
        return commentDao.findByTemplate_IdAndParentIsNull(templateId, pageable);
    }

    public void deleteComment(Long commentId) throws Exception {
        Comment comment = commentDao.findById(commentId).orElseThrow(() -> new Exception("Comment not found"));
        commentDao.delete(comment);
        Template template = comment.getTemplate();
        template.setTotalComments(template.getTotalComments() - 1);
        templateDao.save(template);
    }

    public Comment updateComment(Long commentId, String content) throws Exception {
        Comment comment = commentDao.findById(commentId).orElseThrow(() -> new Exception("Comment not found"));
        comment.setContent(content);
        return commentDao.save(comment);
    }
}
package com.example.be.dao;

import com.example.be.entities.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentDao extends CrudRepository<Comment, Long> {
    Page<Comment> findByTemplate_IdAndParentIsNull(Long templateId, Pageable pageable);
    List<Comment> findByTemplate_Id(Long templateId);
}

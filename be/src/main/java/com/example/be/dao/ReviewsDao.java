package com.example.be.dao;

import com.example.be.entities.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewsDao extends CrudRepository<Review, Long> {
    boolean existsByUser_IdAndTemplate_Id(Long userId, Long templateId);

    List<Review> findByTemplate_Id(Long templateId);

    Page<Review> findByUser_Id(Long userId, Pageable pageable);

    Page<Review> findByTemplate_Id(Long templateId, Pageable pageable);
}

package com.example.be.dao;

import com.example.be.entities.Wishlist;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WishlistDao extends CrudRepository<Wishlist, Long> {
    Page<Wishlist> findByUser_Id(Long userId, Pageable pageable);

    List<Wishlist> findByUser_Id(Long userId);

    boolean existsByUser_IdAndTemplate_Id(Long userId, Long templateId);
}


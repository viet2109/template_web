package com.example.be.dao;

import com.example.be.entities.CartItem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CartDao extends CrudRepository<CartItem, Long> {
    List<CartItem> findByUser_Id(Long userId);

    Page<CartItem> findByUser_Id(Long userId, Pageable pageable);

    boolean existsByUser_IdAndTemplate_Id(Long userId, Long templateId);
}

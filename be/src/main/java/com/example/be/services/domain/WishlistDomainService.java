package com.example.be.services.domain;

import com.example.be.dao.TemplateDao;
import com.example.be.dao.UserDao;
import com.example.be.dao.WishlistDao;
import com.example.be.entities.Template;
import com.example.be.entities.User;
import com.example.be.entities.Wishlist;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class WishlistDomainService {

    private final WishlistDao wishlistDao;
    private final TemplateDao templateDao;
    private final UserDao userDao;

    public Wishlist addToWishlist(Long userId, Long templateId) throws Exception {
        User user = userDao.findById(userId)
                .orElseThrow(() -> new Exception("User not found"));

        Template template = templateDao.findById(templateId)
                .orElseThrow(() -> new Exception("Template not found"));

        if (isInWishlist(userId, templateId)) {
            throw new Exception("Template is already in wishlist");
        }

        Wishlist wishlist = new Wishlist();
        wishlist.setUser(user);
        wishlist.setTemplate(template);

        return wishlistDao.save(wishlist);
    }

    public void removeFromWishlist(Long wishlistId) throws Exception {
        Wishlist wishlist = wishlistDao.findById(wishlistId)
                .orElseThrow(() -> new Exception("Wishlist item not found"));
        wishlistDao.delete(wishlist);
    }

    public Page<Wishlist> getUserWishlist(Long userId, Pageable pageable) {
        return wishlistDao.findByUser_Id(userId, pageable);
    }

    public void clearWishlist(Long userId) {
        List<Wishlist> wishlists = wishlistDao.findByUser_Id(userId);
        wishlistDao.deleteAll(wishlists);
    }

    public boolean isInWishlist(Long userId, Long templateId) {
        return wishlistDao.existsByUser_IdAndTemplate_Id(userId, templateId);
    }
}
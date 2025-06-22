package com.example.be.services.domain;

import com.example.be.dao.CartDao;
import com.example.be.dao.TemplateDao;
import com.example.be.dao.UserDao;
import com.example.be.entities.CartItem;
import com.example.be.entities.Template;
import com.example.be.entities.User;
import com.example.be.enums.TemplateStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CartDomainService {

    private final CartDao cartItemDao;
    private final TemplateDao templateDao;
    private final UserDao userDao;
    private final OrderDomainService orderDomainService;

    public CartItem addToCart(Long userId, Long templateId) throws Exception {
        User user = userDao.findById(userId)
                .orElseThrow(() -> new Exception("User not found"));

        Template template = templateDao.findById(templateId)
                .orElseThrow(() -> new Exception("Template not found"));

        if (template.getStatus() != TemplateStatus.APPROVED) {
            throw new Exception("Template is not available for purchase");
        }

        // Check if user already owns this template
        if (orderDomainService.hasUserPurchasedTemplate(userId, templateId)) {
            throw new Exception("You already own this template");
        }

        // Check if already in cart
        if (cartItemDao.existsByUser_IdAndTemplate_Id(userId, templateId)) {
            throw new Exception("Template is already in cart");
        }

        CartItem cartItem = CartItem.builder()
                .user(user)
                .template(template)
                .build();

        return cartItemDao.save(cartItem);
    }

    public void removeFromCart(Long userId, Long cartItemId) throws Exception {
        CartItem cartItem = cartItemDao.findById(cartItemId)
                .orElseThrow(() -> new Exception("Cart item not found"));

        if (!cartItem.getUser().getId().equals(userId)) {
            throw new Exception("Not authorized to remove this item");
        }

        cartItemDao.delete(cartItem);
    }

    public Page<CartItem> getUserCart(Long userId, Pageable pageable) {
        return cartItemDao.findByUser_Id(userId, pageable);
    }

    public void clearCart(Long userId) {
        List<CartItem> cartItems = cartItemDao.findByUser_Id(userId);
        cartItemDao.deleteAll(cartItems);
    }
}
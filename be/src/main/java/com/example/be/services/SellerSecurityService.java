package com.example.be.services;

import com.example.be.dao.SellerDao;
import com.example.be.dao.TemplateDao;
import com.example.be.entities.SellerProfile;
import com.example.be.entities.Template;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SellerSecurityService {
    private final SellerDao sellerDao;
    private final TemplateDao templateDao;

    public boolean isSellerOwner(Long sellerId, Long userId) {
        SellerProfile sellerProfile = sellerDao.findById(sellerId).orElse(null);
        if (sellerProfile == null) {
            return false;
        }
        return sellerProfile.getUser().getId().equals(userId);
    }

    public boolean isTemplateOwner(Long templateId, Long userId) {
        Template template = templateDao.findById(templateId).orElse(null);
        if (template == null) {
            return false;
        }
        return template.getSeller().getUser().getId().equals(userId);
    }
}

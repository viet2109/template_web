package com.example.be.dao;

import com.example.be.entities.User;
import com.example.be.entities.VerificationEmailToken;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VerificationEmailTokenDao extends CrudRepository<VerificationEmailToken, Long> {
    Optional<VerificationEmailToken> findByToken(String token);
    void deleteAllByUser(User user);
}

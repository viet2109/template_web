package com.example.be.dao;

import com.example.be.entities.Payout;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PayoutDao extends CrudRepository<Payout, Long> {
}

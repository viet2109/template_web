package com.example.be.dao;

import com.example.be.entities.SalesReport;
import com.example.be.entities.SellerProfile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SalesReportDao extends CrudRepository<SalesReport, Long> {
    List<SalesReport> findBySellerAndReportDateBetween(SellerProfile seller, LocalDateTime reportDateAfter, LocalDateTime reportDateBefore);

    Page<SalesReport> findBySellerOrderByReportDate(SellerProfile seller, Pageable pageable);

    @Query("""
      SELECT SUM(sr.netEarnings)
        FROM SalesReport sr
       WHERE sr.seller = :seller
    """)
    Double sumNetEarningsBySeller(@Param("seller") SellerProfile seller);
}

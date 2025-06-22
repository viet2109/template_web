package com.example.be.dao;

import com.example.be.dto.admin.CategorySalesDto;
import com.example.be.entities.SellerProfile;
import com.example.be.entities.Template;
import com.example.be.enums.Category;
import com.example.be.enums.TemplateStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TemplateDao extends CrudRepository<Template, Long>, JpaSpecificationExecutor<Template> {
    List<Template> findBySeller(SellerProfile seller);

    List<Template> findTopBySellerOrderByTotalSalesDesc(SellerProfile seller, Pageable pageable);

    @Query("SELECT t FROM Template t ORDER BY t.totalSales DESC")
    List<Template> findTopByTotalSales(Pageable pageable);

    @Query("""
                SELECT new com.example.be.dto.admin.CategorySalesDto(
                    t.category,
                    cast(SUM(t.totalSales) as integer) ,
                    cast(0 as double)
                )
                FROM Template t
                GROUP BY t.category
                ORDER BY SUM(t.totalSales) DESC
            """)
    List<CategorySalesDto> findTopCategorySales(Pageable pageable);



    List<Template> findByStatus(TemplateStatus status);

    Page<Template> findByStatus(TemplateStatus templateStatus, Pageable pageable);

    long countByStatus(TemplateStatus status);

    long countByCreatedAtAfterAndStatus(LocalDateTime createdAtAfter, TemplateStatus status);
}

package com.example.backend.repository;

import com.example.backend.models.Sale;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SaleRepository extends JpaRepository<Sale,Long> {
    List<Sale> findByCompany_id(Long company_id);
}

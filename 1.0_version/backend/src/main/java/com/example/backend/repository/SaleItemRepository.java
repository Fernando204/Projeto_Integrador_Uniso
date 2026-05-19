package com.example.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.models.SaleItem;

public interface SaleItemRepository extends JpaRepository<SaleItem,Long>{
    
}

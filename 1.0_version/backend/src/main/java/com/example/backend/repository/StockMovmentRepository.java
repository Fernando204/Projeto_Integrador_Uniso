package com.example.backend.repository;

import com.example.backend.models.StockMovment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StockMovmentRepository extends JpaRepository<StockMovment,Long> {
}

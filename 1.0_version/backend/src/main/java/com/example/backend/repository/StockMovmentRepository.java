package com.example.backend.repository;

import com.example.backend.models.StockMovement;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StockMovmentRepository extends JpaRepository<StockMovement,Long> {
}

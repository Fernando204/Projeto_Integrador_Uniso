package com.example.backend.repository;

import com.example.backend.models.CashRegister;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CashRegisterRepository extends JpaRepository<CashRegister,Long> {
}

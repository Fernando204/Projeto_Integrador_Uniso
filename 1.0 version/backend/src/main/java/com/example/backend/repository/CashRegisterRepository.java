package com.example.backend.repository;

import com.example.backend.models.CashRegister;
import com.example.backend.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CashRegisterRepository extends JpaRepository<CashRegister,Long> {
    List<CashRegister> findByUser(User user);
    boolean existsByUserAndOpenTrue(User user);
}

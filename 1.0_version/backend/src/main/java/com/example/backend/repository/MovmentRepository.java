package com.example.backend.repository;

import com.example.backend.models.Movment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MovmentRepository extends JpaRepository<Movment,Long> {
    List<Movment> findByCompany_id(Long company_id);
}

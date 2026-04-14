package com.example.backend.repository;

import com.example.backend.models.Movment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MovmentRepository extends JpaRepository<Movment,Long> {
}

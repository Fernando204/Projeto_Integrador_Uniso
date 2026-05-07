package com.example.backend.repository;

import com.example.backend.models.Collaborators;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface CollaboratorRepository extends JpaRepository<Collaborators, Long> {
    List<Collaborators> findBycompany_id(Long companyId);
}
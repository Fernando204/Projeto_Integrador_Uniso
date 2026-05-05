package com.example.backend.repository;

import com.example.backend.models.Collaborators;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CollaboratorRepository extends JpaRepository<Collaborators, Long> {
    List<Collaborators> findByCollaborators_id(Long collaborators_id);
}

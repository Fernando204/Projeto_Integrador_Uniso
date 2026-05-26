package com.example.backend.controllers;


import com.example.backend.repository.CollaboratorRepository;
import com.example.backend.repository.CompanyRepository;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/collaborator")
public class CollaboratorController {
    private CompanyRepository companyRepository;
    private CollaboratorRepository collaboratorRepository;

    public CollaboratorController(CompanyRepository companyRepository, CollaboratorRepository collaboratorRepository) {
        this.companyRepository = companyRepository;
        this.collaboratorRepository = collaboratorRepository;
    }

    @PostMapping("/add")
    public ResponseEntity<?> createCollaborator(){
        return  ResponseEntity.status(HttpStatus.OK).body("");
    }

    @GetMapping
    public  ResponseEntity<?> getCollaborators(){
        return ResponseEntity.ok("");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCollaborator(){
        return ResponseEntity.ok("");
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCollaborator(){
        return ResponseEntity.ok("");
    }





}

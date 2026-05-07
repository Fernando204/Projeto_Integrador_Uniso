package com.example.backend.controllers;

import com.example.backend.models.Collaborators;
import com.example.backend.models.Company;

import com.example.backend.repository.CollaboratorRepository;
import com.example.backend.repository.CompanyRepository;

import com.example.backend.services.Logger;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

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

}

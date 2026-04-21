package com.example.backend.controllers;

import com.example.backend.DTOs.RegisterMovmentDTO;
import com.example.backend.repository.CompanyRepository;
import com.example.backend.repository.MovmentRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/finance")
public class FinanceController {
    private UserRepository userRepository;
    private CompanyRepository companyRepository;
    private MovmentRepository movmentRepository;

    public FinanceController(
            UserRepository userRepository,
            CompanyRepository companyRepository,
            MovmentRepository movmentRepository
    ){
        this.userRepository = userRepository;
        this.companyRepository = companyRepository;
        this.movmentRepository = movmentRepository;
    }

    @PostMapping("/movment/new")
    public ResponseEntity<?> newMovment(@RequestBody RegisterMovmentDTO dto){

        return ResponseEntity.ok("");
    }

    @GetMapping("/movment/get")
    public ResponseEntity<?> getMovments(@RequestParam Long companyId){

        return ResponseEntity.ok("");
    }
}

package com.example.backend.controllers;

import com.example.backend.DTOs.RegisterMovmentDTO;
import com.example.backend.enums.MovmentType;
import com.example.backend.repository.CompanyRepository;
import com.example.backend.repository.MovmentRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.models.Company;
import com.example.backend.models.User;
import com.example.backend.models.Movment;

import com.example.backend.services.Logger;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

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
        Company company = companyRepository.findById(dto.companyId()).orElse(null);
        User user = userRepository.findById(dto.userId()).orElse(null);

        if(company == null || user == null){
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message","usuário ou empresa invalidos!"));
        }

        Movment movment = movmentRepository.save(new Movment(
            dto.name(),
            dto.description(),
            dto.value(),
            dto.movmentDate(),
            user,
            company,
            dto.movmentType()
        ));

        BigDecimal balance = company.getBalance();
        balance = movment.getMovmentType() == MovmentType.SAIDA ? balance.subtract(movment.getValue()) : balance.add(movment.getValue());
        company.setBalance(balance);

        companyRepository.save(company);
        return ResponseEntity.ok(movment);
    }

    @GetMapping("/movment/get")
    public ResponseEntity<?> getMovments(@RequestParam Long id){
        Logger.warn("Buscando movimentos");
        List<Movment> movments = movmentRepository.findByCompany_id(id);
        return ResponseEntity.ok(movments);
    }
}

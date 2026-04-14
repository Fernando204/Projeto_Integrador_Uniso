package com.example.backend.controllers;

import com.example.backend.DTOs.CashRegisterDTO;
import com.example.backend.DTOs.InitCashRegisterDTO;
import com.example.backend.models.CashRegister;
import com.example.backend.models.Company;
import com.example.backend.models.User;
import com.example.backend.repository.CashRegisterRepository;
import com.example.backend.repository.CompanyRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/sales")
public class SalesController {
    private CashRegisterRepository cashRegisterRepository;
    private CompanyRepository companyRepository;
    private UserRepository userRepository;

    public SalesController(
            CashRegisterRepository cashRegisterRepository,
            UserRepository userRepository,
            CompanyRepository companyRepository
    ){
        this.userRepository = userRepository;
        this.companyRepository = companyRepository;
        this.cashRegisterRepository = cashRegisterRepository;
    }

    @PostMapping("/cash-register/init")
    public ResponseEntity<Object> initCashRegister(@RequestBody InitCashRegisterDTO dto){
        User user = userRepository.findById(dto.userId())
                .orElse(null);

        Company company = companyRepository.findById(dto.companyId())
                .orElse(null);

        if (user == null || company == null) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "usuário ou empresa não cadastrada"));
        }

        boolean hasOpenCashRegister =
                cashRegisterRepository.existsByUserAndOpenTrue(user);
        if(hasOpenCashRegister){
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message","usuário já tem um caixa aberto"));
        }
        CashRegister cashRegister = cashRegisterRepository.save(new CashRegister(
                company,
                user
        ));

        CashRegisterDTO response = new CashRegisterDTO(
                cashRegister.getId(),
                cashRegister.getOpenTime(),
                null,
                cashRegister.isOpen(),
                null
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}

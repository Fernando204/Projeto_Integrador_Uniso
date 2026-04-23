package com.example.backend.controllers;

import com.example.backend.DTOs.CashRegisterDTO;
import com.example.backend.DTOs.InitCashRegisterDTO;
import com.example.backend.models.CashRegister;
import com.example.backend.models.Company;
import com.example.backend.models.User;
import com.example.backend.repository.UserRepository;
import com.example.backend.repository.CashRegisterRepository;
import com.example.backend.repository.CompanyRepository;
import com.example.backend.services.Logger;
import org.apache.juli.logging.Log;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
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

    @GetMapping("/cash-register/get")
    public ResponseEntity<?> getCashRegister(@RequestParam Long id) {
        Logger.warn("verificando se há caixa aberto");

        CashRegister cashRegister = cashRegisterRepository.findByUserIdAndOpenTrue(id).orElse(null);

        if (cashRegister == null) {
            Logger.warn("caixa não encontrado");
            // Verifica se o usuário existe apenas se necessário
            boolean userExists = userRepository.existsById(id);
            if (!userExists) {
                Logger.warn("usuário não existe");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("message", "Usuário inexistente!"));
            }
            Logger.warn("Caixa não aberto");
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Nenhum caixa aberto"));
        }

        CashRegisterDTO response = new CashRegisterDTO(
                cashRegister.getId(),
                cashRegister.getOpenTime(),
                null,
                cashRegister.isOpen(),
                null
        );
        Logger.success("Caixa encontrado");
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/cash-register/{id}/close")
    public ResponseEntity<?> closeCashRegister(@PathVariable Long id){
        CashRegister cashRegister = cashRegisterRepository.findById(id).orElse(null);
        if(cashRegister == null || !cashRegister.isOpen()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message","Caixa não encontrado ou já fechado!"));
        }

        cashRegister.setOpen(false);
        cashRegister.setCloseTime(LocalDateTime.now());
        cashRegisterRepository.save(cashRegister);

        CashRegisterDTO response = new CashRegisterDTO(
                cashRegister.getId(),
                cashRegister.getOpenTime(),
                null,
                cashRegister.isOpen(),
                null
        );

        return ResponseEntity.ok(response);
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

    @PostMapping("/new")
    public ResponseEntity<?> addNewSale(){

        return ResponseEntity.ok("");
    }
}

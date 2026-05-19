package com.example.backend.controllers;

import com.example.backend.DTOs.sales.CashRegisterDTO;
import com.example.backend.DTOs.sales.InitCashRegisterDTO;
import com.example.backend.DTOs.sales.SaleCreateDTO;

import com.example.backend.models.CashRegister;
import com.example.backend.models.Client;
import com.example.backend.models.Company;
import com.example.backend.models.Product;
import com.example.backend.models.User;

import com.example.backend.repository.UserRepository;
import com.example.backend.repository.CashRegisterRepository;
import com.example.backend.repository.ClientRepository;
import com.example.backend.repository.CompanyRepository;
import com.example.backend.repository.ProductRepository;
import com.example.backend.repository.SaleItemRepository;

import com.example.backend.services.Logger;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/sales")
public class SalesController{
    private CashRegisterRepository cashRegisterRepository;
    private CompanyRepository companyRepository;
    private ProductRepository productRepository;
    private UserRepository userRepository;
    private ClientRepository clientRepository;
    private SaleItemRepository saleItemRepository;

    public SalesController(
            SaleItemRepository saleItemRepository,
            ClientRepository clientRepository,
            ProductRepository productRepository,
            CashRegisterRepository cashRegisterRepository,
            UserRepository userRepository,
            CompanyRepository companyRepository
    ){  
        this.saleItemRepository = saleItemRepository;
        this.clientRepository = clientRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.companyRepository = companyRepository;
        this.cashRegisterRepository = cashRegisterRepository;
    }

    /*
    * usuário abre o caixa ->
    * usuário inicia venda ->
    * usuário seleciona o cliente ->
    * adiciona produtos ->
    * confirma ou cancela venda ->  
    * FIM
    * */

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
    public ResponseEntity<?> addNewSale(@RequestBody SaleCreateDTO dto){
        Logger.warn("salvando venda...");
        Client client = clientRepository.findById(dto.clientId()).orElse(null);

        if(client == null){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message","cliente não encontrado"));
        }

        Logger.simpleMessage("Cliente: "+client.getName());

        List<Product> products = productRepository.findByCompany_id(dto.companyId());
        Set<Long> ids = products.stream().map(p -> p.getId()).collect(Collectors.toSet());

        boolean allProductExists = dto.itens().stream()
        .allMatch(p -> ids.contains(p.productId()));

        if(!allProductExists){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message","produto invalido encontrado!"));
        }

        Logger.simpleMessage("produtos:  "+dto.itens().toString());

        return ResponseEntity.ok("");
    }
}

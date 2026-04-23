package com.example.backend.controllers;

import com.example.backend.DTOs.ClientRegisterDTO;
import com.example.backend.DTOs.ClientResponseDTO;
import com.example.backend.models.Client;
import com.example.backend.models.Company;
import com.example.backend.repository.ClientRepository;
import com.example.backend.repository.CompanyRepository;
import com.example.backend.services.Logger;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/client")
public class ClientController {
    private CompanyRepository companyRepository;
    private ClientRepository clientRepository;

    public ClientController(
            CompanyRepository companyRepository,
            ClientRepository clientRepository
    ){
        this.clientRepository = clientRepository;
        this.companyRepository = companyRepository;
    }

    @PostMapping("/create")
    public ResponseEntity<?> createClientMethod(@RequestBody ClientRegisterDTO dto){
        Logger.info("Registrarndo cliente...");
        Company company = companyRepository.findById(dto.companyId()).orElse(null);
        if(company == null){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message","empresa não encontrada!"));
        }
        Client client = clientRepository.save(new Client(
                dto.birthDate(),
                company,
                dto.cpf(),
                dto.email(),
                dto.favoritePayment(),
                dto.name()
        ));
        Logger.debug("cliente cadastrado!");
        return ResponseEntity.ok(new ClientResponseDTO(
                company.getId(), client.getName(), client.getEmail(),
                client.getDocument(),client.getBirthDate(), client.getFavoritePayment().toString(),
                 client.getId(), client.getSaleList()
        ));
    }

    @GetMapping("/get/all")
    public ResponseEntity<?> getAllClients(@RequestParam long id){
        Logger.debug("Retornando clientes");
        List<Client> clients = clientRepository.findByCompany_Id(id);
        List<ClientResponseDTO> responseDTOList = clients.stream().map(c -> new ClientResponseDTO(
                        c.getCompany().getId(), c.getName(), c.getEmail(),
                c.getDocument(),c.getBirthDate(), c.getFavoritePayment().toString(),
                c.getId(), c.getSaleList()
        )).toList();
        Logger.debug("Retornando clientes");
        return ResponseEntity.status(HttpStatus.OK).body(responseDTOList);
    }
}

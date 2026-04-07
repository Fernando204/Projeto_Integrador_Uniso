package com.example.backend.controllers;

import com.example.backend.DTOs.LoginRequestDTO;
import com.example.backend.DTOs.RegisterRequestDTO;
import com.example.backend.enums.AccountStatus;
import com.example.backend.models.User;
import com.example.backend.repository.TokenRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.services.Logger;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class AuthController{
    private UserRepository userRepository;
    private TokenRepository tokenRepository;
    private PasswordEncoder passwordEncoder;

    public AuthController(
            UserRepository userRepository,
            TokenRepository tokenRepository,
            PasswordEncoder passwordEncoder
    ){
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
        this.tokenRepository = tokenRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginMethod(@RequestBody LoginRequestDTO dto){
        Optional<User> userOptional = userRepository.findByEmail(dto.email());
        if(userOptional.isEmpty()){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        User user = userOptional.get();

        if(passwordEncoder.matches(user.getPassword(), dto.password())){
            return ResponseEntity.status(HttpStatus.ACCEPTED).body(user);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerMethod(@RequestBody RegisterRequestDTO dto){
        Logger.info("Registro iniciado");
        Optional<User> userOptional = userRepository.findByEmail(dto.email());
        if(userOptional.isPresent()){
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Email já cadastrado");
        }

        User user = userRepository.save(new User(
                dto.name(),
                dto.email(),
                passwordEncoder.encode(dto.password()),
                "OWNER",
                dto.cpfOrCnpj(),
                AccountStatus.ACTIVE
        ));
        return ResponseEntity.ok(user);
    }
}
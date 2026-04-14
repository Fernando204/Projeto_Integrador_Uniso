package com.example.backend.controllers;

import com.example.backend.DTOs.LoginResponseDTO;
import com.example.backend.models.User;
import com.example.backend.repository.UserRepository;
import com.example.backend.services.Logger;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/session")
public class SessionController {
    UserRepository userRepository;

    public SessionController(UserRepository userRepository){
        this.userRepository = userRepository;
    }
    @GetMapping
    public ResponseEntity<?> sessionMethod(Authentication auth){
        Logger.info(
                "usuário se autenticando"
        );
        Optional<User> userOptional = userRepository.findByEmail(auth.getName());
        if(userOptional.isEmpty()){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message","usuário não encontrado"));
        }
        User user = userOptional.get();
        LoginResponseDTO response = new LoginResponseDTO(
                user.getId(),
                user.getCompany().getId(),
                user.getName(),
                user.getEmail(),
                user.getRole()
        );
        return ResponseEntity.ok(response);
    }
}

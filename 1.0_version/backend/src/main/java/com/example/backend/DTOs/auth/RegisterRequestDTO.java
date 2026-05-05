package com.example.backend.DTOs.auth;

public record RegisterRequestDTO(
        String name,
        String email,
        String phone,
        String endereco,
        String razaoSocial,
        String cpfOrCnpj,
        String password
) {}

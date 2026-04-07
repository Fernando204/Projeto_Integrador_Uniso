package com.example.backend.DTOs;

public record RegisterRequestDTO(
        String name,
        String email,
        String razaoSocial,
        String cpfOrCnpj,
        String password
) {}

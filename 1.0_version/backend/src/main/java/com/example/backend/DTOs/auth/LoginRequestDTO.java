package com.example.backend.DTOs.auth;

public record LoginRequestDTO(
        String email,
        String password
){}

package com.example.backend.DTOs;

public record LoginResponseDTO (
        Long userId,
        Long companyId,
        String name,
        String email,
        String role
){}

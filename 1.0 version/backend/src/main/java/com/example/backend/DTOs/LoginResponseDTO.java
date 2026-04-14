package com.example.backend.DTOs;

public record LoginResponseDTO (
        Long userId,
        Long comanyId,
        String name,
        String email,
        String role
){}

package com.example.backend.DTOs.sales;

import com.example.backend.models.Collaborators;

import java.time.LocalDateTime;
import java.util.List;

public record CollaboratorCreateDTO(
    long id,
    String name,
    String email,
    int cpf,
    LocalDateTime birthDate,
    LocalDateTime createTime,
    List<Collaborators> collaboratorList
){}
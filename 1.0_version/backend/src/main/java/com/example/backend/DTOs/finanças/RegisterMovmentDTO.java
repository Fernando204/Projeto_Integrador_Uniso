package com.example.backend.DTOs;

import com.example.backend.enums.MovmentType;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record RegisterMovmentDTO(
    Long userId,
    Long companyId,
    String name,
    String description,
    BigDecimal value,
    LocalDate movmentDate,
    MovmentType movmentType
){}

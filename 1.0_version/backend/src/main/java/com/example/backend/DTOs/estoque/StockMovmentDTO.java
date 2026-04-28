package com.example.backend.DTOs;

import com.example.backend.enums.StockMovementType;

public record StockMovmentDTO(
    long companyId,
    long productId,
    int quantity,
    StockMovementType type
){}
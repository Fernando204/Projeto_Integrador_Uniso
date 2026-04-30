package com.example.backend.DTOs;

import com.example.backend.enums.StockMovmentType;

public record StockMovmentDTO(
    long companyId,
    long productId,
    int quantity,
    StockMovmentType type
){}
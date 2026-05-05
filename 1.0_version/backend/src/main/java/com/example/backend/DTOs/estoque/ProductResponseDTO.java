package com.example.backend.DTOs.estoque;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ProductResponseDTO (
        Long productId,

        String name,
        String description,

        int minQty,
        int qty,

        BigDecimal costPrice,
        BigDecimal sellingPrice,
        BigDecimal profitRate,

        LocalDateTime createdAt,
        LocalDateTime updatedAt
){}

package com.example.backend.DTOs.sales;

import java.math.BigDecimal;

public record SaleItemDTO (
        String name,
        int qty,
        BigDecimal price,
        Long productId
){}

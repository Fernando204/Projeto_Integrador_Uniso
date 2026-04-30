package com.example.backend.DTOs.estoque;

import java.math.BigDecimal;

public record NewProductDTO(
        Long companyId,
        String name,
        String description,
        BigDecimal costPrice,
        BigDecimal sellingPrice,
        BigDecimal profitRate,
        int minQuantity,
        String unity
){}

package com.example.backend.DTOs;

import com.example.backend.models.Sale;

import java.time.LocalDateTime;
import java.util.List;

public record CashRegisterDTO(
        long id,
        LocalDateTime openTime,
        LocalDateTime closeTime,
        boolean open,
        List<Sale> salesList
){}

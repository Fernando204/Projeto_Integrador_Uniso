package com.example.backend.DTOs;

import com.example.backend.enums.PaymentWay;
import com.example.backend.models.Sale;
import org.antlr.v4.runtime.misc.NotNull;

import java.time.LocalDate;
import java.util.List;

public record ClientResponseDTO(
        @NotNull Long companyId,
        String name,
        String email,
        String cpf,         // hibernate-validator tem isso
        @NotNull LocalDate birthDate,
        String favoritePayment,
        Long id,
        List<Sale> sales
){}
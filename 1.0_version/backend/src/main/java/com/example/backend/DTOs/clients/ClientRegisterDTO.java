package com.example.backend.DTOs;

import com.example.backend.enums.PaymentWay;

import java.time.LocalDate;

public record ClientRegisterDTO(
        Long companyId,
        String name,
        String email,
        String cpf,
        LocalDate birthDate,
        PaymentWay favoritePayment
) {
}

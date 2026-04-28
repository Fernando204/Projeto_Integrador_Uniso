package com.example.backend.DTOs;

import com.example.backend.enums.*;
import com.example.backend.models.*;
import java.math.BigDecimal;
import java.util.List;


public record SaleCreateDTO(
    List<SaleItem> itens,
    Long clientId,
    BigDecimal total,
    PaymentWay paymentWay
){}
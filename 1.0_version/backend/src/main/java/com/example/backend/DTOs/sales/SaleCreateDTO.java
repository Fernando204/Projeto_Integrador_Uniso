package com.example.backend.DTOs.sales;

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

/*
* id: {
* itens{
*   name: arroz,
*   price: 78.34,
*   qty: 7
* },
* clientId: 8,
* total: 45.45,
* paymentWay: credito
* }
* */
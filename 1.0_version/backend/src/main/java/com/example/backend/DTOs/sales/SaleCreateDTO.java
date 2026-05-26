package com.example.backend.DTOs.sales;

import com.example.backend.enums.*;
import com.example.backend.models.*;
import java.math.BigDecimal;
import java.util.List;


public record SaleCreateDTO(
    List<SaleItemDTO> itens,
    Long companyId,
    Long clientId,
    BigDecimal total,
    PaymentWay paymentWay,
    Long cashRegisterId,
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
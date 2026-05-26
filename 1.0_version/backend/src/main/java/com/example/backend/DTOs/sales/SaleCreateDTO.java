package com.example.backend.DTOs.sales;

import com.example.backend.enums.*;
import com.example.backend.models.*;
import java.math.BigDecimal;
import java.util.List;


public record SaleCreateDTO(
    Long cashRegisterId, //id do caixa aberto
    Long companyId, //id da empresa
    Long clientId, // id do cliente

    BigDecimal total,// valor total da compra
    PaymentWay paymentWay, // forma de pagamento
    List<SaleItemDTO> itens// itens da compra para descrição
){}

/*
* id: {
* itens[
*       1 :{
            name: arroz,
            unity_price: 10,
*           total_price: 78.34,
*           qty: 7
*       },
        2: {
            name: arroz,
            unity_price: 10,
*           total_price: 78.34,
*           qty: 7
        }
],
* clientId: 8,
* total: 45.45,
* paymentWay: credito
* }
* */
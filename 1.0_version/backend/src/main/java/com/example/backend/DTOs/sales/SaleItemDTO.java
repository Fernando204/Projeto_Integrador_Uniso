package com.example.backend.DTOs.sales;

import java.math.BigDecimal;

//dto do item de venda, ele tem apenas o id do produto e
//a quantidade pois todas as outras informações serão 
//carregadas do banco a partir do is do produto
public record SaleItemDTO (
        int qty,
        Long productId
){}

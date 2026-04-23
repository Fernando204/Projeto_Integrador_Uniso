package com.example.backend.DTOs;

import com.example.backend.models.Sale;

import java.math.BigDecimal;
import java.util.List;

public record DashboardDTO(
    BigDecimal balance,
    BigDecimal monthlyRevenue,
    BigDecimal monthlyExpenses,
    BigDecimal monthlyProfit,

    List<Sale> pendingSales,
    List<Sale> notInvoicedSales,
    List<Sale> invicedSales
){}

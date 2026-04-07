package com.example.backend.models;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;

@Entity(name = "cash_register")
public class CashRegister {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime openTime;//hora de abertura do caixa
    private LocalDateTime closeTime;//hora do fechamento do caixa

    private Long userId;//id do usuário responsavel pelo caixa
    private Long companyId;//id da empresa onde esse caixa foi aberto

    @OneToMany(mappedBy = "cashRegister", cascade = CascadeType.ALL)
    private List<Sale> sales = new ArrayList<>();

    public CashRegister(LocalDateTime closeTime, Long companyId, List<Sale> sales, Long userId) {
        this.closeTime = closeTime;
        this.companyId = companyId;
        this.openTime = LocalDateTime.now();
        this.sales = sales;
        this.userId = userId;
    }

    public void addSale(Sale sale){
        sales.add(sale);
    }
    public LocalDateTime getCloseTime() {
        return closeTime;
    }

    public void setCloseTime(LocalDateTime closeTime) {
        this.closeTime = closeTime;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getCompanyId() {
        return companyId;
    }

    public void setCompanyId(Long companyId) {
        this.companyId = companyId;
    }

    public LocalDateTime getOpenTime() {
        return openTime;
    }

    public void setOpenTime(LocalDateTime openTime) {
        this.openTime = openTime;
    }

    public List<Sale> getSales() {
        return sales;
    }

    public void setSales(List<Sale> sales) {
        this.sales = sales;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}

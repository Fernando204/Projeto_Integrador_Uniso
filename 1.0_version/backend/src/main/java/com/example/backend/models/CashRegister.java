package com.example.backend.models;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;

@Entity(name = "cash_register")
public class CashRegister {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime openTime;//hora de abertura do caixa
    private LocalDateTime closeTime;//hora do fechamento do caixa
    private boolean open = false;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;//id do usuário responsavel pelo caixa

    @ManyToOne
    @JoinColumn(name = "company_id")
    private Company company;//id da empresa onde esse caixa foi aberto

    @OneToMany(mappedBy = "cashRegister", cascade = CascadeType.ALL)
    private List<Sale> sales = new ArrayList<>();

    public CashRegister(){}
    public CashRegister(Company company, User user) {
        this.company = company;
        this.openTime = LocalDateTime.now();
        this.user = user;
        this.open = true;
    }

    public boolean isOpen() {
        return open;
    }

    public void setOpen(boolean open) {
        this.open = open;
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

    public Company getCompany() {
        return company;
    }

    public void setCompany(Company company) {
        this.company = company;
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

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}

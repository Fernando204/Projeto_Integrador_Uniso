package com.example.backend.models;

import com.example.backend.enums.PaymentWay;
import com.example.backend.enums.SaleStatus;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity(name = "sales")
public class Sale {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private CashRegister cashRegister;

    @ManyToOne
    private Company company;

    private BigDecimal value;
    private SaleStatus status;
    private PaymentWay payment;

    @ManyToOne
    @JoinColumn(name = "client_id")
    private Client client;

    private LocalDateTime finalizedDate;
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "sale", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SaleItem> items = new ArrayList<>();

    public Sale(){}
    public Sale(CashRegister cashRegister, PaymentWay payment, SaleStatus status, BigDecimal value,Client client) {
        this.cashRegister = cashRegister;
        this.payment = payment;
        this.status = status;
        this.client = client;
        this.value = value;
        this.createdAt = LocalDateTime.now();
    }

    public Company getCompany() {
        return company;
    }

    public void setCompany(Company company) {
        this.company = company;
    }

    public Client getClient() {
        return client;
    }

    public void setClient(Client client) {
        this.client = client;
    }

    public void addItem(Product product, int quantity) {
        SaleItem item = new SaleItem(this, product, quantity);
        this.items.add(item);
        recalculate();
    }

    public void removeItem(SaleItem item) {
        this.items.remove(item);
        recalculate();
    }

    // Recalcula value e totalItens com base nos itens atuais
    private void recalculate() {
        this.value = items.stream()
                .map(SaleItem::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    // ... getters e setters existentes +

    public List<SaleItem> getItems() { return items; }
    public void setItems(List<SaleItem> items) {
        this.items = items;
        recalculate();
    }

    public CashRegister getCashRegister() {
        return cashRegister;
    }

    public void setCashRegister(CashRegister cashRegister) {
        this.cashRegister = cashRegister;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getFinalizedDate() {
        return finalizedDate;
    }

    public void setFinalizedDate(LocalDateTime finalizedDate) {
        this.finalizedDate = finalizedDate;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public PaymentWay getPayment() {
        return payment;
    }

    public void setPayment(PaymentWay payment) {
        this.payment = payment;
    }

    public SaleStatus getStatus() {
        return status;
    }

    public void setStatus(SaleStatus status) {
        this.status = status;
    }

    public BigDecimal getValue() {
        return value;
    }

    public void setValue(BigDecimal value) {
        this.value = value;
    }
}

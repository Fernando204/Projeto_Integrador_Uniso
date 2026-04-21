package com.example.backend.models;

import com.example.backend.enums.PaymentWay;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity(name = "clients")
public class Client {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "company_id")
    private Company company;

    private String name;
    private String email;
    private String document;
    private LocalDate birthDate;
    private PaymentWay favoritePayment;

    @OneToMany(mappedBy = "client", cascade = CascadeType.ALL)
    private List<Sale> saleList = new ArrayList<>();

    private LocalDateTime createdAt;

    public Client(){}
    public Client(LocalDate birthDate, Company company, String document, String email, PaymentWay favoritePayment, String name) {
        this.birthDate = birthDate;
        this.company = company;
        this.document = document;
        this.email = email;
        this.favoritePayment = favoritePayment;
        this.name = name;
        this.createdAt = LocalDateTime.now();
    }

    public void addSale(Sale sale){
        this.saleList.add(sale);
    }

    public void setSales(List<Sale> sales){
        this.saleList = sales;
    }

    public List<Sale> getSaleList() {
        return saleList;
    }

    public LocalDate getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(LocalDate birthDate) {
        this.birthDate = birthDate;
    }

    public Company getCompany() {
        return company;
    }

    public void setCompany(Company company) {
        this.company = company;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getDocument() {
        return document;
    }

    public void setDocument(String document) {
        this.document = document;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public PaymentWay getFavoritePayment() {
        return favoritePayment;
    }

    public void setFavoritePayment(PaymentWay favoritePayment) {
        this.favoritePayment = favoritePayment;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}

package com.example.backend.models;

import com.example.backend.enums.UnityMeasurement;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "comany_id")
    private Company company;

    private String name;
    private String description;
    private BigDecimal costPrice;
    private BigDecimal sellingPrice;
    private BigDecimal profitRate;
    private int quantity = 0;
    private int minQuantity;

    @Enumerated(EnumType.STRING)
    private UnityMeasurement unity;

    private LocalDateTime updatedAt;
    private LocalDateTime createdAt;

    public Product(){}

    public Product(

            BigDecimal costPrice,
            BigDecimal profitRate,
            UnityMeasurement unity,
            BigDecimal sellingPrice,
            String name,
            int minQuantity,
            String description
    ) {
        this.costPrice = costPrice;
        this.profitRate = profitRate;
        this.unity = unity;
        this.sellingPrice = sellingPrice;
        this.name = name;
        this.minQuantity = minQuantity;
        this.description = description;

        this.updatedAt = LocalDateTime.now();
        this.createdAt = LocalDateTime.now();
    }

    public void addQuantity(int quantity){
        this.quantity += quantity;
    }
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public BigDecimal getCostPrice(){
        return costPrice;
    }
    public BigDecimal getSellingPrice(){
        return sellingPrice;
    }

    public Company getCompany() {
        return company;
    }

    public void setCompany(Company company) {
        this.company = company;
    }

    public void setCostPrice(BigDecimal costPrice) {
        this.costPrice = costPrice;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getMinQuantity() {
        return minQuantity;
    }

    public void setMinQuantity(int minQuantity) {
        this.minQuantity = minQuantity;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public BigDecimal getProfitRate() {
        return profitRate;
    }

    public void setProfitRate(BigDecimal profitRate) {
        this.profitRate = profitRate;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public void setSellingPrice(BigDecimal sellingPrice) {
        this.sellingPrice = sellingPrice;
    }

    public UnityMeasurement getUnity() {
        return unity;
    }

    public void setUnity(UnityMeasurement unity) {
        this.unity = unity;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}

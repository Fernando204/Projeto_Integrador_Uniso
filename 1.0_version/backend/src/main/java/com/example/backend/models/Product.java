package com.example.backend.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private BigDecimal costPrice;
    private BigDecimal sellingPrice;
    private BigDecimal profitRate;
    private int quantity;
    private int minQuantity;
    private String unity;
    private LocalDateTime createdAt;

    public Product(){}

    public Product(BigDecimal costPrice,BigDecimal profitRate, String unity, BigDecimal sellingPrice, int quantity, String name, int minQuantity, String description) {
        this.costPrice = costPrice;
        this.profitRate = profitRate;
        this.unity = unity;
        this.sellingPrice = sellingPrice;
        this.quantity = quantity;
        this.name = name;
        this.minQuantity = minQuantity;
        this.description = description;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}

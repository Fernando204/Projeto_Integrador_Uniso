package com.example.backend.models;

import jakarta.persistence.*;

@Entity(name = "sales")
public class Sale {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private CashRegister cashRegister;
    
}

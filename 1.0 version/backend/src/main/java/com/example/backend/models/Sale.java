package com.example.backend.models;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;

@Entity(name = "sales")
public class Sale {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    public String produto;
    public String valorProduto;
    public String quantidadeProduto;
    public LocalDateTime dataAdicao;
    public LocalDateTime dataModificacao;
    public String 
    @ManyToMany
    
}

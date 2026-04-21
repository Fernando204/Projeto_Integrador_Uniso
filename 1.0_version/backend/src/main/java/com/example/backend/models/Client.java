package com.example.backend.models;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;

@Entity(name = "clients")
public class Client {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
<<<<<<< HEAD:1.0 version/backend/src/main/java/com/example/backend/models/Sale.java
    
    public String produto;
    public String valorProduto;
    public String quantidadeProduto;
    public LocalDateTime dataAdicao;
    public LocalDateTime dataModificacao;
    public String 
    @ManyToMany
    
=======
>>>>>>> 22745e93f55bdf24c297e556cea75eca4387b630:1.0_version/backend/src/main/java/com/example/backend/models/Client.java
}

package com.example.backend.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity(name = "stock_movement")
public class StockMovement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; //id da movimentação
    private Integer quantidade; //quantidade de mercadoria movimentada de um certo tipo

    public String type; //entrada ou saida
    public LocalDateTime criadoEm; //cria a data da movimentação

    public StockMovement(Integer quantidade, MovementType type, LocalDateTime criadoEm){ 
        this.id = id;
        this.quantidade = quantidade;
        this.type = type;
        this.criadoEm = criadoEm;
    }

    public Long getId() {
        return id;
    }
    public Integer quantidade {
        return quantidade;
    }
    public String type {
        return type;
    }
    public LocalDateTime criadoEm {
        return criadoEm
    }

    public void setQuantidade(Integer quantidade) {
        this.quantidade = quantidade;
    }
    public void setType(MovementType type) {
        this.type = type;
    }
    public void setCriadoEm(LocalDateTime criadoEm) {
        this.criadoEm = criadoEm;
    }
}

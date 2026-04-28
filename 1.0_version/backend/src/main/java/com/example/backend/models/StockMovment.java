package com.example.backend.models;

import java.time.LocalDateTime;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import com.example.backend.enums.StockMovmentType;
import com.example.backend.enums.MovmentType;

@Entity(name = "stock_movment")
public class StockMovment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; //id da movimentação
    private Integer quantidade; //quantidade de mercadoria movimentada de um certo tipo

    public StockMovmentType type; //entrada ou saida
    public LocalDateTime criadoEm; //cria a data da movimentação

    public StockMovment(Integer quantidade, StockMovmentType type, LocalDateTime criadoEm){ 
        this.id = id;
        this.quantidade = quantidade;
        this.type = type;
        this.criadoEm = criadoEm;
    }

    public Long getId() {
        return id;
    }
    public Integer quantidade() {
        return quantidade;
    }
    public StockMovmentType type() {
        return type;
    }
    public LocalDateTime criadoEm() {
        return criadoEm;
    }

    public void setQuantidade(Integer quantidade) {
        this.quantidade = quantidade;
    }
    public void setType(StockMovmentType type) {
        this.type = type;
    }
    public void setCriadoEm(LocalDateTime criadoEm) {
        this.criadoEm = criadoEm;
    }
}

package com.example.backend.models;

import java.time.LocalDateTime;

import com.example.backend.enums.StockMovementType;

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
    private StockMovementType type; //entrada ou saida
    private LocalDateTime criadoEm; //cria a data da movimentação

    public StockMovement(Integer quantidade, StockMovementType type, LocalDateTime criadoEm){
        this.quantidade = quantidade;
        this.type = type;
        this.criadoEm = criadoEm;
    }

    public Long getId() {
        return id;
    }
    public Integer getQuantidade(){
        return quantidade;
    }
    public StockMovementType getType(){
        return type;  
    }
    public LocalDateTime getCriadoEm(){
        return criadoEm;
    }

    public void setQuantidade(Integer quantidade) {
        this.quantidade = quantidade;
    }
    public void setType(StockMovementType type) {
        this.type = type;
    }
    public void setCriadoEm(LocalDateTime criadoEm) {
        this.criadoEm = criadoEm;
    }
}

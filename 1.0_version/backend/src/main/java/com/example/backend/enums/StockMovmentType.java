package com.example.backend.enums;

//mudanças para conseguir type.getDirection();, que serve para saber se a movimentação é de entrada ou de saída.

public enum StockMovementType {
    VENDA("SAIDA"),
    VENCIMENTO("SAIDA"),
    USO_INTERNO("SAIDA"),
    COMPRA("ENTRADA");

    private final String direction;

    StockMovementType(String direction) {
        this.direction = direction;
    }

    public String getDirection() {
        return direction;
    }
}
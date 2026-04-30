package com.example.backend.enums;

public enum UnityMeasurement {

    // Peso
    QUILOGRAMA("kg", "Quilograma"),
    GRAMA("g", "Grama"),

    // Volume
    LITRO("L", "Litro"),
    MILILITRO("mL", "Mililitro"),

    // Contagem
    UNIDADE("un", "Unidade"),
    CAIXA("cx", "Caixa"),
    PACOTE("pct", "Pacote"),
    FARDO("fardo", "Fardo"),
    DUZIA("duzia", "Dúzia"),

    // Comprimento
    METRO("m", "Metro"),
    CENTIMETRO("cm", "Centímetro");

    private final String codigo;
    private final String descricao;

    UnityMeasurement(String codigo, String descricao) {
        this.codigo = codigo;
        this.descricao = descricao;
    }

    public String getCodigo() {
        return codigo;
    }

    public String getDescricao() {
        return descricao;
    }

    // Converte a partir do código curto: "kg", "L", "un", etc.
    public static UnityMeasurement fromCodigo(String codigo) {
        for (UnityMeasurement u : values()) {
            if (u.codigo.equalsIgnoreCase(codigo)) {
                return u;
            }
        }
        throw new IllegalArgumentException("Unidade de medida não encontrada para o código: " + codigo);
    }

    // Converte a partir da descrição: "Quilograma", "Litro", etc.
    public static UnityMeasurement fromDescricao(String descricao) {
        for (UnityMeasurement u : values()) {
            if (u.descricao.equalsIgnoreCase(descricao)) {
                return u;
            }
        }
        throw new IllegalArgumentException("Unidade de medida não encontrada para a descrição: " + descricao);
    }

    // Tenta converter por código primeiro, depois por descrição, depois pelo name() do enum
    public static UnityMeasurement from(String valor) {
        if (valor == null || valor.isBlank()) {
            throw new IllegalArgumentException("Valor não pode ser nulo ou vazio");
        }
        for (UnityMeasurement u : values()) {
            if (u.codigo.equalsIgnoreCase(valor)
                    || u.descricao.equalsIgnoreCase(valor)
                    || u.name().equalsIgnoreCase(valor)) {
                return u;
            }
        }
        throw new IllegalArgumentException("Unidade de medida não reconhecida: " + valor);
    }

    @Override
    public String toString() {
        return descricao + " (" + codigo + ")";
    }
}

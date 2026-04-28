public record SaleCreateDTO(
    List<SaleItem> itens,
    Long clientId,
    BigDecimal total,
    PaymentWay paymentWay
){}
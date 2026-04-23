package com.example.backend.models;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity(name = "sale_items")
public class SaleItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "sale_id", nullable = false)
    private Sale sale;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    private int quantity;

    public SaleItem() {}

    public SaleItem(Sale sale, Product product, int quantity) {
        this.sale = sale;
        this.product = product;
        this.quantity = quantity;
    }

    // Calcula o subtotal na hora, usando o preço atual do produto
    public BigDecimal getSubtotal() {
        return product.getSellingPrice().multiply(BigDecimal.valueOf(quantity));
    }

    public Long getId() { return id; }

    public Sale getSale() { return sale; }
    public void setSale(Sale sale) { this.sale = sale; }

    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
}
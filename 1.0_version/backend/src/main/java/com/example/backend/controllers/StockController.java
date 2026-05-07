package com.example.backend.controllers;

import com.example.backend.DTOs.estoque.NewProductDTO;
import com.example.backend.DTOs.estoque.ProductResponseDTO;

import com.example.backend.models.Product;
import com.example.backend.services.Logger;
import com.example.backend.services.StockService;
import org.apache.juli.logging.Log;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/stock")
public class StockController {
    private StockService stockService;


    public StockController(
            StockService stockService
    ){
        this.stockService = stockService;
    }

    @GetMapping("/test")
    public String test(){
        Logger.warn("Testando");
        return "Teste";
    }

    @PostMapping("/product/add")
    public ResponseEntity<?> addProduct(@RequestBody NewProductDTO dto){
        Logger.info("Salvando produto: "+dto.name());
        try {
            Product product = stockService.saveProduct(dto);
            if(product.getId() == null){
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message","Erro ao salvar produto!"));
            }
            ProductResponseDTO response = new ProductResponseDTO(
                    product.getId(),
                    product.getName(),
                    product.getDescription(),
                    product.getMinQuantity(),
                    product.getQuantity(),
                    product.getCostPrice(),
                    product.getSellingPrice(),
                    product.getProfitRate(),
                    product.getCreatedAt(),
                    product.getUpdatedAt()
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message",e.getMessage()));
        }
    }

    @DeleteMapping("/product/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id){
        try {
            stockService.deleteProduct(id);
            return ResponseEntity.ok().build();
        } catch (Exception ex){
            return ResponseEntity.status(500).body(Map.of("message","Erro ao deletar produto"));
        }
    }

    @GetMapping("/product/get")
    public ResponseEntity<?> getProduct(@RequestParam Long id){
        List<ProductResponseDTO> productList = stockService.getAllByCompanyId(id);
        return ResponseEntity.ok(productList);
    }

    @PutMapping("/product/update")
    public ResponseEntity<?> updateProduct(){
        return ResponseEntity.ok("");
    }

    @PostMapping("/movment")
    public ResponseEntity<?> stockMovment(){
        return ResponseEntity.ok("");
    }
}

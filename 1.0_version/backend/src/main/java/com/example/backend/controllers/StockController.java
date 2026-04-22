package com.example.backend.controllers;

import com.example.backend.services.StockService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/stock")
public class StockController {
    private StockService stockService;


    public StockController(
            StockService stockService
    ){
        this.stockService = stockService;
    }

    @PostMapping("/product/add")
    public ResponseEntity<?> addProduct(){
        return ResponseEntity.ok("");
    }

    @DeleteMapping("/product/delete")
    public ResponseEntity<?> deleteProduct(){
        return ResponseEntity.ok("");
    }

    @GetMapping("/product/get")
    public ResponseEntity<?> getProduct(){
        return ResponseEntity.ok("");
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

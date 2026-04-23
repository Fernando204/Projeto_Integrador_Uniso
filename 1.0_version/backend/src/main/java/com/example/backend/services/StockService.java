package com.example.backend.services;

import com.example.backend.repository.CompanyRepository;
import com.example.backend.repository.ProductRepository;
import com.example.backend.repository.StockMovmentRepository;
import org.springframework.stereotype.Service;

@Service
public class StockService {
    private CompanyRepository companyRepository;
    private ProductRepository productRepository;
    private StockMovmentRepository stockMovmentRepository;

    public StockService(
            CompanyRepository companyRepository,
            ProductRepository productRepository,
            StockMovmentRepository stockMovmentRepository
    ){
        this.stockMovmentRepository = stockMovmentRepository;
        this.companyRepository = companyRepository;
        this.productRepository = productRepository;
    }

    public void newMovment(){
        
    }
}

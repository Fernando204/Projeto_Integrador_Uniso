package com.example.backend.services;

import com.example.backend.DTOs.estoque.NewProductDTO;
import com.example.backend.enums.UnityMeasurement;
import com.example.backend.models.Company;
import com.example.backend.models.Product;
import com.example.backend.repository.CompanyRepository;
import com.example.backend.repository.ProductRepository;
import com.example.backend.repository.StockMovmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

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

    public Product saveProduct(NewProductDTO dto){
        Company company = companyRepository.findById(dto.companyId()).orElse(null);

        if(company == null){
            throw new RuntimeException("Empresa não cadastrada!");
        }

        Product product = productRepository.save(new Product(
                company,
                dto.costPrice(),
                dto.profitRate(),
                UnityMeasurement.from(dto.unity()),
                dto.sellingPrice(),
                dto.name(),
                dto.minQuantity(),
                dto.description()
        ));

        return product;
    }

    public List<Product> getAllByCompanyId(Long id){
        Logger.warn("Retornando lista dos produtos");
        List<Product> productList = productRepository.findByCompany_id(id);

        return  productList;
    }

    public void deleteProduct(Long id){
        Logger.warn("Excluindo produto");
        productRepository.deleteById(id);
    }

    public void newMovment(){
        
    }
}

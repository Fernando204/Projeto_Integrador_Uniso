package com.example.backend.services;

import com.example.backend.DTOs.DashboardDTO;
import com.example.backend.enums.MovmentType;
import com.example.backend.models.Company;
import com.example.backend.models.Movment;
import com.example.backend.models.Sale;
import com.example.backend.repository.CompanyRepository;
import com.example.backend.repository.MovmentRepository;
import com.example.backend.repository.SaleRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.chrono.ChronoLocalDate;
import java.util.List;

@Service
public class DashboardService {
    private MovmentRepository movmentRepository;
    private SaleRepository saleRepository;
    private CompanyRepository companyRepository;

    public DashboardService(
                MovmentRepository movmentRepository,
                SaleRepository saleRepository,
                CompanyRepository companyRepository
            ){
        this.movmentRepository = movmentRepository;
        this.saleRepository = saleRepository;
        this.companyRepository = companyRepository;
    }


    public DashboardDTO getDashboard(Long companyId){
        Company company = companyRepository.findById(companyId).orElse(null);
        List<Movment> movments = movmentRepository.findByCompany_id(companyId);
        List<Sale> sales = saleRepository.findByCompany_id(companyId);

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime last30Days = now.minusDays(30);

        BigDecimal monthlyRevenue = movments.stream()
                .filter(m -> m.getMovmentType().equals(MovmentType.ENTRADA))
                .filter(m -> m.getMovmentDate().isAfter(ChronoLocalDate.from(last30Days)))
                .map(Movment::getValue)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal monthlyExpenses = movments.stream()
                .filter(m -> m.getMovmentType().equals(MovmentType.SAIDA))
                .filter(m -> m.getMovmentDate().isAfter(ChronoLocalDate.from(last30Days)))
                .map(Movment::getValue)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal monthlyProfit = monthlyRevenue.subtract(monthlyExpenses);

        //as listas de vendas estão null por enquanto pois o sistema de vendas ainda não está pronto!
        DashboardDTO response = new DashboardDTO(
                company.getBalance(),
                monthlyRevenue,
                monthlyExpenses,
                monthlyProfit,
                null,
                null,
                null
        );

        return response;
    }
}

package com.example.backend.repository;

import com.example.backend.models.Client;
import com.example.backend.models.Company;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ClientRepository extends JpaRepository<Client,Long> {
    List<Client> findByCompany_Id(Long companyId);
}

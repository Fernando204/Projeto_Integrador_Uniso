package com.example.backend.models;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.example.backend.enums.AccountStatus;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity(name = "user")
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    private String name;
    private String email;
    private String password;
    private String role;
    private String cnpjOrCpf;
    private LocalDate admissionDate;
    private LocalDateTime createdAt;

    @Enumerated(EnumType.STRING)
    private AccountStatus status;

    @ManyToOne
    @JoinColumn(name = "company_id")
    private Company company;

    public User(){}
    public User(//construtor para usuário normal
            String name,
            String email,
            String password,
            String role,
            String cnpjOrCpf,
            AccountStatus status){
        this.name = name;
        this.cnpjOrCpf = cnpjOrCpf;
        this.email = email;
        this.password = password;
        this.role = role;
        this.status = status;
        this.admissionDate = LocalDate.now();
        this.createdAt = LocalDateTime.now();
    }
    public User(//construtor para usuários de  funcionarios
            String name,
            String email,
            String password,
            String role,
            AccountStatus status,
            LocalDate admissionDate){
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
        this.status = status;
        this.admissionDate = admissionDate;
        this.createdAt = LocalDateTime.now();
    }

    public LocalDate getAdmissionDate() {
        return admissionDate;
    }

    public void setAdmissionDate(LocalDate admissionDate) {
        this.admissionDate = admissionDate;
    }

    public String getCnpjOrCpf() {
        return cnpjOrCpf;
    }

    public void setCnpjOrCpf(String cnpjOrCpf) {
        this.cnpjOrCpf = cnpjOrCpf;
    }

    public Company getCompany() {
        return company;
    }

    public void setCompany(Company company) {
        this.company = company;
    }

    public AccountStatus getStatus() {
        return status;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public Long getId() {
        return id;
    }

    public String getName(){
        return name;
    }

    public String getEmail(){
        return email;
    }
    
    public String getRole(){
        return role;
    }

    public String getPassword(){
        return password;
    }

    public void setName(String name){
        this.name = name;
    }

    public void setEmail(String email){
        this.email = email;
    }

    public void setRole(String role){
        this.role = role;
    }

    public void setPassword(String password){
        this.password = password;
    }

    public void setStatus(AccountStatus status) {
        this.status = status;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
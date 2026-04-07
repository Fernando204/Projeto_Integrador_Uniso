package com.example.backend.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import java.math.BigDecimal;
import java.math.BigInteger;

@Entity(name = "company")
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;
    
    public String razao;
    public String cpfOrCnpj;
    public String email;
    public String telefone;
    public String endereco;
    private BigDecimal balance = new BigDecimal(BigInteger.ZERO);


    public Company(){}
    public Company(
            String razao,
            String cpfOrCnpj,
            String email,
            String telefone,
            String endereco,
            Long id){
        this.id = id;
        this.razao = razao;
        this.cpfOrCnpj = cpfOrCnpj;
        this.email = email;
        this.telefone = telefone;
        this.endereco = endereco;
    }

    public BigDecimal getBalance() {
        return balance;
    }

    public void setBalance(BigDecimal balance) {
        this.balance = balance;
    }

    public Long getId(){
        return id;
    }
    public String getRazao(){
        return razao;
    }

    public String getCpfOrCnpj(){
        return cpfOrCnpj;
    }

    public String getEmail(){
        return email;
    }

    public String getTelefone(){
        return telefone;
    }

    public String getEndereco(){
        return endereco;
    }

    public void setRazao(String razao){
        this.razao = razao;
    }

    public void setCpfOrCnpj(String cnpj) {
        this.cpfOrCnpj = cnpj;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setTelefone(String telefone){
        this.telefone = telefone;
    }

    public void setEndereco(String endereco){
        this.endereco = endereco;
    }
}
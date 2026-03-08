package com.example.backend.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity(name = "company")
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;
    
    public String razao;
    public String cnpj;
    public String email;
    public String telefone;
    public String endereco;

    public Company(){}
    public Company(String razao,String cnpj,String email,String telefone,String endereco,Long id){
        this.id = id;
        this.razao = razao;
        this.cnpj = cnpj;
        this.email = email;
        this.telefone = telefone;
        this.endereco = endereco;
    }

    public Long getId(){
        return id;
    }
    public String getRazao(){
        return razao;
    }

    public String getCnpj(){
        return cnpj;
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

    public void setCnpj(String cnpj) {
        this.cnpj = cnpj;
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
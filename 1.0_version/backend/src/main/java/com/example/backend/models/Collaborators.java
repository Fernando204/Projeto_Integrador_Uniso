package com.example.backend.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.*;

@Entity(name = "collaborators")
public class Collaborators {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @ManyToOne
    @JoinColumn(name = "company_id")
    private Company company;
    
    public String nome;
    public String cpf;
    public String email;
    public String telefone;
    public String role;

    public Collaborators(){}
    public Collaborators(String nome,String cpf,String email,String telefone,String role,Long id){
            this.id = id;
            this.nome = nome;
            this.cpf = cpf;
            this.email = email;
            this.telefone = telefone;
            this.role = role;
        }

    public Company getCompany() {
        return company;
    }
    public void setCompany(Company company) {
        this.company = company;
    }
    public long getId(){
        return id;
    }

    public String getNome(){
        return nome;
    }

    public String getCpf(){
        return cpf;
    }

    public String getEmail(){
        return email;
    }

    public String getTelefone(){
        return telefone;
    }

    public String getRole(){
        return role;
    }

    public void setNome(String nome){
        this.nome = nome;
    }

    public void setCpf(String cpf){
        this.cpf = cpf;
    }

    public void setEmail(String email){
        this.email = email;
    }

    public void setTelefone(String telefone){
        this.telefone = telefone;
    }

    public void setRole(String role){
        this.role = role;
    }
}

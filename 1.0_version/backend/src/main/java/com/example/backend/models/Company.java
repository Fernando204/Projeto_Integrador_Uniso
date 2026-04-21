package com.example.backend.models;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "company")
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;
    
    private String razao;
    private String cpfOrCnpj;
    private String email;
    private String telefone;
    private String endereco;
    private BigDecimal balance = new BigDecimal(BigInteger.ZERO);

    @OneToOne
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @OneToMany(mappedBy = "company")
    private List<User> membersList = new ArrayList<>();

    public Company(){}
    public Company(
            String razao,
            String cpfOrCnpj,
            String email,
            String telefone,
            String endereco,
            User owner
    ){
        this.owner = owner;
        owner.setCompany(this);
        this.membersList.add(owner);

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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Company)) return false;
        Company company = (Company) o;
        return id != null && id.equals(company.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
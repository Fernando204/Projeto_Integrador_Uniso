package com.example.backend.models;

import com.example.backend.enums.MovmentType;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity(name = "movments")
public class Movment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "comany_id")
    private Company company;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String name;
    private String description;
    private BigDecimal value;
    private MovmentType movmentType;
    private LocalDate movmentDate;
    private LocalDateTime createdAt;

    public Movment(){}
    public Movment(
            String name,
            String description,
            BigDecimal value,
            LocalDate movmentDate,
            User user,
            Company company,
            MovmentType movmentType){
        this.company = company;
        this.movmentType = movmentType;
        this.movmentDate = movmentDate;
        this.user = user;
        this.value = value;
        this.description = description;
        this.name = name;
        this.createdAt = LocalDateTime.now();
    }


    public MovmentType getMovmentType() {
        return movmentType;
    }

    public void setMovmentType(MovmentType movmentType) {
        this.movmentType = movmentType;
    }

    public Company getCompany() {
        return company;
    }

    public void setCompany(Company company) {
        this.company = company;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getMovmentDate() {
        return movmentDate;
    }

    public void setMovmentDate(LocalDate movmentDate) {
        this.movmentDate = movmentDate;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public BigDecimal getValue() {
        return value;
    }

    public void setValue(BigDecimal value) {
        this.value = value;
    }
}

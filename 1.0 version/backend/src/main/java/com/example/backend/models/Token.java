package com.example.backend.models;

import java.time.LocalDateTime;
import java.util.UUID;

import com.example.backend.enums.TokenType;

import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;

@Entity(name = "token")
public class Token {
    
    private String id;

    private String token;

    private String userId;
    private LocalDateTime  expiresAt;

    private TokenType tokenType;

    public Token(){}
    public static Token createToken(String userId,TokenType tokenType){
        Token token = new Token();
        token.setUserId(userId);
        token.setToken(UUID.randomUUID().toString());
        token.setTokenType(tokenType);
        token.setExpiresAt(LocalDateTime.now().plusMinutes(15));

        return token;
    }


    public LocalDateTime getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(LocalDateTime expiresAt) {
        this.expiresAt = expiresAt;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public TokenType getTokenType() {
        return tokenType;
    }

    public void setTokenType(TokenType tokenType) {
        this.tokenType = tokenType;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }
}


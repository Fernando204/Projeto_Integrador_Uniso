package com.example.backend.controllers;

import com.example.backend.DTOs.LoginRequestDTO;
import com.example.backend.DTOs.RegisterRequestDTO;
import com.example.backend.enums.AccountStatus;
import com.example.backend.models.Company;
import com.example.backend.models.User;
import com.example.backend.repository.CompanyRepository;
import com.example.backend.repository.TokenRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.services.JwtService;
import com.example.backend.services.Logger;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class AuthController{
    private UserRepository userRepository;
    private CompanyRepository companyRepository;
    private TokenRepository tokenRepository;
    private PasswordEncoder passwordEncoder;
    private JwtService jwtService;

    public AuthController(
            JwtService jwtService,
            UserRepository userRepository,
            TokenRepository tokenRepository,
            PasswordEncoder passwordEncoder,
            CompanyRepository companyRepository
    ){
        this.jwtService = jwtService;
        this.companyRepository = companyRepository;
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
        this.tokenRepository = tokenRepository;
    }

    private void setCookie(HttpServletResponse response, User user) {
        String token = jwtService.generateToken(user);

        ResponseCookie cookie = ResponseCookie.from("AUTH_TOKEN", token)
                .httpOnly(true)
                .secure(false) // true em HTTPS
                .sameSite("Lax")
                .path("/")
                .maxAge(60 * 60 * 24)
                .build();

        response.addHeader("Set-Cookie", cookie.toString());
    }

    @GetMapping("/session")
    public ResponseEntity<?> sessionMethod(Authentication auth){
        Logger.info(
                "usuário se autenticando"
        );
        return ResponseEntity.ok(Map.of("username", auth.getName()));
    }
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletResponse response) {

        Cookie cookie = new Cookie("AUTH_TOKEN", "");
        cookie.setHttpOnly(true);
        cookie.setSecure(false); // true em produção
        cookie.setPath("/");
        cookie.setMaxAge(0); // 🔥 apaga

        response.addCookie(cookie);

        return ResponseEntity.ok().build();
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginMethod(@RequestBody LoginRequestDTO dto, HttpServletResponse response, HttpServletRequest request){
        Optional<User> userOptional = userRepository.findByEmail(dto.email());
        if(userOptional.isEmpty()){
            Logger.warn("Usuário não existe");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message","Credenciais incorretas"));
        }
        User user = userOptional.get();

        if(passwordEncoder.matches(dto.password(), user.getPassword())){
            setCookie(response,user);
            return ResponseEntity.status(HttpStatus.ACCEPTED).body(user);
        }

        Logger.warn("Senha incorreta");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message","Credenciais incorretas"));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerMethod(@RequestBody RegisterRequestDTO dto){
        Logger.info("Registro iniciado");
        Optional<User> userOptional = userRepository.findByEmail(dto.email());
        if(userOptional.isPresent()){
            Logger.warn("E-mail já cadastrado!");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message","Este email já está em uso"));
        }

        User user = userRepository.save(new User(
                dto.name(),
                dto.email(),
                passwordEncoder.encode(dto.password()),
                "OWNER",
                dto.cpfOrCnpj(),
                AccountStatus.ACTIVE
        ));

        Company company = companyRepository.save(new Company(
                dto.razaoSocial(),
                dto.cpfOrCnpj(),
                dto.email(),
                dto.phone(),
                dto.endereco(),
                user
        ));
        return ResponseEntity.ok(user);
    }
}
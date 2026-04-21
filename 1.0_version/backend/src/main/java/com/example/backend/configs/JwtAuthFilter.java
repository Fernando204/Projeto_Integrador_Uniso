package com.example.backend.configs;

import com.example.backend.services.JwtService;
import com.example.backend.services.Logger;
import com.example.backend.services.UserDetailsServiceImpl;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsServiceImpl userDetailsService;

    public JwtAuthFilter(JwtService jwtService,
                         UserDetailsServiceImpl userDetailsService) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    private static final List<String> PUBLIC_PATHS = List.of(
        "/index.html",
            "/",

            "/scripts/index.js",
            "/scripts/pages/login.js",
            "/scripts/classes/ApiConnection.js",
            "/scripts/classes/ApiConnection",
            
            "/components/clientes/clientes.js",
            "/components/clientes/clientes.html",
            "/components/clientes/clientes.css",
            
            "/components/vendas/Sales.js",
            "/components/vendas/sales.css",
            "/components/vendas/sales.html",
            
            "/components/colaboradores/colaboradores.html",
            "/components/colaboradores/colaboradores.js",
            "/components/colaboradores/colaboradores.css",

            "/components/dashboard/dashboard.js",
            "/components/dashboard/dashboard.html",
            "/components/dashboard/dashboard.css",
            
            "/components/relatorios/relatorios.js",
            "/components/relatorios/relatorios.html",
            "/components/relatorios/relatorios.css",

            "/components/finanças/finance.js",
            "/components/finanças/finance.css",
            "/components/finanças/finance.html",

            "/components/estoque/estoque.css",
            "/components/estoque/estoque.js",
            "/components/estoque/estoque.html",

            "/components/relatorios/relatorios.css",
            "/components/relatorios/relatorios.js",
            "/components/relatorios/relatorios.html",
            "/components/relatorios/specific/sales.css",
            
            "/images/main-logo.png",
            "/images/icon-logo.png",
            "/Pages/loginPage.html",
            
            "/styles/authStyle.css",
            "/styles/index.css",

            "/favicon.ico"
    );

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getServletPath();

        if (path.startsWith("/auth/")) {
            return true;
        }

        if (path.startsWith("/.well-known/")) {
            return true;
        }

        if(!PUBLIC_PATHS.contains(path)){
            Logger.debug("RES: "+PUBLIC_PATHS.contains(path)+" path: "+path);
        }
        return PUBLIC_PATHS.contains(path);
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        if (request.getCookies() == null) {
            Logger.error("Nenhum cookie encontrado");
            filterChain.doFilter(request, response);
            return;
        }

        Cookie authCookie = Arrays.stream(request.getCookies())
                .filter(c -> "AUTH_TOKEN".equals(c.getName()))
                .findFirst()
                .orElse(null);

        if (authCookie == null) {
            Logger.error("Nenhum cookie encontrado");
            filterChain.doFilter(request, response);
            return;
        }

        String token = authCookie.getValue();

        if (!jwtService.isTokenValid(token)) {
            filterChain.doFilter(request, response);
            Logger.error("Token invalido");
            return;
        }

        String username = jwtService.extractUsername(token);

        try {
            var userDetails = userDetailsService.loadUserByUsername(username);

            var auth = new UsernamePasswordAuthenticationToken(
                    userDetails,
                    null,
                    userDetails.getAuthorities()
            );

            auth.setDetails(
                    new WebAuthenticationDetailsSource().buildDetails(request)
            );

            SecurityContextHolder.getContext().setAuthentication(auth);
        }catch (Exception e){}

        filterChain.doFilter(request, response);
    }
}
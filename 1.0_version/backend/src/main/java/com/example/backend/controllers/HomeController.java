package com.example.backend.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @GetMapping("/")
    public String home() {
        return "index"; // sem .html
    }

    @GetMapping("/login")
    public String login(){return "loginPage";}

    @GetMapping("/register")
    public String register(){return "registerPage";}

    @GetMapping("/recover")
    public String recover(){
        return "recoverPage";
    }
}
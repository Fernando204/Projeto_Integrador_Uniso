package com.example.backend.controllers;

import com.example.backend.DTOs.DashboardDTO;
import com.example.backend.services.DashboardService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/dashboard")
public class DashboardController {
    private DashboardService dashboardService;

    public DashboardController(
            DashboardService dashboardService
    ){
        this.dashboardService = dashboardService;
    }

    @GetMapping
    public DashboardDTO getDashboard(@RequestParam Long companyId) {
        return dashboardService.getDashboard(companyId);
    }
}
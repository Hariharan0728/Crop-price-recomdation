package com.agri.controller;

import com.agri.model.PriceAlert;
import com.agri.service.AlertService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/alerts")
public class AlertController {

    @Autowired
    private AlertService alertService;

    @PostMapping("/create")
    public ResponseEntity<PriceAlert> createAlert(@RequestBody PriceAlert alert) {
        return ResponseEntity.ok(alertService.createAlert(alert));
    }

    @GetMapping("/active")
    public ResponseEntity<Map<String, List<PriceAlert>>> getActiveAlerts(@RequestParam String farmerId) {
        List<PriceAlert> alerts = alertService.getActiveAlerts(farmerId);
        Map<String, List<PriceAlert>> response = new HashMap<>();
        response.put("alerts", alerts);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{alertId}/dismiss")
    public ResponseEntity<Map<String, String>> dismissAlert(@PathVariable String alertId) {
        PriceAlert alert = alertService.dismissAlert(alertId);
        Map<String, String> response = new HashMap<>();
        if (alert != null) {
            response.put("status", "dismissed");
            return ResponseEntity.ok(response);
        }
        response.put("status", "error");
        return ResponseEntity.badRequest().body(response);
    }
}

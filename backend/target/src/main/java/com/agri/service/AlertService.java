package com.agri.service;

import com.agri.model.PriceAlert;
import com.agri.repository.PriceAlertRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class AlertService {

    @Autowired
    private PriceAlertRepository alertRepository;

    public PriceAlert createAlert(PriceAlert alert) {
        alert.setAlertId("ALT" + UUID.randomUUID().toString().substring(0, 5).toUpperCase());
        alert.setStatus("active");
        alert.setCreatedAt(LocalDateTime.now());
        return alertRepository.save(alert);
    }

    public List<PriceAlert> getActiveAlerts(String farmerId) {
        return alertRepository.findByFarmerIdAndStatus(farmerId, "active");
    }

    public PriceAlert dismissAlert(String alertId) {
        PriceAlert alert = alertRepository.findById(alertId).orElse(null);
        if (alert != null) {
            alert.setStatus("dismissed");
            alert.setDismissedAt(LocalDateTime.now());
            return alertRepository.save(alert);
        }
        return null;
    }
}

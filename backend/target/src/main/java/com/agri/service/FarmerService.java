package com.agri.service;

import com.agri.model.Farmer;
import com.agri.repository.FarmerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class FarmerService {

    @Autowired
    private FarmerRepository farmerRepository;

    public Farmer createFarmer(Farmer farmer) {
        // Generate unique 8-char ID
        String farmerId = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        farmer.setFarmerId(farmerId);
        farmer.setCreatedAt(LocalDateTime.now());
        farmer.setUpdatedAt(LocalDateTime.now());
        return farmerRepository.save(farmer);
    }

    public Farmer getFarmer(String farmerId) {
        return farmerRepository.findByFarmerId(farmerId).orElse(null);
    }

    public Farmer updateFarmer(String farmerId, Farmer updatedFarmer) {
        Farmer existing = getFarmer(farmerId);
        if (existing != null) {
            existing.setName(updatedFarmer.getName());
            existing.setLocation(updatedFarmer.getLocation());
            existing.setLandSize(updatedFarmer.getLandSize());
            existing.setWaterSource(updatedFarmer.getWaterSource());
            existing.setUpdatedAt(LocalDateTime.now());
            return farmerRepository.save(existing);
        }
        return null;
    }
}

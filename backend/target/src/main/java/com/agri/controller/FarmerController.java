package com.agri.controller;

import com.agri.model.Farmer;
import com.agri.service.FarmerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/farmer")
public class FarmerController {

    @Autowired
    private FarmerService farmerService;

    @PostMapping("/create")
    public ResponseEntity<Farmer> createFarmer(@RequestBody Farmer farmer) {
        return ResponseEntity.ok(farmerService.createFarmer(farmer));
    }

    @GetMapping("/{farmerId}")
    public ResponseEntity<Farmer> getFarmer(@PathVariable String farmerId) {
        Farmer farmer = farmerService.getFarmer(farmerId);
        if (farmer == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(farmer);
    }

    @PutMapping("/{farmerId}")
    public ResponseEntity<Farmer> updateFarmer(@PathVariable String farmerId, @RequestBody Farmer farmer) {
        Farmer updated = farmerService.updateFarmer(farmerId, farmer);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }
}

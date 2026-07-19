package com.agri.controller;

import com.agri.model.CropForecast;
import com.agri.model.CropRecommendationDto;
import com.agri.service.CropService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/crops")
public class CropController {

    @Autowired
    private CropService cropService;

    @GetMapping("/recommendations")
    public ResponseEntity<Map<String, List<CropRecommendationDto>>> getRecommendations(
            @RequestParam String farmerId,
            @RequestParam String location,
            @RequestParam String waterSource) {
        
        List<CropRecommendationDto> recommendations = cropService.getRecommendations(farmerId, location, waterSource);
        Map<String, List<CropRecommendationDto>> response = new HashMap<>();
        response.put("recommendations", recommendations);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{cropId}/forecast")
    public ResponseEntity<CropForecast> getForecast(
            @PathVariable String cropId,
            @RequestParam(required = false) String location) {
        
        CropForecast forecast = cropService.getForecast(cropId, location);
        if (forecast == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(forecast);
    }
}

package com.agri.service;

import com.agri.model.*;
import com.agri.repository.CropForecastRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class CropService {

    @Autowired
    private CropForecastRepository cropForecastRepository;

    @PostConstruct
    public void initMockData() {
        cropForecastRepository.deleteAll(); // Force clear existing corrupted data
        if (cropForecastRepository.count() == 0) {
            System.out.println("Initializing mock crop data...");
            List<CropForecast> mocks = new ArrayList<>();
            mocks.add(createMock("wheat", "Wheat", "🌾", 2650.0, 2850.0, "400-500mm",
                    Arrays.asList("Punjab", "Haryana", "UP", "Madhya Pradesh", "Rajasthan", "Maharashtra", "Gujarat"), 
                    "October-November", 120, 45.0, "High"));
            mocks.add(createMock("cotton", "Cotton", "🎀", 5800.0, 6200.0, "500-700mm",
                    Arrays.asList("Gujarat", "Maharashtra", "Telangana", "Andhra Pradesh", "Punjab", "Haryana", "Rajasthan"), 
                    "April-May", 160, 18.0, "High"));
            mocks.add(createMock("rice", "Rice", "🍚", 2450.0, 2600.0, "1200-1500mm",
                    Arrays.asList("Punjab", "West Bengal", "Odisha", "Tamil Nadu", "Uttar Pradesh", "Andhra Pradesh"), 
                    "June-July", 120, 50.0, "Very High"));
            mocks.add(createMock("maize", "Maize", "🌽", 1950.0, 2100.0, "350-500mm",
                    Arrays.asList("Rajasthan", "Madhya Pradesh", "Karnataka", "Telangana", "Punjab", "Uttar Pradesh", "Gujarat"), 
                    "March-April", 110, 40.0, "High"));
            mocks.add(createMock("sugarcane", "Sugarcane", "🍬", 335.0, 365.0, "1500-2250mm",
                    Arrays.asList("Uttar Pradesh", "Maharashtra", "Karnataka", "Tamil Nadu", "Punjab", "Andhra Pradesh"), 
                    "September-December", 300, 70.0, "Medium"));
            mocks.add(createMock("soybean", "Soybean", "🌱", 4600.0, 4850.0, "500-750mm",
                    Arrays.asList("Madhya Pradesh", "Maharashtra", "Rajasthan", "Karnataka", "Telangana"), 
                    "June-July", 100, 25.0, "High"));
            mocks.add(createMock("groundnut", "Groundnut", "🥜", 5200.0, 5600.0, "500-700mm",
                    Arrays.asList("Gujarat", "Rajasthan", "Tamil Nadu", "Andhra Pradesh", "Karnataka"), 
                    "June-July", 120, 20.0, "Medium"));
            mocks.add(createMock("tomato", "Tomato", "🍅", 1800.0, 2500.0, "600-800mm",
                    Arrays.asList("Andhra Pradesh", "Madhya Pradesh", "Karnataka", "Gujarat", "Odisha", "Tamil Nadu"), 
                    "June-August", 90, 250.0, "High"));
            mocks.add(createMock("potato", "Potato", "🥔", 1200.0, 1500.0, "500-700mm",
                    Arrays.asList("Uttar Pradesh", "West Bengal", "Bihar", "Gujarat", "Madhya Pradesh", "Punjab"), 
                    "October-November", 100, 220.0, "Medium"));
            mocks.add(createMock("onion", "Onion", "🧅", 1500.0, 2800.0, "350-600mm",
                    Arrays.asList("Maharashtra", "Madhya Pradesh", "Karnataka", "Gujarat", "Bihar", "Andhra Pradesh"), 
                    "August-October", 120, 160.0, "Very High"));
            
            cropForecastRepository.saveAll(mocks);
        }
    }

    private CropForecast createMock(String id, String name, String icon, double current, double forecast, 
                                    String water, List<String> regions, String season, int maturity, 
                                    double yield, String demand) {
        CropForecast c = new CropForecast();
        c.setCropId(id);
        c.setCropName(name);
        c.setIcon(icon);
        c.setCurrentPrice(current);
        c.setForecastPrice(forecast);
        c.setWaterNeeds(water);
        c.setSuitableRegions(regions);
        c.setPlantingSeason(season);
        c.setDaysToMaturity(maturity);
        c.setAverageYield(yield);
        c.setMarketDemand(demand);
        c.setLastUpdated(LocalDateTime.now());
        
        // Mock historical prices
        List<PricePoint> history = new ArrayList<>();
        PricePoint p1 = new PricePoint(); p1.setDate(LocalDate.now().minusDays(21)); p1.setPrice(current * 0.95); p1.setMandiName("Local"); history.add(p1);
        PricePoint p2 = new PricePoint(); p2.setDate(LocalDate.now().minusDays(14)); p2.setPrice(current * 0.97); p2.setMandiName("Local"); history.add(p2);
        PricePoint p3 = new PricePoint(); p3.setDate(LocalDate.now().minusDays(7)); p3.setPrice(current * 0.99); p3.setMandiName("Local"); history.add(p3);
        PricePoint p4 = new PricePoint(); p4.setDate(LocalDate.now()); p4.setPrice(current); p4.setMandiName("Local"); history.add(p4);
        c.setHistoricalPrices(history);
        
        // Mock forecasted prices
        List<ForecastPoint> forecasts = new ArrayList<>();
        ForecastPoint f1 = new ForecastPoint(); f1.setDate(LocalDate.now().plusMonths(1)); f1.setPredictedPrice(current + (forecast-current)*0.25); f1.setConfidence(85); forecasts.add(f1);
        ForecastPoint f2 = new ForecastPoint(); f2.setDate(LocalDate.now().plusMonths(2)); f2.setPredictedPrice(current + (forecast-current)*0.50); f2.setConfidence(82); forecasts.add(f2);
        ForecastPoint f3 = new ForecastPoint(); f3.setDate(LocalDate.now().plusMonths(4)); f3.setPredictedPrice(current + (forecast-current)*0.75); f3.setConfidence(78); forecasts.add(f3);
        ForecastPoint f4 = new ForecastPoint(); f4.setDate(LocalDate.now().plusMonths(6)); f4.setPredictedPrice(forecast); f4.setConfidence(75); forecasts.add(f4);
        c.setForecastedPrices(forecasts);
        
        return c;
    }

    public List<CropRecommendationDto> getRecommendations(String farmerId, String location, String waterSource) {
        List<CropForecast> allCrops = cropForecastRepository.findAll();
        List<CropRecommendationDto> recommendations = new ArrayList<>();

        for (CropForecast crop : allCrops) {
            // Check suitability by region match (case-insensitive partial)
            boolean regionMatch = crop.getSuitableRegions().stream()
                .anyMatch(r -> r.equalsIgnoreCase(location)
                    || (location != null && location.toLowerCase().contains(r.toLowerCase()))
                    || (location != null && r.toLowerCase().contains(location.toLowerCase())));

            // Calculate a score based on region match + market demand
            int score = 70;
            if (regionMatch) score += 20;
            if ("High".equals(crop.getMarketDemand())) score += 5;
            if ("Very High".equals(crop.getMarketDemand())) score += 10;

            // Water compatibility (basic logic)
            boolean waterMatch = true;
            if ("Rainwater".equalsIgnoreCase(waterSource) && ("rice".equals(crop.getCropId()) || "sugarcane".equals(crop.getCropId()))) {
                waterMatch = false;
            }
            if ("Groundwater".equalsIgnoreCase(waterSource) && ("rice".equals(crop.getCropId()) || "sugarcane".equals(crop.getCropId()))) {
                waterMatch = false;
            }
            if (!waterMatch) score -= 30;

            CropRecommendationDto dto = new CropRecommendationDto();
            dto.setCropId(crop.getCropId());
            dto.setCropName(crop.getCropName());
            dto.setIcon(crop.getIcon());
            dto.setCurrentPrice(crop.getCurrentPrice());
            dto.setForecastPrice(crop.getForecastPrice());
            dto.setWaterNeeds(crop.getWaterNeeds());
            dto.setSuitableRegions(crop.getSuitableRegions());
            dto.setSuitabilityScore(score);

            recommendations.add(dto);
        }

        recommendations.sort((a, b) -> b.getSuitabilityScore().compareTo(a.getSuitabilityScore()));
        return recommendations.stream().limit(5).collect(Collectors.toList());
    }

    public CropForecast getForecast(String cropId, String location) {
        return cropForecastRepository.findByCropId(cropId).orElse(null);
    }
}

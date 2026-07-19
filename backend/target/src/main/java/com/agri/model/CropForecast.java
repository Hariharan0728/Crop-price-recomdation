package com.agri.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Document(collection = "crop_forecasts")
public class CropForecast {
    @Id
    private String id;
    private String cropId;
    private String cropName;
    private String icon;
    private String location; // Could be state specific or general
    private Double currentPrice;
    private Double forecastPrice; // Next 6 month target
    
    private List<PricePoint> historicalPrices;
    private List<ForecastPoint> forecastedPrices;
    
    private List<String> suitableRegions;
    private String waterNeeds;
    private String plantingSeason;
    private Integer daysToMaturity;
    private Double averageYield;
    private String marketDemand;
    private LocalDateTime lastUpdated;
}

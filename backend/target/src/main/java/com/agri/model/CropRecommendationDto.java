package com.agri.model;

import lombok.Data;
import java.util.List;

@Data
public class CropRecommendationDto {
    private String cropId;
    private String cropName;
    private String icon;
    private Integer suitabilityScore;
    private Double currentPrice;
    private Double forecastPrice;
    private String waterNeeds;
    private List<String> suitableRegions;
}

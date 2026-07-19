package com.agri.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "price_alerts")
public class PriceAlert {
    @Id
    private String id;
    private String alertId;
    private String farmerId;
    private String cropId;
    private Double targetPrice;
    private String status; // active, triggered, dismissed
    private LocalDateTime createdAt;
    private LocalDateTime triggeredAt;
    private LocalDateTime dismissedAt;
    
    // Non-persistent helper fields for response
    private String cropName;
    private Double currentPrice;
}

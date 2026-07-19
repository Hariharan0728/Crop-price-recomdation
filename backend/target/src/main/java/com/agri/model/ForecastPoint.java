package com.agri.model;

import lombok.Data;

import java.time.LocalDate;

@Data
public class ForecastPoint {
    private LocalDate date;
    private Double price; // mapped to predictedPrice in some contexts
    private Double predictedPrice;
    private Integer confidence;
}

package com.agri.model;

import lombok.Data;

import java.time.LocalDate;

@Data
public class PricePoint {
    private LocalDate date;
    private Double price;
    private String mandiName;
}

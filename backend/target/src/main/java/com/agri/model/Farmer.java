package com.agri.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "farmers")
public class Farmer {
    @Id
    private String id;
    private String farmerId; // 8-char alphanumeric
    private String name;
    private String location;
    private Double landSize;
    private String waterSource;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

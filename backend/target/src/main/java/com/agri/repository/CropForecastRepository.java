package com.agri.repository;

import com.agri.model.CropForecast;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CropForecastRepository extends MongoRepository<CropForecast, String> {
    Optional<CropForecast> findByCropIdAndLocation(String cropId, String location);
    Optional<CropForecast> findByCropId(String cropId);
}

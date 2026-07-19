package com.agri.repository;

import com.agri.model.PriceAlert;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PriceAlertRepository extends MongoRepository<PriceAlert, String> {
    List<PriceAlert> findByFarmerIdAndStatus(String farmerId, String status);
    List<PriceAlert> findByCropIdAndStatus(String cropId, String status);
}

package com.agri.repository;

import com.agri.model.Farmer;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FarmerRepository extends MongoRepository<Farmer, String> {
    Optional<Farmer> findByFarmerId(String farmerId);
}

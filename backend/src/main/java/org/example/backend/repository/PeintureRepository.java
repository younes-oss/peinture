package org.example.backend.repository;

import org.example.backend.model.Peinture;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PeintureRepository extends JpaRepository<Peinture, Long> {
} 
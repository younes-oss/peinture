package org.example.backend.repository;

import org.example.backend.model.Artiste;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ArtisteRepository extends JpaRepository<Artiste, Long> {
} 
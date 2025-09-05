package org.example.backend.repository;

import org.example.backend.model.Artiste;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ArtisteRepository extends JpaRepository<Artiste, Long> {
    Optional<Artiste> findByEmail(String email);
} 
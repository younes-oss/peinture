package org.example.backend.repository;

import org.example.backend.model.Panier;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PanierRepository extends JpaRepository<Panier, Long> {
    Optional<Panier> findByClientEmail(String email);
}



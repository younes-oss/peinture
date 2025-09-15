package org.example.backend.repository;

import org.example.backend.model.Artiste;
import org.example.backend.model.Peinture;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PeintureRepository extends JpaRepository<Peinture, Long> {
    List<Peinture> findByCategorie(Peinture.Categorie categorie);
    List<Peinture> findByArtiste(Artiste artiste);
    
} 
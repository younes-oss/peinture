package org.example.backend.service;

import org.example.backend.dto.PeintureDto;
import org.example.backend.mapper.PeintureMapper;
import org.example.backend.model.Artiste;
import org.example.backend.model.Peinture;
import org.example.backend.model.User;
import org.example.backend.repository.ArtisteRepository;
import org.example.backend.repository.PeintureRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class PeintureService {
    private final PeintureRepository peintureRepository;
    private final ArtisteRepository artisteRepository;
    private final PeintureMapper peintureMapper;

    public PeintureService(PeintureRepository peintureRepository, ArtisteRepository artisteRepository, PeintureMapper peintureMapper) {
        this.peintureRepository = peintureRepository;
        this.artisteRepository = artisteRepository;
        this.peintureMapper = peintureMapper;
    }

    // Créer une nouvelle peinture
    public PeintureDto createPeinture(PeintureDto dto) {
        // Récupérer l'utilisateur connecté
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = auth.getName();
        
        // Trouver l'artiste connecté
        Artiste artiste = artisteRepository.findByEmail(userEmail)
            .orElseThrow(() -> new RuntimeException("Artiste non trouvé"));

        // Convertir le DTO en entité (le mapper ignore id, dateCreation, artiste, categorie)
        Peinture peinture = peintureMapper.toEntity(dto);
        
        // Gérer manuellement les champs ignorés par le mapper
        peinture.setArtiste(artiste);
        peinture.setDateCreation(new Date());
        
        // Convertir la catégorie string en enum
        if (dto.getCategorie() != null) {
            try {
                peinture.setCategorie(Peinture.Categorie.valueOf(dto.getCategorie()));
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Catégorie invalide: " + dto.getCategorie());
            }
        }

        Peinture saved = peintureRepository.save(peinture);
        return peintureMapper.toDto(saved);
    }

    // Trouver une peinture par ID
    public PeintureDto findById(Long id) {
        Peinture peinture = peintureRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Peinture non trouvée"));
        return peintureMapper.toDto(peinture);
    }

    // Trouver toutes les peintures
    public List<PeintureDto> findAll() {
        List<Peinture> peintures = peintureRepository.findAll();
        return peintures.stream()
            .map(peintureMapper::toDto)
            .toList();
    }

    // Trouver les peintures de l'artiste connecté
    public List<PeintureDto> findByCurrentArtiste() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String userEmail = auth.getName();
            
            System.out.println("Finding artworks for user: " + userEmail);
            
            Artiste currentArtiste = artisteRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Artiste non trouvé"));
            
            System.out.println("Found artist: " + currentArtiste.getId() + " - " + currentArtiste.getPrenom() + " " + currentArtiste.getNom());
            
            List<Peinture> peintures = peintureRepository.findByArtiste(currentArtiste);
            System.out.println("Found " + peintures.size() + " artworks for this artist");
            
            // Debug: also check all artworks in database
            List<Peinture> allPeintures = peintureRepository.findAll();
            System.out.println("Total artworks in database: " + allPeintures.size());
            
            for (Peinture p : allPeintures) {
                System.out.println("Artwork: " + p.getTitre() + " - Artist ID: " + 
                    (p.getArtiste() != null ? p.getArtiste().getId() : "null") + 
                    " - Artist Email: " + 
                    (p.getArtiste() != null ? p.getArtiste().getEmail() : "null"));
            }
            
            return peintures.stream()
                .map(peintureMapper::toDto)
                .toList();
        } catch (Exception e) {
            System.err.println("Error in findByCurrentArtiste: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    // Mettre à jour une peinture
    public PeintureDto updatePeinture(Long id, PeintureDto dto) {
        Peinture existing = peintureRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Peinture non trouvée"));

        // Vérifier que l'artiste connecté est propriétaire de cette peinture
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = auth.getName();
        
        Artiste currentArtiste = artisteRepository.findByEmail(userEmail)
            .orElseThrow(() -> new RuntimeException("Artiste non trouvé"));
        
        if (!existing.getArtiste().getId().equals(currentArtiste.getId())) {
            throw new RuntimeException("Vous ne pouvez modifier que vos propres œuvres");
        }

        // Convertir le DTO en entité (le mapper ignore id, dateCreation, artiste, categorie)
        Peinture updated = peintureMapper.toEntity(dto);
        
        // Copier les champs modifiables
        existing.setTitre(updated.getTitre());
        existing.setDescription(updated.getDescription());
        existing.setPrix(updated.getPrix());
        existing.setStock(updated.getStock());
        existing.setImageUrl(updated.getImageUrl());
        existing.setDisponible(updated.isDisponible());

        // Gérer la catégorie si elle a changé
        if (dto.getCategorie() != null) {
            try {
                existing.setCategorie(Peinture.Categorie.valueOf(dto.getCategorie()));
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Catégorie invalide: " + dto.getCategorie());
            }
        }

        Peinture saved = peintureRepository.save(existing);
        return peintureMapper.toDto(saved);
    }

    // Supprimer une peinture
    public void deletePeinture(Long id) {
        Peinture existing = peintureRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Peinture non trouvée"));
        
        // Vérifier que l'artiste connecté est propriétaire de cette peinture
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = auth.getName();
        
        Artiste currentArtiste = artisteRepository.findByEmail(userEmail)
            .orElseThrow(() -> new RuntimeException("Artiste non trouvé"));
        
        if (!existing.getArtiste().getId().equals(currentArtiste.getId())) {
            throw new RuntimeException("Vous ne pouvez supprimer que vos propres œuvres");
        }
        
        peintureRepository.deleteById(id);
    }





}  
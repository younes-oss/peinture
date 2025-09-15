package org.example.backend.service;

import org.example.backend.dto.ArtisteDto;
import org.example.backend.mapper.ArtisteMapper;
import org.example.backend.model.Artiste;
import org.example.backend.repository.ArtisteRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ArtisteService {
    private final ArtisteRepository artisteRepository;
    private final ArtisteMapper artisteMapper;

    public ArtisteService(ArtisteRepository artisteRepository, ArtisteMapper artisteMapper) {
        this.artisteRepository = artisteRepository;
        this.artisteMapper = artisteMapper;
    }

    // Récupérer tous les artistes
    public List<ArtisteDto> findAll() {
        List<Artiste> artistes = artisteRepository.findAll();
        return artistes.stream()
            .map(artisteMapper::toDto)
            .toList();
    }

    // Récupérer un artiste par ID
    public ArtisteDto findById(Long id) {
        Artiste artiste = artisteRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Artiste non trouvé"));
        return artisteMapper.toDto(artiste);
    }

    // Récupérer un artiste par email
    public ArtisteDto findByEmail(String email) {
        Artiste artiste = artisteRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Artiste non trouvé"));
        return artisteMapper.toDto(artiste);
    }

    // Mettre à jour les informations d'un artiste
    public ArtisteDto updateArtiste(Long id, ArtisteDto dto) {
        Artiste existing = artisteRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Artiste non trouvé"));

        // Mettre à jour les champs modifiables
        if (dto.getBiographie() != null) {
            existing.setBiographie(dto.getBiographie());
        }
        if (dto.getBoutique() != null) {
            existing.setBoutique(dto.getBoutique());
        }
        if (dto.getSpecialite() != null) {
            existing.setSpecialite(dto.getSpecialite());
        }
        if (dto.getPays() != null) {
            existing.setPays(dto.getPays());
        }
        if (dto.getVille() != null) {
            existing.setVille(dto.getVille());
        }

        Artiste saved = artisteRepository.save(existing);
        return artisteMapper.toDto(saved);
    }
}
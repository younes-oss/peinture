package org.example.backend.service;

import org.example.backend.dto.PeintureDto;
import org.example.backend.mapper.PeintureMapper;
import org.example.backend.model.Artiste;
import org.example.backend.model.Peinture;
import org.example.backend.repository.ArtisteRepository;
import org.example.backend.repository.PeintureRepository;
import org.springframework.stereotype.Service;

import java.util.Date;

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

    public PeintureDto createPeinture(PeintureDto dto) {
        Artiste artiste = artisteRepository.findById(dto.getArtisteId())
            .orElseThrow(() -> new RuntimeException("Artiste non trouvé"));

        Peinture peinture = peintureMapper.toEntity(dto);
        peinture.setArtiste(artiste);
        peinture.setDateCreation(new Date());

        Peinture saved = peintureRepository.save(peinture);
        return peintureMapper.toDto(saved);
    }
} 
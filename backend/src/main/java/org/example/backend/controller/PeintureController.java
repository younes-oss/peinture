package org.example.backend.controller;

import org.example.backend.dto.PeintureDto;
import org.example.backend.service.PeintureService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/peintures")
public class PeintureController {
    private final PeintureService peintureService;

    public PeintureController(PeintureService peintureService) {
        this.peintureService = peintureService;
    }

    @PostMapping
    public ResponseEntity<?> createPeinture(@RequestBody PeintureDto dto) {
        // Vérifier si l'utilisateur est connecté
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("Vous devez être connecté pour créer une peinture");
        }

        // Vérifier si l'utilisateur est un artiste
        boolean isArtiste = auth.getAuthorities().stream()
            .anyMatch(authority -> authority.getAuthority().equals("ROLE_ARTISTE"));

        if (!isArtiste) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body("Seuls les artistes peuvent créer des peintures");
        }

        // Si c'est un artiste, créer la peinture
        try {
            PeintureDto created = peintureService.createPeinture(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("Erreur lors de la création: " + e.getMessage());
        }
    }

    // Lister toutes les peintures (accessible à tous)
    @GetMapping
    public ResponseEntity<?> getAllPeintures() {
        try {
            return ResponseEntity.ok(peintureService.findAll());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Erreur lors de la récupération des peintures: " + e.getMessage());
        }
    }
} 
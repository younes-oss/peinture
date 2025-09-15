package org.example.backend.controller;

import org.example.backend.dto.PeintureDto;
import org.example.backend.service.PeintureService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/peintures")
@CrossOrigin(origins = "*")
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

    // Lister les peintures de l'artiste connecté (réservé aux artistes)
    @GetMapping("/my-artworks")
    public ResponseEntity<?> getMyArtworks() {
        System.out.println("GET /my-artworks endpoint called");
        
        // Vérifier si l'utilisateur est connecté
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            System.out.println("User not authenticated");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("Vous devez être connecté pour voir vos œuvres");
        }

        System.out.println("User authenticated: " + auth.getName());
        System.out.println("User authorities: " + auth.getAuthorities());

        // Vérifier si l'utilisateur est un artiste
        boolean isArtiste = auth.getAuthorities().stream()
            .anyMatch(authority -> authority.getAuthority().equals("ROLE_ARTISTE"));

        if (!isArtiste) {
            System.out.println("User is not an artist");
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body("Seuls les artistes peuvent voir leurs œuvres");
        }

        System.out.println("User is an artist, fetching artworks...");
        
        try {
            List<PeintureDto> artworks = peintureService.findByCurrentArtiste();
            System.out.println("Returning " + artworks.size() + " artworks");
            return ResponseEntity.ok(artworks);
        } catch (Exception e) {
            System.err.println("Error fetching artworks: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Erreur lors de la récupération de vos œuvres: " + e.getMessage());
        }
    }

    // Récupérer une peinture par ID (accessible à tous)
    @GetMapping("/{id}")
    public ResponseEntity<?> getPeintureById(@PathVariable Long id) {
        try {
            PeintureDto peinture = peintureService.findById(id);
            return ResponseEntity.ok(peinture);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("Peinture non trouvée: " + e.getMessage());
        }
    }

    // Modifier une peinture (réservé aux artistes)
    @PutMapping("/{id}")
    public ResponseEntity<?> updatePeinture(@PathVariable Long id, @RequestBody PeintureDto dto) {
        // Vérifier si l'utilisateur est connecté
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("Vous devez être connecté pour modifier une peinture");
        }

        // Vérifier si l'utilisateur est un artiste
        boolean isArtiste = auth.getAuthorities().stream()
            .anyMatch(authority -> authority.getAuthority().equals("ROLE_ARTISTE"));

        if (!isArtiste) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body("Seuls les artistes peuvent modifier des peintures");
        }

        try {
            PeintureDto updated = peintureService.updatePeinture(id, dto);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("Erreur lors de la modification: " + e.getMessage());
        }
    }

    // Supprimer une peinture (réservé aux artistes)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePeinture(@PathVariable Long id) {
        // Vérifier si l'utilisateur est connecté
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("Vous devez être connecté pour supprimer une peinture");
        }

        // Vérifier si l'utilisateur est un artiste
        boolean isArtiste = auth.getAuthorities().stream()
            .anyMatch(authority -> authority.getAuthority().equals("ROLE_ARTISTE"));

        if (!isArtiste) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body("Seuls les artistes peuvent supprimer des peintures");
        }

        try {
            peintureService.deletePeinture(id);
            return ResponseEntity.ok("Peinture supprimée avec succès");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("Erreur lors de la suppression: " + e.getMessage());
        }
    }
}
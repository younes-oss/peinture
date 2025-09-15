package org.example.backend.controller;

import org.example.backend.dto.ArtisteDto;
import org.example.backend.service.ArtisteService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/artistes")
@CrossOrigin(origins = "*")
public class ArtisteController {
    private final ArtisteService artisteService;

    public ArtisteController(ArtisteService artisteService) {
        this.artisteService = artisteService;
    }

    // Lister tous les artistes (accessible à tous)
    @GetMapping
    public ResponseEntity<?> getAllArtistes() {
        try {
            return ResponseEntity.ok(artisteService.findAll());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Erreur lors de la récupération des artistes: " + e.getMessage());
        }
    }

    // Récupérer un artiste par ID (accessible à tous)
    @GetMapping("/{id}")
    public ResponseEntity<?> getArtisteById(@PathVariable Long id) {
        try {
            ArtisteDto artiste = artisteService.findById(id);
            return ResponseEntity.ok(artiste);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("Artiste non trouvé: " + e.getMessage());
        }
    }

    // Mettre à jour un artiste
    @PutMapping("/{id}")
    public ResponseEntity<?> updateArtiste(@PathVariable Long id, @RequestBody ArtisteDto dto) {
        try {
            ArtisteDto updated = artisteService.updateArtiste(id, dto);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("Erreur lors de la modification: " + e.getMessage());
        }
    }
}
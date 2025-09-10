package org.example.backend.controller;

import org.example.backend.dto.PanierDto;
import org.example.backend.service.PanierService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/panier")
@CrossOrigin(origins = "*")
public class PanierController {
    private final PanierService panierService;

    public PanierController(PanierService panierService) {
        this.panierService = panierService;
    }

    @GetMapping
    public ResponseEntity<PanierDto> getMyPanier() {
        return ResponseEntity.ok(panierService.getMyPanier());
    }

    @PostMapping("/add")
    public ResponseEntity<PanierDto> addItem(@RequestParam Long peintureId, @RequestParam(defaultValue = "1") Integer quantite) {
        return ResponseEntity.ok(panierService.addItem(peintureId, quantite));
    }

    @PutMapping("/update")
    public ResponseEntity<PanierDto> updateQuantity(@RequestParam Long peintureId, @RequestParam Integer quantite) {
        return ResponseEntity.ok(panierService.updateQuantity(peintureId, quantite));
    }

    @DeleteMapping("/remove")
    public ResponseEntity<PanierDto> removeItem(@RequestParam Long peintureId) {
        return ResponseEntity.ok(panierService.removeItem(peintureId));
    }

    @DeleteMapping("/clear")
    public ResponseEntity<Void> clear() {
        panierService.clear();
        return ResponseEntity.noContent().build();
    }
}



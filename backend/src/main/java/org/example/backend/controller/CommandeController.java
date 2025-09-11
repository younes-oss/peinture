package org.example.backend.controller;

import org.example.backend.dto.CommandeDto;
import org.example.backend.dto.CreerCommandeRequest;
import org.example.backend.service.CommandeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/commandes")
@CrossOrigin(origins = "*")
public class CommandeController {

    @Autowired
    private CommandeService commandeService;

    /**
     * Créer une nouvelle commande à partir du panier
     * POST /api/commandes
     */
    @PostMapping
    public ResponseEntity<?> creerCommande(@RequestBody CreerCommandeRequest request) {
        try {
            // Vérifier que l'utilisateur est connecté
            if (!estConnecte()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Vous devez être connecté pour passer une commande");
            }

            CommandeDto commande = commandeService.creerCommande(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(commande);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("Erreur lors de la création de la commande: " + e.getMessage());
        }
    }

    /**
     * Récupérer toutes mes commandes
     * GET /api/commandes
     */
    @GetMapping
    public ResponseEntity<?> getMesCommandes() {
        try {
            // Vérifier que l'utilisateur est connecté
            if (!estConnecte()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Vous devez être connecté pour voir vos commandes");
            }

            List<CommandeDto> commandes = commandeService.getMesCommandes();
            return ResponseEntity.ok(commandes);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Erreur lors de la récupération des commandes: " + e.getMessage());
        }
    }

    /**
     * Récupérer une commande par ID
     * GET /api/commandes/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getCommandeById(@PathVariable Long id) {
        try {
            // Vérifier que l'utilisateur est connecté
            if (!estConnecte()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Vous devez être connecté pour voir cette commande");
            }

            CommandeDto commande = commandeService.getCommandeById(id);
            return ResponseEntity.ok(commande);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("Commande non trouvée: " + e.getMessage());
        }
    }

    /**
     * Annuler une commande
     * PUT /api/commandes/{id}/annuler
     */
    @PutMapping("/{id}/annuler")
    public ResponseEntity<?> annulerCommande(@PathVariable Long id) {
        try {
            // Vérifier que l'utilisateur est connecté
            if (!estConnecte()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Vous devez être connecté pour annuler une commande");
            }

            CommandeDto commande = commandeService.annulerCommande(id);
            return ResponseEntity.ok(commande);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("Erreur lors de l'annulation: " + e.getMessage());
        }
    }

    /**
     * Récupérer toutes les commandes (pour les administrateurs)
     * GET /api/commandes/admin/toutes
     */
    @GetMapping("/admin/toutes")
    public ResponseEntity<?> getToutesLesCommandes() {
        try {
            // Vérifier que l'utilisateur est admin
            if (!estAdmin()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Accès réservé aux administrateurs");
            }

            List<CommandeDto> commandes = commandeService.getToutesLesCommandes();
            return ResponseEntity.ok(commandes);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Erreur lors de la récupération des commandes: " + e.getMessage());
        }
    }

    /**
     * Mettre à jour le statut d'une commande (pour les administrateurs)
     * PUT /api/commandes/admin/{id}/statut
     */
    @PutMapping("/admin/{id}/statut")
    public ResponseEntity<?> mettreAJourStatut(@PathVariable Long id, @RequestParam String statut) {
        try {
            // Vérifier que l'utilisateur est admin
            if (!estAdmin()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Accès réservé aux administrateurs");
            }

            CommandeDto commande = commandeService.mettreAJourStatut(id, statut);
            return ResponseEntity.ok(commande);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("Erreur lors de la mise à jour: " + e.getMessage());
        }
    }

    /**
     * Méthode utilitaire pour vérifier si l'utilisateur est connecté
     */
    private boolean estConnecte() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth != null && auth.isAuthenticated() && !auth.getName().equals("anonymousUser");
    }

    /**
     * Méthode utilitaire pour vérifier si l'utilisateur est administrateur
     */
    private boolean estAdmin() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return false;
        }

        return auth.getAuthorities().stream()
            .anyMatch(authority -> authority.getAuthority().equals("ROLE_ADMIN"));
    }
}
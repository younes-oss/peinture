package org.example.backend.service;

import org.example.backend.dto.PanierDto;
import org.example.backend.mapper.PanierMapper;
import org.example.backend.model.Client;
import org.example.backend.model.Panier;
import org.example.backend.model.PanierItem;
import org.example.backend.model.Peinture;
import org.example.backend.repository.ClientRepository;
import org.example.backend.repository.PanierRepository;
import org.example.backend.repository.PeintureRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Optional;

@Service
public class PanierService {
    private final PanierRepository panierRepository;
    private final ClientRepository clientRepository;
    private final PeintureRepository peintureRepository;
    private final PanierMapper panierMapper;

    public PanierService(PanierRepository panierRepository, ClientRepository clientRepository, PeintureRepository peintureRepository, PanierMapper panierMapper) {
        this.panierRepository = panierRepository;
        this.clientRepository = clientRepository;
        this.peintureRepository = peintureRepository;
        this.panierMapper = panierMapper;
    }

    public PanierDto getMyPanier() {
        Panier panier = findOrCreatePanierForCurrentClient();
        return panierMapper.toDto(panier);
    }

    public PanierDto addItem(Long peintureId, Integer quantite) {
        Panier panier = findOrCreatePanierForCurrentClient();

        Peinture peinture = peintureRepository.findById(peintureId)
                .orElseThrow(() -> new RuntimeException("Peinture non trouvée"));

        if (quantite == null || quantite <= 0) quantite = 1;

        // Chercher si ligne existe déjà
        Optional<PanierItem> existing = panier.getItems() != null
                ? panier.getItems().stream().filter(l -> l.getPeintureId().equals(peintureId)).findFirst()
                : Optional.empty();

        PanierItem ligne;
        if (existing.isPresent()) {
            ligne = existing.get();
            ligne.setQuantite(ligne.getQuantite() + quantite);
            ligne.setPrixUnitaire(peinture.getPrix());
        } else {
            ligne = new PanierItem();
            ligne.setPeintureId(peinture.getId());
            ligne.setPeintureTitre(peinture.getTitre());
            ligne.setImageUrl(peinture.getImageUrl());
            ligne.setQuantite(quantite);
            ligne.setPrixUnitaire(peinture.getPrix());
            if (panier.getItems() == null) panier.setItems(new ArrayList<>());
            panier.getItems().add(ligne);
        }

        recalc(panier);
        panierRepository.save(panier);
        return panierMapper.toDto(panier);
    }

    public PanierDto updateQuantity(Long peintureId, Integer quantite) {
        if (quantite == null || quantite <= 0) throw new RuntimeException("Quantité invalide");
        Panier panier = findOrCreatePanierForCurrentClient();
        PanierItem ligne = panier.getItems().stream()
                .filter(l -> l.getPeintureId().equals(peintureId))
                .findFirst().orElseThrow(() -> new RuntimeException("Article non trouvé"));

        ligne.setQuantite(quantite);
        recalc(panier);
        panierRepository.save(panier);
        return panierMapper.toDto(panier);
    }

    public PanierDto removeItem(Long peintureId) {
        Panier panier = findOrCreatePanierForCurrentClient();
        panier.getItems().removeIf(l -> l.getPeintureId().equals(peintureId));
        recalc(panier);
        panierRepository.save(panier);
        return panierMapper.toDto(panier);
    }

    public void clear() {
        Panier panier = findOrCreatePanierForCurrentClient();
        if (panier.getItems() != null) panier.getItems().clear();
        recalc(panier);
        panierRepository.save(panier);
    }

    private Panier findOrCreatePanierForCurrentClient() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();

        Client client = clientRepository.findAll().stream()
                .filter(c -> email.equals(c.getEmail()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Client non trouvé"));

        return panierRepository.findByClientEmail(email)
                .orElseGet(() -> {
                    Panier p = new Panier();
                    p.setClient(client);
                    p.setNombreArticles(0);
                    p.setTotal(0.0);
                    return panierRepository.save(p);
                });
    }

    private void recalc(Panier panier) {
        double total = 0.0;
        int count = 0;
        if (panier.getItems() != null) {
            for (PanierItem l : panier.getItems()) {
                if (l.getPrixUnitaire() != null && l.getQuantite() != null) {
                    l.setPrixTotal(l.getPrixUnitaire() * l.getQuantite());
                    total += l.getPrixTotal();
                    count += l.getQuantite();
                }
            }
        }
        panier.setTotal(total);
        panier.setNombreArticles(count);
    }
}



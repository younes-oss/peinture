package org.example.backend.service;

import org.example.backend.dto.CommandeDto;
import org.example.backend.dto.CreerCommandeRequest;
import org.example.backend.dto.PanierDto;
import org.example.backend.mapper.CommandeMapper;
import org.example.backend.model.Client;
import org.example.backend.model.Commande;
import org.example.backend.model.User;
import org.example.backend.repository.ClientRepository;
import org.example.backend.repository.CommandeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CommandeService {

    @Autowired
    private CommandeRepository commandeRepository;
    
    @Autowired
    private ClientRepository clientRepository;
    
    @Autowired
    private CommandeMapper commandeMapper;
    
    @Autowired
    private PanierService panierService;

    /**
     * Créer une nouvelle commande à partir du panier du client connecté
     */
    public CommandeDto creerCommande(CreerCommandeRequest request) {
        // 1. Récupérer le client connecté
        Client client = getClientConnecte();
        
        // 2. Récupérer le panier du client
        PanierDto panier = panierService.getMyPanier();
        
        // 3. Vérifier que le panier n'est pas vide
        if (panier.getItems().isEmpty()) {
            throw new RuntimeException("Le panier est vide");
        }
        
        // 4. Créer la commande
        Commande commande = new Commande();
        commande.setClient(client);
        commande.setArticles(panier.getItems().stream()
            .map(item -> new org.example.backend.model.PanierItem(
                item.getPeintureId(),
                item.getPeintureTitre(),
                item.getImageUrl(),
                item.getQuantite(),
                item.getPrixUnitaire(),
                item.getPrixTotal()
            ))
            .collect(Collectors.toList()));
        commande.setTotal(panier.getTotal());
        commande.setAdresseLivraison(request.getAdresseLivraison());
        commande.setCommentaire(request.getCommentaire());
        commande.setStatut(Commande.StatutCommande.EN_COURS);
        
        // 5. Sauvegarder la commande
        Commande commandeSauvee = commandeRepository.save(commande);
        
        // 6. Vider le panier après la commande
        panierService.clear();
        
        // 7. Retourner la commande en DTO
        return commandeMapper.toDto(commandeSauvee);
    }

    /**
     * Récupérer toutes les commandes du client connecté
     */
    public List<CommandeDto> getMesCommandes() {
        Client client = getClientConnecte();
        List<Commande> commandes = commandeRepository.findByClient(client);
        return commandes.stream()
                .map(commandeMapper::toDto)
                .collect(Collectors.toList());
    }

    /**
     * Récupérer une commande par ID (seulement si elle appartient au client connecté)
     */
    public CommandeDto getCommandeById(Long id) {
        Client client = getClientConnecte();
        Optional<Commande> commande = commandeRepository.findById(id);
        
        if (commande.isEmpty()) {
            throw new RuntimeException("Commande non trouvée");
        }
        
        // Vérifier que la commande appartient bien au client connecté
        if (!commande.get().getClient().getId().equals(client.getId())) {
            throw new RuntimeException("Vous n'avez pas accès à cette commande");
        }
        
        return commandeMapper.toDto(commande.get());
    }

    /**
     * Annuler une commande (seulement si elle est EN_COURS)
     */
    public CommandeDto annulerCommande(Long id) {
        Client client = getClientConnecte();
        Optional<Commande> commandeOpt = commandeRepository.findById(id);
        
        if (commandeOpt.isEmpty()) {
            throw new RuntimeException("Commande non trouvée");
        }
        
        Commande commande = commandeOpt.get();
        
        // Vérifier que la commande appartient au client connecté
        if (!commande.getClient().getId().equals(client.getId())) {
            throw new RuntimeException("Vous n'avez pas accès à cette commande");
        }
        
        // Vérifier que la commande peut être annulée
        if (commande.getStatut() != Commande.StatutCommande.EN_COURS) {
            throw new RuntimeException("Cette commande ne peut plus être annulée");
        }
        
        // Annuler la commande
        commande.setStatut(Commande.StatutCommande.ANNULEE);
        Commande commandeSauvee = commandeRepository.save(commande);
        
        return commandeMapper.toDto(commandeSauvee);
    }

    /**
     * Récupérer toutes les commandes (pour les administrateurs)
     */
    public List<CommandeDto> getToutesLesCommandes() {
        List<Commande> commandes = commandeRepository.findAll();
        return commandes.stream()
                .map(commandeMapper::toDto)
                .collect(Collectors.toList());
    }

    /**
     * Mettre à jour le statut d'une commande (pour les administrateurs)
     */
    public CommandeDto mettreAJourStatut(Long id, String nouveauStatut) {
        Optional<Commande> commandeOpt = commandeRepository.findById(id);
        
        if (commandeOpt.isEmpty()) {
            throw new RuntimeException("Commande non trouvée");
        }
        
        Commande commande = commandeOpt.get();
        
        try {
            Commande.StatutCommande statut = Commande.StatutCommande.valueOf(nouveauStatut);
            commande.setStatut(statut);
            
            // Si la commande est expédiée, on peut mettre la date de livraison
            if (statut == Commande.StatutCommande.LIVREE) {
                commande.setDateLivraison(new java.util.Date());
            }
            
            Commande commandeSauvee = commandeRepository.save(commande);
            return commandeMapper.toDto(commandeSauvee);
            
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Statut invalide: " + nouveauStatut);
        }
    }

    /**
     * Méthode utilitaire pour récupérer le client connecté
     */
    private Client getClientConnecte() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new RuntimeException("Vous devez être connecté");
        }
        
        String email = auth.getName();
        Optional<Client> client = clientRepository.findByEmail(email);
        
        if (client.isEmpty()) {
            throw new RuntimeException("Client non trouvé");
        }
        
        return client.get();
    }
}
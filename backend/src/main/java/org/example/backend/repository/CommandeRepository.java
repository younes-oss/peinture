package org.example.backend.repository;

import org.example.backend.model.Commande;
import org.example.backend.model.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommandeRepository extends JpaRepository<Commande, Long> {
    
    // Trouver toutes les commandes d'un client
    List<Commande> findByClient(Client client);
    
    // Trouver les commandes d'un client par son ID
    List<Commande> findByClientId(Long clientId);
    
    // Trouver les commandes par statut
    List<Commande> findByStatut(Commande.StatutCommande statut);
    
    // Trouver les commandes d'un client par statut
    List<Commande> findByClientIdAndStatut(Long clientId, Commande.StatutCommande statut);
}
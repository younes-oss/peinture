package org.example.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Commande {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;
    
    @OneToMany(mappedBy = "commande", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private List<LigneCommande> lignes;
    
    @Column(nullable = false)
    private Double total;
    
    @Enumerated(EnumType.STRING)
    private StatutCommande statut = StatutCommande.EN_COURS;
    
    @Temporal(TemporalType.TIMESTAMP)
    private java.util.Date dateCommande;
    
    @Temporal(TemporalType.TIMESTAMP)
    private java.util.Date dateLivraison;
    
    private String adresseLivraison;
    
    private String commentaire;
    
    public enum StatutCommande {
        EN_COURS, EXPEDIEE, LIVREE, ANNULEE
    }
    
    @PrePersist
    protected void onCreate() {
        dateCommande = new java.util.Date();
    }
}

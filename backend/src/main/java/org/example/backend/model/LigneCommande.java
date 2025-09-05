package org.example.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LigneCommande {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "peinture_id", nullable = false)
    private Peinture peinture;
    
    @Column(nullable = false)
    private Integer quantite;
    
    @Column(nullable = false)
    private Double prixUnitaire;
    
    @Column(nullable = false)
    private Double prixTotal;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "panier_id")
    private Panier panier;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "commande_id")
    private Commande commande;
    
    @PrePersist
    @PreUpdate
    protected void calculateTotal() {
        if (prixUnitaire != null && quantite != null) {
            prixTotal = prixUnitaire * quantite;
        }
    }
}

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
public class Panier {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;
    
    @OneToMany(mappedBy = "panier", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private List<LigneCommande> lignes;
    
    private Double total = 0.0;
    
    private Integer nombreArticles = 0;
    
    @Temporal(TemporalType.TIMESTAMP)
    private java.util.Date dateCreation;
    
    @Temporal(TemporalType.TIMESTAMP)
    private java.util.Date dateModification;
    
    @PrePersist
    protected void onCreate() {
        dateCreation = new java.util.Date();
        dateModification = new java.util.Date();
    }
    
    @PreUpdate
    protected void onUpdate() {
        dateModification = new java.util.Date();
    }
}

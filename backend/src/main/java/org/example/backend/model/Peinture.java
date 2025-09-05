package org.example.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.Date;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Peinture {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(nullable = false)
    private String titre;
    
    @Column(length = 2000)
    private String description;
    
    @Column(nullable = false)
    private Double prix;
    
    @Column(nullable = false)
    private Integer stock;
    
    @Column
    private String imageUrl;
    
    @Temporal(TemporalType.TIMESTAMP)
    private Date dateCreation;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "artiste_id", nullable = false)
    private Artiste artiste;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Categorie categorie;
    
    
    
    private boolean disponible = true;
    
    public enum Categorie {
        IMPRESSIONNISME("Impressionnisme"),
        POST_IMPRESSIONNISME("Post-impressionnisme"),
        SURREALISME("Surréalisme"),
        ABSTRACTION("Abstraction"),
        REALISME("Réalisme"),
        CONTEMPORAIN("Contemporain"),
        CLASSIQUE("Classique"),
        MODERNE("Moderne");
        
        private final String libelle;
        
        Categorie(String libelle) {
            this.libelle = libelle;
        }

        public String getLibelle() {
            return libelle;
        }

    }
    
    @PrePersist
    protected void onCreate() {
        dateCreation = new Date();
    }
}

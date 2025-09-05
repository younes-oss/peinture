package org.example.backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PeintureDto {
    private Long id;
    private String titre;
    private String description;
    private Double prix;
    private Integer stock;
    private String imageUrl;
    private Date dateCreation;
    private ArtisteDto artiste;
    private String categorie;
    private String categorieLibelle;
    private boolean disponible;
} 
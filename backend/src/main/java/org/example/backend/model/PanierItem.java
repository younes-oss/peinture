package org.example.backend.model;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PanierItem {
    private Long peintureId;
    private String peintureTitre;
    private String imageUrl;
    private Integer quantite;
    private Double prixUnitaire;
    private Double prixTotal;
}



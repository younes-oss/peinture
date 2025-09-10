package org.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PanierItemDto {
    private Long peintureId;
    private String peintureTitre;
    private String imageUrl;
    private Integer quantite;
    private Double prixUnitaire;
    private Double prixTotal;
}



package org.example.backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommandeDto {
    private Long id;
    private Long clientId;
    private String clientNom;
    private String clientPrenom;
    private List<PanierItemDto> articles;
    private Double total;
    private String statut;
    private Date dateCommande;
    private Date dateLivraison;
    private String adresseLivraison;
    private String commentaire;
}
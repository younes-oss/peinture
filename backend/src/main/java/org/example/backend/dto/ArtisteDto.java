package org.example.backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ArtisteDto {
    private Long id;
    private String nom;
    private String prenom;
    private String email;
    private String biographie;
    private String boutique;
    private String specialite;
    private String pays;
    private String ville;
    private Integer nombreOeuvres;
} 
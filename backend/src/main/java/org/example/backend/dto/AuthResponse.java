package org.example.backend.dto;

import lombok.Data;

@Data
public class AuthResponse {

    private String token;
    private String email;
    private String role;
    private String nom;
    private String prenom;

    public AuthResponse(String token, String email, String role, String nom, String prenom) {
        this.token = token;
        this.email = email;
        this.role = role;
        this.nom = nom;
        this.prenom = prenom;
    }

    public AuthResponse(){

    }
}

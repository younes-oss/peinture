package org.example.backend.dto;

import lombok.Data;
import org.example.backend.model.User;

@Data
public class RegisterRequest {
    private String email;
    private String password;
    private String nom;
    private String prenom;
    private User.Role role;

    public RegisterRequest() {}

    public RegisterRequest(String email, String password, String nom, String prenom, User.Role role) {
        this.email = email;
        this.password = password;
        this.nom = nom;
        this.prenom = prenom;
        this.role = role;
    }


}

package org.example.backend.dto;

import lombok.Data;

@Data
public class LoginRequest {
    private String email;
    private String password;

    public LoginRequest(String email, String password) {
        this.email = email;
        this.password = password;
    }

    public LoginRequest() {}

    // Getters manuels (en attendant que Lombok fonctionne)
    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }
}

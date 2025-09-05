package org.example.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;
import java.util.List;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class Client extends User {
    
    private String telephone;
    
    private String adresse;
    
    private String ville;
    
    private String codePostal;
    
    private String pays;
    
    @OneToMany(mappedBy = "client", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Commande> commandes;
    
    @OneToOne(mappedBy = "client", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Panier panier;
    


    // Les méthodes UserDetails sont héritées de User
}

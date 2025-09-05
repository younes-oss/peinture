package org.example.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class Administrateur extends User {
    
    @Column(nullable = false)
    private String departement;
    
    private String telephone;
    
    private String bureau;
    
    @Enumerated(EnumType.STRING)
    private NiveauAcces niveauAcces = NiveauAcces.STANDARD;
    
    public enum NiveauAcces {
        STANDARD, SUPER, ROOT
    }
    

}

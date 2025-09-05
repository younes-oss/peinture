package org.example.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class Artiste extends User {
    
    @Column(length = 1000)
    private String biographie;
    
    private String boutique;
    
    @Column(nullable = false)
    private String specialite;
    
    private String pays;
    
    private String ville;
    
    @OneToMany(mappedBy = "artiste", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Peinture> peintures;
    
    @Column(nullable = false)
    private Integer nombreOeuvres = 0;
    

}

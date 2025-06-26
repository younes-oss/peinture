package org.example.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import java.util.List;

@Entity
public class Artiste extends User {
    private String biographie;
    private String boutique;
    private String specialite;

    @OneToMany(mappedBy = "artiste")
    private List<Peinture> peintures;

    // Getters et setters

    public String getBiographie() {
        return biographie;
    }

    public void setBiographie(String biographie) {
        this.biographie = biographie;
    }

    public String getBoutique() {
        return boutique;
    }

    public void setBoutique(String boutique) {
        this.boutique = boutique;
    }

    public String getSpecialite() {
        return specialite;
    }

    public void setSpecialite(String specialite) {
        this.specialite = specialite;
    }

    public List<Peinture> getPeintures() {
        return peintures;
    }

    public void setPeintures(List<Peinture> peintures) {
        this.peintures = peintures;
    }
}

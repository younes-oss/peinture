package org.example.backend.dto;

import java.util.Date;
import java.util.List;

public class PeintureDto {
    private Long id;
    private String titre;
    private String description;
    private Double prix;
    private Integer stock;
    private List<String> images;
    private Date dateCreation;
    private Long artisteId;

    // Getters et setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitre() { return titre; }
    public void setTitre(String titre) { this.titre = titre; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Double getPrix() { return prix; }
    public void setPrix(Double prix) { this.prix = prix; }

    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }

    public List<String> getImages() { return images; }
    public void setImages(List<String> images) { this.images = images; }

    public Date getDateCreation() { return dateCreation; }
    public void setDateCreation(Date dateCreation) { this.dateCreation = dateCreation; }

    public Long getArtisteId() { return artisteId; }
    public void setArtisteId(Long artisteId) { this.artisteId = artisteId; }
} 
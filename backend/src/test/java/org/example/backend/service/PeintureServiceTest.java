package org.example.backend.service;

import org.example.backend.dto.PeintureDto;
import org.example.backend.model.*;
import org.example.backend.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;

import java.util.Date;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@ActiveProfiles("test")
class PeintureServiceTest {

    @Autowired
    private TestEntityManager entityManager;
    
    @Autowired
    private PeintureRepository peintureRepository;
    
    @Autowired
    private ArtisteRepository artisteRepository;
    
    private Artiste artisteTest;
    
    @BeforeEach
    void setUp() {
        // Créer un artiste simple
        artisteTest = new Artiste();
        artisteTest.setEmail("artiste@test.com");
        artisteTest.setPassword("password");
        artisteTest.setNom("Dupont");
        artisteTest.setPrenom("Jean");
        artisteTest.setBiographie("Artiste peintre");
        artisteTest.setSpecialite("Peinture à l'huile");
        artisteTest.setNombreOeuvres(0);
        artisteTest.setDateCreation(new Date());
        
        // Sauvegarder avec TestEntityManager
        artisteTest = entityManager.persistAndFlush(artisteTest);
    }
    
    @Test
    void testCreatePeintureEntity() {
        // Arrange - Créer une peinture directement (test de la couche données)
        Peinture peinture = new Peinture();
        peinture.setTitre("Ma Belle Peinture");
        peinture.setDescription("Une magnifique œuvre d'art");
        peinture.setPrix(250.50);
        peinture.setStock(5);
        peinture.setImageUrl("test.jpg");
        peinture.setDisponible(true);
        peinture.setCategorie(Peinture.Categorie.IMPRESSIONNISME);
        peinture.setArtiste(artisteTest);
        peinture.setDateCreation(new Date());
        
        // Act - Sauvegarder via le repository
        Peinture peintureSauvee = peintureRepository.save(peinture);
        entityManager.flush();
        
        // Assert - Tester tous les attributs sauvegardés
        assertNotNull(peintureSauvee.getId());
        assertEquals("Ma Belle Peinture", peintureSauvee.getTitre());
        assertEquals("Une magnifique œuvre d'art", peintureSauvee.getDescription());
        assertEquals(250.50, peintureSauvee.getPrix());
        assertEquals(5, peintureSauvee.getStock());
        assertEquals("test.jpg", peintureSauvee.getImageUrl());
        assertEquals(true, peintureSauvee.isDisponible());
        assertEquals(Peinture.Categorie.IMPRESSIONNISME, peintureSauvee.getCategorie());
        assertEquals(artisteTest.getId(), peintureSauvee.getArtiste().getId());
        assertEquals("Dupont", peintureSauvee.getArtiste().getNom());
        assertEquals("Jean", peintureSauvee.getArtiste().getPrenom());
        assertNotNull(peintureSauvee.getDateCreation());
        
        // Vérifier que la peinture est bien en base
        Peinture peintureTrouvee = peintureRepository.findById(peintureSauvee.getId()).orElse(null);
        assertNotNull(peintureTrouvee);
        assertEquals("Ma Belle Peinture", peintureTrouvee.getTitre());
    }
    
    @Test
    void testFindById() {
        // Arrange - Créer une peinture pour le test
        Peinture peinture = new Peinture();
        peinture.setTitre("Peinture FindById");
        peinture.setDescription("Description pour test FindById");
        peinture.setPrix(150.0);
        peinture.setStock(3);
        peinture.setImageUrl("findbyid.jpg");
        peinture.setDisponible(true);
        peinture.setCategorie(Peinture.Categorie.CLASSIQUE);
        peinture.setArtiste(artisteTest);
        peinture.setDateCreation(new Date());
        
        // Sauvegarder la peinture
        Peinture peintureSauvee = peintureRepository.save(peinture);
        entityManager.flush();
        
        // Act & Assert - Test findById avec ID valide
        Peinture peintureTrouvee = peintureRepository.findById(peintureSauvee.getId()).orElse(null);
        assertNotNull(peintureTrouvee);
        assertEquals("Peinture FindById", peintureTrouvee.getTitre());
        assertEquals("Description pour test FindById", peintureTrouvee.getDescription());
        assertEquals(150.0, peintureTrouvee.getPrix());
        assertEquals(3, peintureTrouvee.getStock());
        assertEquals("findbyid.jpg", peintureTrouvee.getImageUrl());
        assertEquals(true, peintureTrouvee.isDisponible());
        assertEquals(Peinture.Categorie.CLASSIQUE, peintureTrouvee.getCategorie());
        assertEquals(artisteTest.getId(), peintureTrouvee.getArtiste().getId());
        assertNotNull(peintureTrouvee.getDateCreation());
        
        // Test findById avec ID inexistant
        Peinture peintureInexistante = peintureRepository.findById(999L).orElse(null);
        assertNull(peintureInexistante);
    }
    
    @Test
    void testFindAll() {
        // Arrange - Créer plusieurs peintures
        Peinture peinture1 = new Peinture();
        peinture1.setTitre("Première Peinture");
        peinture1.setDescription("Description 1");
        peinture1.setPrix(100.0);
        peinture1.setStock(2);
        peinture1.setImageUrl("image1.jpg");
        peinture1.setDisponible(true);
        peinture1.setCategorie(Peinture.Categorie.IMPRESSIONNISME);
        peinture1.setArtiste(artisteTest);
        peinture1.setDateCreation(new Date());
        
        Peinture peinture2 = new Peinture();
        peinture2.setTitre("Deuxième Peinture");
        peinture2.setDescription("Description 2");
        peinture2.setPrix(200.0);
        peinture2.setStock(1);
        peinture2.setImageUrl("image2.jpg");
        peinture2.setDisponible(false);
        peinture2.setCategorie(Peinture.Categorie.ABSTRACTION);
        peinture2.setArtiste(artisteTest);
        peinture2.setDateCreation(new Date());
        
        Peinture peinture3 = new Peinture();
        peinture3.setTitre("Troisième Peinture");
        peinture3.setDescription("Description 3");
        peinture3.setPrix(300.0);
        peinture3.setStock(5);
        peinture3.setImageUrl("image3.jpg");
        peinture3.setDisponible(true);
        peinture3.setCategorie(Peinture.Categorie.CONTEMPORAIN);
        peinture3.setArtiste(artisteTest);
        peinture3.setDateCreation(new Date());
        
        // Sauvegarder toutes les peintures
        peintureRepository.save(peinture1);
        peintureRepository.save(peinture2);
        peintureRepository.save(peinture3);
        entityManager.flush();
        
        // Act - Récupérer toutes les peintures
        List<Peinture> toutesLesPeintures = peintureRepository.findAll();
        
        // Assert - Vérifier le nombre total
        assertEquals(3, toutesLesPeintures.size());
        
        // Vérifier que toutes les peintures sont présentes
        boolean peinture1Presente = toutesLesPeintures.stream()
            .anyMatch(p -> "Première Peinture".equals(p.getTitre()));
        boolean peinture2Presente = toutesLesPeintures.stream()
            .anyMatch(p -> "Deuxième Peinture".equals(p.getTitre()));
        boolean peinture3Presente = toutesLesPeintures.stream()
            .anyMatch(p -> "Troisième Peinture".equals(p.getTitre()));
        
        assertTrue(peinture1Presente);
        assertTrue(peinture2Presente);
        assertTrue(peinture3Presente);
        
        // Vérifier les différentes catégories
        boolean impressionnismePresent = toutesLesPeintures.stream()
            .anyMatch(p -> p.getCategorie() == Peinture.Categorie.IMPRESSIONNISME);
        boolean abstractionPresente = toutesLesPeintures.stream()
            .anyMatch(p -> p.getCategorie() == Peinture.Categorie.ABSTRACTION);
        boolean contemporainPresent = toutesLesPeintures.stream()
            .anyMatch(p -> p.getCategorie() == Peinture.Categorie.CONTEMPORAIN);
        
        assertTrue(impressionnismePresent);
        assertTrue(abstractionPresente);
        assertTrue(contemporainPresent);
        
        // Vérifier les disponibilités différentes
        long peinturesDisponibles = toutesLesPeintures.stream()
            .filter(Peinture::isDisponible)
            .count();
        long peinturesNonDisponibles = toutesLesPeintures.stream()
            .filter(p -> !p.isDisponible())
            .count();
        
        assertEquals(2, peinturesDisponibles);   // peinture1 et peinture3
        assertEquals(1, peinturesNonDisponibles); // peinture2
    }
}
package org.example.backend.service;

import org.example.backend.dto.AuthResponse;
import org.example.backend.dto.LoginRequest;
import org.example.backend.dto.RegisterRequest;
import org.example.backend.model.User;
import org.example.backend.model.Artiste;
import org.example.backend.model.Client;
import org.example.backend.repository.UserRepository;
import org.example.backend.repository.ArtisteRepository;
import org.example.backend.repository.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ArtisteRepository artisteRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;

    // Inscription d'un nouvel utilisateur
    public AuthResponse register(RegisterRequest request) {
        // Vérifier si l'email existe déjà
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Un utilisateur avec cet email existe déjà");
        }

        // Déterminer le rôle (par défaut CLIENT si non spécifié)
        User.Role role = request.getRole() != null ? request.getRole() : User.Role.CLIENT;

        User user;
        
        // Créer l'entité spécifique selon le rôle
        if (role == User.Role.ARTISTE) {
            // Créer un artiste
            Artiste artiste = new Artiste();
            artiste.setEmail(request.getEmail());
            artiste.setPassword(passwordEncoder.encode(request.getPassword()));
            artiste.setNom(request.getNom());
            artiste.setPrenom(request.getPrenom());
            artiste.setRole(User.Role.ARTISTE);
            artiste.setActif(true);
            artiste.setSpecialite("Non spécifié"); // Valeur par défaut
            artiste.setNombreOeuvres(0);

            
            user = artisteRepository.save(artiste);
        } else {
            // Créer un client
            Client client = new Client();
            client.setEmail(request.getEmail());
            client.setPassword(passwordEncoder.encode(request.getPassword()));
            client.setNom(request.getNom());
            client.setPrenom(request.getPrenom());
            client.setRole(User.Role.CLIENT);
            client.setActif(true);
            
            user = clientRepository.save(client);
        }

        // Générer le token JWT
        String jwtToken = jwtService.generateToken(user);

        return new AuthResponse(
                jwtToken,
                user.getEmail(),
                user.getRole().name(),
                user.getNom(),
                user.getPrenom()
        );
    }

    // Connexion d'un utilisateur existant
    public AuthResponse authenticate(LoginRequest request) {
        // Authentifier l'utilisateur
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        // Récupérer l'utilisateur
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        // Générer le token JWT
        String jwtToken = jwtService.generateToken(user);

        return new AuthResponse(
                jwtToken,
                user.getEmail(),
                user.getRole().name(),
                user.getNom(),
                user.getPrenom()
        );
    }
}

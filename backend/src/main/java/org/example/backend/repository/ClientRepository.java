package org.example.backend.repository;

import org.example.backend.model.Client;
import org.example.backend.model.Panier;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ClientRepository extends JpaRepository<Client, Long> {

    Optional<Client> findByEmail(String email);
}
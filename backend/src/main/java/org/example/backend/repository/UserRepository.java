package org.example.backend.repository;

import org.example.backend.model.User;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface UserRepository extends CrudRepository<User, Long> {

    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);

}

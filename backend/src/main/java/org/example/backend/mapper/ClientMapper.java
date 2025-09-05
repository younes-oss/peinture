package org.example.backend.mapper;

import org.example.backend.model.Client;
import org.example.backend.dto.ClientDto;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface ClientMapper {
    
    // Conversion Client -> ClientDto
    ClientDto toDto(Client client);
    
    // Conversion ClientDto -> Client
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "dateCreation", ignore = true)
    @Mapping(target = "commandes", ignore = true)
    @Mapping(target = "panier", ignore = true)
    @Mapping(target = "role", ignore = true)
    @Mapping(target = "actif", ignore = true)
    Client toEntity(ClientDto dto);
} 
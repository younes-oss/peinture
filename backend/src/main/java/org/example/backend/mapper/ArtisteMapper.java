package org.example.backend.mapper;

import org.example.backend.model.Artiste;
import org.example.backend.dto.ArtisteDto;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface ArtisteMapper {
    
    // Conversion Artiste -> ArtisteDto
    ArtisteDto toDto(Artiste artiste);
    
    // Conversion ArtisteDto -> Artiste
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "dateCreation", ignore = true)
    @Mapping(target = "peintures", ignore = true)
    @Mapping(target = "role", ignore = true)
    @Mapping(target = "actif", ignore = true)
    Artiste toEntity(ArtisteDto dto);
} 
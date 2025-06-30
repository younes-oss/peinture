package org.example.backend.mapper;

import org.example.backend.model.Peinture;
import org.example.backend.dto.PeintureDto;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface PeintureMapper {
    PeintureDto toDto(Peinture peinture);

    @Mapping(target = "id", ignore = true) // Pour la création, on ignore l'id
    Peinture toEntity(PeintureDto dto);
} 
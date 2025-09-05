package org.example.backend.mapper;

import org.example.backend.model.Peinture;
import org.example.backend.dto.PeintureDto;
import org.mapstruct.*;

@Mapper(componentModel = "spring", uses = {ArtisteMapper.class})
public interface PeintureMapper {
    
    // Conversion Peinture -> PeintureDto
    @Mapping(target = "categorie", expression = "java(peinture.getCategorie() != null ? peinture.getCategorie().name() : null)")
    @Mapping(target = "categorieLibelle", expression = "java(peinture.getCategorie() != null ? peinture.getCategorie().getLibelle() : null)")
    PeintureDto toDto(Peinture peinture);
    
    // Conversion PeintureDto -> Peinture (les champs gérés manuellement dans le service)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "dateCreation", ignore = true)
    @Mapping(target = "artiste", ignore = true)
    @Mapping(target = "categorie", ignore = true)
    Peinture toEntity(PeintureDto dto);
} 
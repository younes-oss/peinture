package org.example.backend.mapper;

import org.example.backend.dto.PanierDto;
import org.example.backend.dto.PanierItemDto;
import org.example.backend.model.Panier;
import org.example.backend.model.PanierItem;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface PanierMapper {

    @Mapping(target = "clientId", source = "client.id")
    PanierDto toDto(Panier panier);

    @AfterMapping
    default void mapItems(Panier panier, @MappingTarget PanierDto dto) {
        if (panier.getItems() == null) return;
        dto.setItems(panier.getItems().stream().map(this::toDto).toList());
    }

    PanierItemDto toDto(PanierItem item);
}



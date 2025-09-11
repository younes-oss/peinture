package org.example.backend.mapper;

import org.example.backend.dto.CommandeDto;
import org.example.backend.model.Commande;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {PanierMapper.class})
public interface CommandeMapper {
    
    @Mapping(source = "client.id", target = "clientId")
    @Mapping(source = "client.nom", target = "clientNom")
    @Mapping(source = "client.prenom", target = "clientPrenom")
    @Mapping(source = "statut", target = "statut")
    CommandeDto toDto(Commande commande);
    
    @Mapping(target = "client", ignore = true)
    @Mapping(target = "dateCommande", ignore = true)
    Commande toEntity(CommandeDto dto);
}
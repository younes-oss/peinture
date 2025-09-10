package org.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PanierDto {
    private Long id;
    private Long clientId;
    private Integer nombreArticles;
    private Double total;
    private Date dateCreation;
    private Date dateModification;
    private List<PanierItemDto> items;
}



package org.example.backend.controller;

import org.example.backend.dto.PeintureDto;
import org.example.backend.service.PeintureService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/peintures")
public class PeintureController {
    private final PeintureService peintureService;

    public PeintureController(PeintureService peintureService) {
        this.peintureService = peintureService;
    }

    @PostMapping
    public ResponseEntity<PeintureDto> createPeinture(@RequestBody PeintureDto dto) {
        PeintureDto created = peintureService.createPeinture(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
} 
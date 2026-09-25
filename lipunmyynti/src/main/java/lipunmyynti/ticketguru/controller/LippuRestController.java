package lipunmyynti.ticketguru.controller;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import lipunmyynti.ticketguru.model.*;
import lipunmyynti.ticketguru.repository.EsityskertaRepository;
import lipunmyynti.ticketguru.repository.LippuRepository;
import lipunmyynti.ticketguru.repository.LipputyyppiRepository;

import java.util.*;
import java.math.*;
import java.sql.*;
import jakarta.persistence.*;


@RestController 
@RequestMapping("/api/liput") // http://localhost:8080/api/liput

public class LippuRestController {

    //injection: repository to restcontroller
    private final LippuRepository lippuRepository;
    private final EsityskertaRepository esityskertaRepository;
    private final LipputyyppiRepository lipputyyppiRepository;

    public LippuRestController(LippuRepository lippuRepository, EsityskertaRepository esityskertaRepository, LipputyyppiRepository lipputyyppiRepository) {
        this.lippuRepository = lippuRepository;
        this.esityskertaRepository = esityskertaRepository;
        this.lipputyyppiRepository = lipputyyppiRepository;
    }
    
    @GetMapping 
    public List<Lippu> getAllLiput()
    {
        return lippuRepository.findAll();
    }

    // Search lippu with id
    @GetMapping("/{id}")
    public Lippu getLippuById(@PathVariable Long id) {
        return lippuRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Lippua ei löytynyt"));
    }
}
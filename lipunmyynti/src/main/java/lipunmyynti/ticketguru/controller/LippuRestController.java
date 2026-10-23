package lipunmyynti.ticketguru.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.validation.annotation.Validated;

import lipunmyynti.ticketguru.model.*;
import lipunmyynti.ticketguru.repository.EsityskertaRepository;
import lipunmyynti.ticketguru.repository.LippuRepository;
import lipunmyynti.ticketguru.repository.LipputyyppiRepository;

import java.util.*;

@Validated
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/liput") // http://localhost:8080/api/liput

public class LippuRestController {

    // injection: repository to restcontroller
    private final LippuRepository lippuRepository;

    public LippuRestController(LippuRepository lippuRepository, EsityskertaRepository esityskertaRepository,
            LipputyyppiRepository lipputyyppiRepository) {
        this.lippuRepository = lippuRepository;
    }

    @GetMapping
    public List<Lippu> getAllLiput() {
        return lippuRepository.findAll();
    }

    //Search lippu with id
    @GetMapping("/{id}")
    public Lippu getLippuById(@PathVariable UUID id) {
        return lippuRepository.findById(id).orElse(null);
    }
}
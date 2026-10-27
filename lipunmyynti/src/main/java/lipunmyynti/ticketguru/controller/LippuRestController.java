package lipunmyynti.ticketguru.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
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

    //Merkitse lippu käytetyksi
    @PatchMapping("/{id}/kaytetty")
    public ResponseEntity<Lippu> merkitseKaytetyksi(@PathVariable UUID id) {
        Optional<Lippu> kasiteltavaLippu = lippuRepository.findById(id);

        if (kasiteltavaLippu.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Lippu lippu = kasiteltavaLippu.get();
        lippu.setKaytetty(true);
        lippuRepository.save(lippu);

        return ResponseEntity.ok(lippu);
    }

    //Merkitse lippu käyttämättömäksi
    @PatchMapping("/{id}/kayttamaton")
    public ResponseEntity<Lippu> merkitseKayttamattomaksi(@PathVariable UUID id) {
        Optional<Lippu> kasiteltavaLippu = lippuRepository.findById(id);

        if (kasiteltavaLippu.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Lippu lippu = kasiteltavaLippu.get();
        lippu.setKaytetty(false);
        lippuRepository.save(lippu);

        return ResponseEntity.ok(lippu);
    }
}
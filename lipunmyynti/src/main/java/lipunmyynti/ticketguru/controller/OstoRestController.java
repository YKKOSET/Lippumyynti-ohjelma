package lipunmyynti.ticketguru.controller;

import lipunmyynti.ticketguru.model.*;
import lipunmyynti.ticketguru.repository.LippuRepository;
import lipunmyynti.ticketguru.repository.OstoRepository;
import lipunmyynti.ticketguru.repository.OstoriviRepository;

import java.util.*;
import java.math.*; //säilytin: saattaa tarvita kokonaishinnan laskemiselle
import jakarta.validation.constraints.Positive;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Validated
@RestController
@RequestMapping("/api/ostot") // http://localhost:8080/api/ostot
public class OstoRestController {

    private final OstoRepository ostoRepository;
    private final OstoriviRepository ostoriviRepository;
    private final LippuRepository lippuRepository;

    public OstoRestController(OstoRepository ostoRepository, OstoriviRepository ostoriviRepository,
            LippuRepository lippuRepository) {
        this.ostoRepository = ostoRepository;
        this.ostoriviRepository = ostoriviRepository;
        this.lippuRepository = lippuRepository;
    }

    // list all buys
    @PreAuthorize("hasAnyAuthority('ADMIN', 'USER')")
    @GetMapping
    public List<Osto> getAllOstot() {
        return ostoRepository.findAll();
    }

    // add new buy
    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping
    public Osto addOsto(@RequestBody Osto osto) {
        return ostoRepository.save(osto);
    }

    // Edit existing buy
    @PreAuthorize("hasAuthority('ADMIN')")
    @PutMapping("/{id}")
    public Osto updateOsto(@PathVariable @Positive Long id, @RequestBody Osto updateOsto) {
        if(!ostoRepository.existsById(id))
            return ostoRepository.findById(id).orElseThrow();
        else
        {
            updateOsto.setId(id);
            return ostoRepository.save(updateOsto);
        }
    }

    // Get one buy by id
    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/{id}")
    public Osto getOstoById(@PathVariable @Positive Long id) { // id not null, id > 0
        return ostoRepository.findById(id).orElseThrow();
    }

    // deleting one purchase transaction
    @PreAuthorize("hasAuthority('ADMIN')")
    @DeleteMapping("/{id}")
    public List<Osto> deleteOsto(@PathVariable @Positive Long id) {
        ostoRepository.deleteById(id);
        return ostoRepository.findAll(); // listing remaining purchases transactions
    }
}
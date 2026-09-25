package lipunmyynti.ticketguru.controller;


import lipunmyynti.ticketguru.model.*;
import lipunmyynti.ticketguru.repository.LippuRepository;
import lipunmyynti.ticketguru.repository.OstoRepository;
import lipunmyynti.ticketguru.repository.OstoriviRepository;

import java.util.*;
import java.math.*;
import java.sql.*;
import jakarta.persistence.*;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController 
@RequestMapping ("/api/ostot") //http://localhost:8080/api/ostot
public class OstoRestController {

    private final OstoRepository ostoRepository;
    private final OstoriviRepository ostoriviRepository;
    private final LippuRepository lippuRepository; 
    
    public OstoRestController( OstoRepository ostoRepository, OstoriviRepository ostoriviRepository, LippuRepository lippuRepository)
    {
        this.ostoRepository = ostoRepository; 
        this.ostoriviRepository = ostoriviRepository;
        this.lippuRepository = lippuRepository;
    }

    //list all buys
    @GetMapping
    public List<Osto> getAllOstot() {
        return ostoRepository.findAll();
    }
    
    // add new buy
    @PostMapping
    public Osto addOsto(@RequestBody Osto osto) {   
        return ostoRepository.save(osto) ;
    }
    
    // Edit existing buy
    @PutMapping("/{id}")
    public Osto updateOsto(@PathVariable Long id, @RequestBody Osto updateOsto) {
        if (!ostoRepository.existsById(id)) {
            throw new RuntimeException("Ostotapahtumaa ei löytynyt");
        }
        updateOsto.setId(id);
        return ostoRepository.save(updateOsto);
    }

    // Get one buy by id
    @GetMapping("/{id}")
    public Osto getOstoById(@PathVariable Long id) 
    {
        return ostoRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Ostotapahtumaa ei löytynyt"));
    }

    //deleting one purchase transaction
    @DeleteMapping("/{id}")
    public List<Osto> deleteOsto(@PathVariable Long id) {
        ostoRepository.deleteById(id);
        return ostoRepository.findAll(); //listing remaining purchases transactions
    }
}
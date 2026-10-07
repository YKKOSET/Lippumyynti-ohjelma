package lipunmyynti.ticketguru.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lipunmyynti.ticketguru.model.Jarjestaja;
import lipunmyynti.ticketguru.repository.JarjestajaRepository;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;


@Validated
@RestController 
@RequestMapping ("/api/jarjestajat") //http://localhost:8080/api/jarjestajat

public class JarjestajaRestController {

    private final JarjestajaRepository jarjestajaRepository;

    JarjestajaRestController(JarjestajaRepository jarjestajaRepository){
        this.jarjestajaRepository = jarjestajaRepository;
    }
    
    //list all organizers
    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping
    public List<Jarjestaja>getAlljarjestajat() {
        return jarjestajaRepository.findAll();
    }
    
    // add new organizer
    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping
    public Jarjestaja addJarjestaja(@RequestBody Jarjestaja jarjestaja) { 
        return jarjestajaRepository.save(jarjestaja) ;
    }
    
    // Edit existing Järjestäjä
    @PreAuthorize("hasAuthority('ADMIN')")
    @PutMapping("/{id}")
    public Jarjestaja updateJarjestaja(@PathVariable Long id, @RequestBody Jarjestaja updateJarjestaja) {
        updateJarjestaja.setId(id);
        return jarjestajaRepository.save(updateJarjestaja);
    }

    // Get one organizer by id
    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/{id}")
    public Jarjestaja getJarjestajaById(@PathVariable Long id) {
        return jarjestajaRepository.findById(id).orElse(null);
    }
    
}

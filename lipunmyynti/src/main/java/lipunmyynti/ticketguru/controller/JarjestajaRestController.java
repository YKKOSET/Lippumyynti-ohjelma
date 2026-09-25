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



@RestController 
@RequestMapping ("/api/jarjestajat") //http://localhost:8080/api/jarjestajat

public class JarjestajaRestController {

    private final JarjestajaRepository jarjestajaRepository;

    JarjestajaRestController(JarjestajaRepository jarjestajaRepository){
        this.jarjestajaRepository = jarjestajaRepository;
    }
        //list all organizers
    @GetMapping
    public List<Jarjestaja>getAlljarjestajat() {
        return jarjestajaRepository.findAll();
    }
        // add new organizer
    @PostMapping
    public Jarjestaja addJarjestaja(@RequestBody Jarjestaja jarjestaja) {
        
        return jarjestajaRepository.save(jarjestaja) ;
    }
    
    // Edit existing Järjestäjä
    @PutMapping("/{id}")
    public Jarjestaja updateJarjestaja(@PathVariable Long id, @RequestBody Jarjestaja updateJarjestaja) {
        if (!jarjestajaRepository.existsById(id)) {
            throw new RuntimeException("Järjestäjää ei löytynyt");
        }
        updateJarjestaja.setId(id);
        return jarjestajaRepository.save(updateJarjestaja);
    }

    // Get one organizer by id
    @GetMapping("/{id}")
    public Jarjestaja getJarjestajaById(@PathVariable Long id) 
    {
        return jarjestajaRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Järjestäjää ei löytynyt"));
    }
    
}

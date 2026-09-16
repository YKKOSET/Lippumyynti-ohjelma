package lipunmyynti.ticketguru.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lipunmyynti.ticketguru.model.Jarjestaja;
import lipunmyynti.ticketguru.repository.JarjestajaRepository;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;



@RestController 
@RequestMapping ("/ticketguru/jarjestajat") //http://localhost:8080/ticketguru/jarjestajat

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
    public Jarjestaja addJarjestaja(@RequestBody Jarjestaja uusiJarjestaja) {
        
        return jarjestajaRepository.save(uusiJarjestaja) ;
    }
    
}

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
@RequestMapping ("/ticketguru") //http://localhost:8080/ticketguru/

public class JarjestajaController {

    private final JarjestajaRepository jarjestajaRepository;

    JarjestajaController(JarjestajaRepository jarjestajaRepository){
        this.jarjestajaRepository = jarjestajaRepository;
    }
        //list all organizers
    @GetMapping("/jarjestajat")
    public List<Jarjestaja>getAlljarjestajat() {
        return jarjestajaRepository.findAll();
    }
        // add new organizer
    @PostMapping("/jarjestajat")
    public Jarjestaja addJarjestaja(@RequestBody Jarjestaja uusiJarjestaja) {
        
        return jarjestajaRepository.save(uusiJarjestaja) ;
    }
    
}

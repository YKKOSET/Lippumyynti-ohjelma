package lipunmyynti.ticketguru.controller;


import lipunmyynti.ticketguru.model.Osto;
import lipunmyynti.ticketguru.repository.OstoRepository;

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

    OstoRestController(OstoRepository ostoRepository) {
        this.ostoRepository = ostoRepository;
    }

    //list all buys
    @GetMapping
    public Iterable<Osto> getAllOstot() {
        return ostoRepository.findAll();
    }
    
    // add new buy
    @PostMapping
    public Osto addOsto(@RequestBody Osto newOsto) {   
        return ostoRepository.save(newOsto) ;
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
}
package lipunmyynti.ticketguru.controller;

import lipunmyynti.ticketguru.model.*;
import lipunmyynti.ticketguru.repository.LippuRepository;
import lipunmyynti.ticketguru.repository.OstoRepository;
import lipunmyynti.ticketguru.repository.OstoriviRepository;

import java.util.*;
import jakarta.validation.constraints.Positive;

import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.transaction.annotation.Transactional;


@Validated
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/ostot") // http://localhost:8080/api/ostot
public class OstoRestController {

    private final OstoRepository ostoRepository;

    private final OstoriviRepository ostoriviRepository;
    private final LippuRepository lippuRepository;


    /*public OstoRestController(OstoRepository ostoRepository, OstoriviRepository ostoriviRepository,
            LippuRepository lippuRepository) {
        this.ostoRepository = ostoRepository;
    }*/

    public OstoRestController(OstoRepository ostoRepository, OstoriviRepository ostoriviRepository,
        LippuRepository lippuRepository) {
        this.ostoRepository = ostoRepository;
        this.ostoriviRepository = ostoriviRepository;
        this.lippuRepository = lippuRepository;
    }

    // list all buys
    @GetMapping
    public List<Osto> getAllOstot() {
        return ostoRepository.findAll();
    }

    // add new buy
    /*@PostMapping
    public Osto addOsto(@RequestBody Osto osto) {
        return ostoRepository.save(osto);
    }*/


    // add new buy: tallentaa oston ja sen ostorivit
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Transactional
    public Osto addOsto(@RequestBody Osto osto) {
        List<Ostorivi> saadutRivit = osto.getOstorivit() != null ? osto.getOstorivit() : List.of();

        osto.setId(null);           // varmistaa, että luodaan uusi osto
        osto.setOstorivit(null);    // rivit tallennetaan erikseen alla
        Osto tallennettu = ostoRepository.save(osto);

        List<Ostorivi> tallennetutRivit = new ArrayList<>();
        for (Ostorivi rivi : saadutRivit) {
            if (rivi.getLippu() == null || rivi.getLippu().getId() == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ostorivillä on oltava lippu (id).");
            }
            Lippu lippu = lippuRepository.findById(rivi.getLippu().getId())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.BAD_REQUEST, "Lippua ei löytynyt: " + rivi.getLippu().getId()));

            Ostorivi uusi = new Ostorivi(tallennettu, lippu, rivi.getMyyntihinta());
            tallennetutRivit.add(ostoriviRepository.save(uusi));
        }
        tallennettu.setOstorivit(tallennetutRivit);
        return tallennettu;
    }



    // Edit existing buy
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
    @GetMapping("/{id}")
    public Osto getOstoById(@PathVariable @Positive Long id) { // id not null, id > 0
        return ostoRepository.findById(id).orElseThrow();
    }

    // deleting one purchase transaction
    @DeleteMapping("/{id}")
    public List<Osto> deleteOsto(@PathVariable @Positive Long id) {
        ostoRepository.deleteById(id);
        return ostoRepository.findAll(); // listing remaining purchases transactions
    }
}
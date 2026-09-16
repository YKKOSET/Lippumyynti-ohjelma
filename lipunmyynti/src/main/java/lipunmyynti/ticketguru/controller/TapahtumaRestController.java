package lipunmyynti.ticketguru.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import lipunmyynti.ticketguru.model.Tapahtuma;
import lipunmyynti.ticketguru.repository.TapahtumaRepository;

@RestController
@RequestMapping("/ticketguru/tapahtumat") // http://localhost:8080/ticketguru/tapahtumat

public class TapahtumaRestController {

    // injection: repository into controller
    private final TapahtumaRepository tapahtumaRepository;

    TapahtumaRestController(TapahtumaRepository tapahtumaRepository) {
        this.tapahtumaRepository = tapahtumaRepository;
    }

    // list all events (findAll() comes automatically from JpaRepository)
    @GetMapping
    public List<Tapahtuma> getAllTapahtumat() {
        return tapahtumaRepository.findAll();
    }

    // editing one event
    @PutMapping("/{id}")
    public Tapahtuma updateTapahtuma(@PathVariable Long id, @RequestBody Tapahtuma updateTapahtuma) {
        updateTapahtuma.setId(id);
        return tapahtumaRepository.save(updateTapahtuma);
    }

}

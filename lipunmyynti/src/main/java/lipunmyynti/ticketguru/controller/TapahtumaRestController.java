package lipunmyynti.ticketguru.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.*;
import org.springframework.validation.annotation.Validated;

import lipunmyynti.ticketguru.model.Esityskerta;
import lipunmyynti.ticketguru.model.Lippu;
import lipunmyynti.ticketguru.model.Tapahtuma;
import lipunmyynti.ticketguru.repository.LippuRepository;
import lipunmyynti.ticketguru.repository.TapahtumaRepository;

@Validated
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/tapahtumat") // http://localhost:8080/api/tapahtumat

public class TapahtumaRestController {

    // injection: repository into controller
    private final TapahtumaRepository tapahtumaRepository;
    private final LippuRepository lippuRepository;

    TapahtumaRestController(TapahtumaRepository tapahtumaRepository, LippuRepository lippuRepository) {
        this.tapahtumaRepository = tapahtumaRepository;
        this.lippuRepository = lippuRepository;
    }

    // list all events (findAll() comes automatically from JpaRepository)
    @GetMapping
    public List<Tapahtuma> getAllTapahtumat() {
        return tapahtumaRepository.findAll();
    }

    // adding one event
    @PostMapping
    public Tapahtuma addTapahtuma(@RequestBody Tapahtuma tapahtuma) {
        return tapahtumaRepository.save(tapahtuma);
    }

    // editing one event
    @PutMapping("/{id}")
    public Tapahtuma updateTapahtuma(@PathVariable Long id, @RequestBody Tapahtuma updateTapahtuma) {
        updateTapahtuma.setId(id);
        return tapahtumaRepository.save(updateTapahtuma);
    }

    // deleting one event
    @DeleteMapping("/{id}")
    public List<Tapahtuma> deleteTapahtuma(@PathVariable Long id) {
        tapahtumaRepository.deleteById(id);
        return tapahtumaRepository.findAll();
    }

    // returns all events for a specific organizer
    @GetMapping("/jarjestaja/{id}")
    public List<Tapahtuma> getTapahtumatByJarjestaja(@PathVariable Long id) {
        return tapahtumaRepository.findByJarjestajaId(id);
    }

    // Palauttaa kaikki tapahtuman liput esityskerrasta viis
    /*@GetMapping("/{id}/liput")
      public List<Lippu> getLiputByTapahtuma(@PathVariable Long id) {
      return lippuRepository.findByEsityskertaTapahtumaId(id);
    }*/

    // Näyttää tapahtuman liput, lajiteltu esityskerran mukaan
    @GetMapping("/{id}/liput")
    public Map<Long, List<Lippu>> getLiputByTapahtuma(@PathVariable Long id) {
        Tapahtuma tapahtuma = tapahtumaRepository.findById(id).orElse(null);
        if (tapahtuma == null) {
            return null;
        }
        Map<Long, List<Lippu>> liputEsityskerroittain = new HashMap<>();
        for (Esityskerta esityskerta : tapahtuma.getEsityskerrat()) {
            liputEsityskerroittain.put(esityskerta.getId(), esityskerta.getLiput());
        }
        return liputEsityskerroittain;
    }

    // Hakee tietyn esityskerran kaikki liput
    //HUOM! EI Toimi. Onko syynä lippu-luokan muuttujanimet?
    @GetMapping("/{tapahtumaId}/{esityskertaId}/liput")
    public List<Lippu> getLiputByEsityskerta(
            @PathVariable Long tapahtumaId,
            @PathVariable Long esityskertaId) {

        return lippuRepository.findByEsityskertaIdAndEsityskertaTapahtumaId(
                esityskertaId, tapahtumaId);
    }

}

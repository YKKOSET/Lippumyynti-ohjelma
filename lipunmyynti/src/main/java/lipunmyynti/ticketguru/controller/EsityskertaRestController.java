
package lipunmyynti.ticketguru.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import lipunmyynti.ticketguru.model.Esityskerta;
import lipunmyynti.ticketguru.model.Paikka;
import lipunmyynti.ticketguru.model.Postinumero;
import lipunmyynti.ticketguru.repository.EsityskertaRepository;
import lipunmyynti.ticketguru.repository.PaikkaRepository;
import lipunmyynti.ticketguru.repository.PostinumeroRepository;

@RestController
@RequestMapping("/api/esityskerrat")
@CrossOrigin
public class EsityskertaRestController {

    private final EsityskertaRepository esityskertaRepository;
    private final PaikkaRepository paikkaRepository;
    private final PostinumeroRepository postinumeroRepository;

    public EsityskertaRestController(
            EsityskertaRepository esityskertaRepository,
            PaikkaRepository paikkaRepository,
            PostinumeroRepository postinumeroRepository) {

        this.esityskertaRepository = esityskertaRepository;
        this.paikkaRepository = paikkaRepository;
        this.postinumeroRepository = postinumeroRepository;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Esityskerta luo(@RequestBody Esityskerta esityskerta) {

        esityskerta.setId(null);

        if (esityskerta.getPaikka() != null) {
            Paikka paikka = esityskerta.getPaikka();

            if (paikka.getPostinumero() != null) {

                String numero = paikka.getPostinumero().getPostinumero();
                String toimipaikka =
                        paikka.getPostinumero().getPostitoimipaikka();

                if (numero == null || !numero.matches("\\d{5}")) {
                    throw new ResponseStatusException(
                            HttpStatus.BAD_REQUEST,
                            "Postinumeron pitää sisältää viisi numeroa."
                    );
                }

                if (toimipaikka == null || toimipaikka.isBlank()) {
                    throw new ResponseStatusException(
                            HttpStatus.BAD_REQUEST,
                            "Postitoimipaikka puuttuu."
                    );
                }

                Postinumero postinumero = postinumeroRepository
                        .findById(numero)
                        .orElseGet(() -> postinumeroRepository.save(
                                new Postinumero(numero, toimipaikka.trim())
                        ));

                paikka.setPostinumero(postinumero);
            }

            paikka = paikkaRepository.save(paikka);
            esityskerta.setPaikka(paikka);
        }

        return esityskertaRepository.save(esityskerta);
    }

    @PutMapping("/{id}")
    public Esityskerta paivita(
            @PathVariable Long id,
            @RequestBody Esityskerta esityskerta) {

        if (!esityskertaRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }

        esityskerta.setId(id);
        return esityskertaRepository.save(esityskerta);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void poista(@PathVariable Long id) {
        esityskertaRepository.deleteById(id);
    }
}

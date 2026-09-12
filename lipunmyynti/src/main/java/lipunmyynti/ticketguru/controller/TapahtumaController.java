package lipunmyynti.ticketguru.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import lipunmyynti.ticketguru.model.Tapahtuma;
import lipunmyynti.ticketguru.repository.TapahtumaRepository;

@RestController
@RequestMapping("/ticketguru") //http://localhost:8080/ticketguru/

public class TapahtumaController {

    @Autowired
    // injection: repository into controller
    private TapahtumaRepository tapahtumaRepository;

    // list all events (findAll() comes automatically from JpaRepository)
    @GetMapping("/tapahtumat")
    public List<Tapahtuma> getAllTapahtumat() {
        return tapahtumaRepository.findAll();
    }

}


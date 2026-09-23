package lipunmyynti.ticketguru.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lipunmyynti.ticketguru.repository.EsityskertaRepository;
import lipunmyynti.ticketguru.repository.LippuRepository;
import lipunmyynti.ticketguru.repository.LipputyyppiRepository;

@RestController 
@RequestMapping("/api/liput") // http://localhost:8080/api/liput

public class LippuRestController {

    //injection: repository to restcontroller
    private final LippuRepository lippuRepository;
    private final EsityskertaRepository esityskertaRepository;
    private final LipputyyppiRepository lipputyyppiRepository;

    public LippuRestController(LippuRepository lippuRepository, EsityskertaRepository esityskertaRepository, LipputyyppiRepository lipputyyppiRepository) {
        this.lippuRepository = lippuRepository;
        this.esityskertaRepository = esityskertaRepository;
        this.lipputyyppiRepository = lipputyyppiRepository;
    } 

    
}
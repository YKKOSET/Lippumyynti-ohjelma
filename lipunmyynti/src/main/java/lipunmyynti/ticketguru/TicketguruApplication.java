package lipunmyynti.ticketguru;

import lipunmyynti.ticketguru.repository.AsiakasRepository;
import lipunmyynti.ticketguru.repository.EsityskertaRepository;
import lipunmyynti.ticketguru.repository.LippuRepository;
import lipunmyynti.ticketguru.repository.LipputyyppiRepository;
import lipunmyynti.ticketguru.repository.OstoRepository;
import lipunmyynti.ticketguru.repository.OstoriviRepository;

import java.math.BigDecimal;
import java.sql.Timestamp;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import lipunmyynti.ticketguru.model.Asiakas;
import lipunmyynti.ticketguru.model.Esityskerta;
import lipunmyynti.ticketguru.model.Jarjestaja;
import lipunmyynti.ticketguru.model.Lippu;
import lipunmyynti.ticketguru.model.Lipputyyppi;
import lipunmyynti.ticketguru.model.Osto;
import lipunmyynti.ticketguru.model.Ostorivi;
import lipunmyynti.ticketguru.model.Tapahtuma;
import lipunmyynti.ticketguru.repository.JarjestajaRepository;
import lipunmyynti.ticketguru.repository.TapahtumaRepository;

@SpringBootApplication
public class TicketguruApplication {


    private final EsityskertaRepository esityskertaRepository;
    private final LippuRepository lippuRepository;
    private final LipputyyppiRepository lipputyyppiRepository;
    private final AsiakasRepository asiakasRepository;
    private final OstoRepository ostoRepository;
    private final OstoriviRepository ostoriviRepository;
    

    TicketguruApplication(LipputyyppiRepository lipputyyppiRepository, LippuRepository lippuRepository
         ,EsityskertaRepository esityskertaRepository, AsiakasRepository asiakasRepository, OstoRepository ostoRepository, OstoriviRepository ostoriviRepository) {
        this.lipputyyppiRepository = lipputyyppiRepository;
        this.lippuRepository = lippuRepository;
        this.esityskertaRepository = esityskertaRepository;
        this.asiakasRepository = asiakasRepository;
        this.ostoRepository = ostoRepository;
        this.ostoriviRepository = ostoriviRepository;
        
    }

    public static void main(String[] args) {
		SpringApplication.run(TicketguruApplication.class, args);
	}

	//This section will be commented out once there is a permanent database:
	@Bean
	public CommandLineRunner demo(TapahtumaRepository tapahtumaRepository,
    JarjestajaRepository jarjestajaRepository) {
    return (args) -> {
        
        //Hard-coded Jarjestajat
        jarjestajaRepository.save(new Jarjestaja("Matti", "Halminen", "matin@kukat.fi", "0401234567"));
        jarjestajaRepository.save(new Jarjestaja("Tom", "Aatti", "tom.aatti@gmail.com", "0407654321"));
        jarjestajaRepository.save(new Jarjestaja("Naami", "Puronen", "NewKirjailijaliitto@liitto.fi", "0501234567"));
        jarjestajaRepository.save(new Jarjestaja("Tony", "Swift", "music@tomorrowland.com", "0206537769"));
        jarjestajaRepository.save(new Jarjestaja("Mikko", "Korhonen", "mikko@clockfest.fi", "0509876543"));
        
        //Hard-coded Tapahtumat
        tapahtumaRepository.save(new Tapahtuma("Keikkakeidas", jarjestajaRepository.getReferenceById(1L))); //1L = Long id 1
        tapahtumaRepository.save(new Tapahtuma("Teatterin Aave", jarjestajaRepository.getReferenceById(1L)));
        tapahtumaRepository.save(new Tapahtuma("Vantaan kirjamessut", jarjestajaRepository.getReferenceById(2L)));
        tapahtumaRepository.save(new Tapahtuma("Helsinki festivalland", jarjestajaRepository.getReferenceById(3L)));
        tapahtumaRepository.save(new Tapahtuma("Ruislock 2026", jarjestajaRepository.getReferenceById(4L)));

        //Hard-coded Lipputyyppi
        lipputyyppiRepository.save(new Lipputyyppi("Lastenlippu"));
        lipputyyppiRepository.save(new Lipputyyppi("Opiskelija"));
        lipputyyppiRepository.save(new Lipputyyppi("Eläkeläinen"));
        lipputyyppiRepository.save(new Lipputyyppi("Normaalihintainen"));

        //Hard-coded Esityskerta
        //Tapahtuma tapahtuma, Timestamp alkuaika
        esityskertaRepository.save(new Esityskerta(tapahtumaRepository.getReferenceById(2L), Timestamp.valueOf("2026-10-01 19:00:00")));
        esityskertaRepository.save(new Esityskerta(tapahtumaRepository.getReferenceById(2L), Timestamp.valueOf("2026-11-08 19:00:00")));
        esityskertaRepository.save(new Esityskerta(tapahtumaRepository.getReferenceById(1L), Timestamp.valueOf("2026-10-01 10:00:00")));
        esityskertaRepository.save(new Esityskerta(tapahtumaRepository.getReferenceById(1L), Timestamp.valueOf("2026-11-01 10:00:00")));
        esityskertaRepository.save(new Esityskerta(tapahtumaRepository.getReferenceById(3L), Timestamp.valueOf("2026-12-12 13:00:00")));

        //Hard-coded Asiakas
        asiakasRepository.save(new Asiakas("Jordi", "Alba", "Jordi.Alba@gmail.com", "+358 878 8473289"));
        asiakasRepository.save(new Asiakas("Jonni", "Ponni", "Jonni.Ponni@gmail.com", "+358 647 457938"));
        asiakasRepository.save(new Asiakas("Bard", "Chime", "Bard.Chime@gmail.com", "+358 423 8573498"));
        asiakasRepository.save(new Asiakas("Gucci", "Mane", "Gucci.Mane@gmail.com", "+358 312 597834"));
   
        //Hard-coded Osto
        ostoRepository.save(new Osto(Timestamp.valueOf("2026-11-09 14:30:00"), 25.00, asiakasRepository.getReferenceById(1L)));
        ostoRepository.save(new Osto(Timestamp.valueOf("2026-11-15 15:30:00"), 20.00, asiakasRepository.getReferenceById(2L)));
        ostoRepository.save(new Osto(Timestamp.valueOf("2026-11-18 12:30:00"), 10.00, asiakasRepository.getReferenceById(3L)));

        //Hard-coded Lippu
        lippuRepository.save(new  Lippu(esityskertaRepository.getReferenceById(1L), lipputyyppiRepository.getReferenceById(1L), new BigDecimal("10.00"), false)); //Lastenlippu
        lippuRepository.save(new  Lippu(esityskertaRepository.getReferenceById(1L), lipputyyppiRepository.getReferenceById(2L), new BigDecimal("15.00"), false)); //Opiskelijalippu
        lippuRepository.save(new  Lippu(esityskertaRepository.getReferenceById(1L), lipputyyppiRepository.getReferenceById(4L), new BigDecimal("20.00"), false)); //Normaali
        lippuRepository.save(new  Lippu(esityskertaRepository.getReferenceById(1L), lipputyyppiRepository.getReferenceById(3L), new BigDecimal("10.00"), false));//Eläkeläinen


        //Hard-coded Ostorivi

        ostoriviRepository.save(new  Ostorivi(ostoRepository.getReferenceById(1L),lippuRepository.getReferenceById(1L) , new BigDecimal("10.00")));
        ostoriviRepository.save(new  Ostorivi(ostoRepository.getReferenceById(1L),lippuRepository.getReferenceById(2L) , new BigDecimal("15.00")));
        ostoriviRepository.save(new  Ostorivi(ostoRepository.getReferenceById(2L),lippuRepository.getReferenceById(3L) , new BigDecimal("20.00")));
        ostoriviRepository.save(new  Ostorivi(ostoRepository.getReferenceById(3L),lippuRepository.getReferenceById(4L) , new BigDecimal("10.00")));
        

        

        
    };
}
}

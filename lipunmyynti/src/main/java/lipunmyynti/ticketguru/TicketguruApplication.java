package lipunmyynti.ticketguru;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import lipunmyynti.ticketguru.model.Jarjestaja;
import lipunmyynti.ticketguru.model.Tapahtuma;
import lipunmyynti.ticketguru.repository.JarjestajaRepository;
import lipunmyynti.ticketguru.repository.TapahtumaRepository;

@SpringBootApplication
public class TicketguruApplication {


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
        tapahtumaRepository.save(new Tapahtuma("Keikkakeidas"));
        tapahtumaRepository.save(new Tapahtuma("Teatterin Aave"));
        tapahtumaRepository.save(new Tapahtuma("Vantaan kirjamessut"));
        tapahtumaRepository.save(new Tapahtuma("Helsinki festivalland"));
        tapahtumaRepository.save(new Tapahtuma("Ruislock 2026"));

    };
}
}

package lipunmyynti.ticketguru.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import lipunmyynti.ticketguru.model.Asiakas;

public interface AsiakasRepository extends JpaRepository<Asiakas, Long> {

}

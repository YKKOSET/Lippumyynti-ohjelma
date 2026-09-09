package lipunmyynti.ticketguru.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import lipunmyynti.ticketguru.model.Tapahtuma;

public interface TapahtumaRepository extends JpaRepository<Tapahtuma, Long> {

}

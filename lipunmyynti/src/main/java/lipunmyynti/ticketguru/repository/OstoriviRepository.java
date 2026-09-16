package lipunmyynti.ticketguru.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import lipunmyynti.ticketguru.model.Ostorivi;

public interface OstoriviRepository extends JpaRepository<Ostorivi, Long> {

}
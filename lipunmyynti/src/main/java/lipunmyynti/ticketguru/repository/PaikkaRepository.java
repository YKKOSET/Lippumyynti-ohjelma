package lipunmyynti.ticketguru.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import lipunmyynti.ticketguru.model.Paikka;

public interface PaikkaRepository extends JpaRepository<Paikka, Long> {

}
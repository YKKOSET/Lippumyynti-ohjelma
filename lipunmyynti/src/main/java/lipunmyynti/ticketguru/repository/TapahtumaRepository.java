package lipunmyynti.ticketguru.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import lipunmyynti.ticketguru.model.Tapahtuma;

public interface TapahtumaRepository extends JpaRepository<Tapahtuma, Long> {

    List<Tapahtuma> findByJarjestajaId(Long id);
    
}

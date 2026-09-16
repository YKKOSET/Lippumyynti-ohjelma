package lipunmyynti.ticketguru.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import lipunmyynti.ticketguru.model.Esityskerta;

public interface EsityskertaRepository extends JpaRepository<Esityskerta, Long> {

}
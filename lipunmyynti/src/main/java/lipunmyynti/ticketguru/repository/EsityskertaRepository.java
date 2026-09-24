package lipunmyynti.ticketguru.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import lipunmyynti.ticketguru.model.Esityskerta;
import lipunmyynti.ticketguru.model.Tapahtuma;

public interface EsityskertaRepository extends JpaRepository<Esityskerta, Long> {
    List<Tapahtuma> findByTapahtumaId(Long id);
}
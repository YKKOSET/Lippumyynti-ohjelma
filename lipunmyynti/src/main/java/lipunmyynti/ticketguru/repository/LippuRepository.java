package lipunmyynti.ticketguru.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

import lipunmyynti.ticketguru.model.Esityskerta;
import lipunmyynti.ticketguru.model.Lippu;

public interface LippuRepository extends JpaRepository<Lippu, UUID> 
{
    List<Lippu> findByEsityskerta(Esityskerta esityskerta);
    List<Lippu> findByEsityskertaTapahtumaId(Long tapahtumaId);
    List<Lippu> findByEsityskertaIdAndEsityskertaTapahtumaId(Long esityskertaId, Long tapahtumaId);
}


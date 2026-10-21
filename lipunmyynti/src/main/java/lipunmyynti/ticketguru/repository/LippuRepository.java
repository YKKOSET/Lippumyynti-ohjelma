package lipunmyynti.ticketguru.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
import lipunmyynti.ticketguru.model.Lippu;

public interface LippuRepository extends JpaRepository<Lippu, UUID> 
{

}


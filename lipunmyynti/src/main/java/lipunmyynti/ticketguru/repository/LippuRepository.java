package lipunmyynti.ticketguru.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import lipunmyynti.ticketguru.model.Lippu;

public interface LippuRepository extends JpaRepository<Lippu, Long> 
{

}


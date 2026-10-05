package lipunmyynti.ticketguru.repository;

import org.springframework.data.repository.CrudRepository;

import lipunmyynti.ticketguru.model.AppUser;



public interface UserRepository extends CrudRepository <AppUser, Long>{
    AppUser findByUsername(String username);

}

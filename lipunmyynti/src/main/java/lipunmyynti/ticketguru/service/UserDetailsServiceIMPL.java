package lipunmyynti.ticketguru.service;

import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import lipunmyynti.ticketguru.model.AppUser;
import lipunmyynti.ticketguru.repository.UserRepository;

@Service 

public class UserDetailsServiceIMPL implements UserDetailsService {

    private final UserRepository repository;

    public UserDetailsServiceIMPL (UserRepository repository){
        this.repository = repository;
    } 


    @Override 
    public  UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        AppUser curruser = repository.findByUsername(username);
        UserDetails user = new org.springframework.security.core.userdetails.User(username, curruser.getPasswordHash(),
        AuthorityUtils.createAuthorityList(curruser.getRole()));
        return user;
    }
}

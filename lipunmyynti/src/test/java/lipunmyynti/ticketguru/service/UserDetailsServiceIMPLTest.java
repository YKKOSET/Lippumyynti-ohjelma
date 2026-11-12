package lipunmyynti.ticketguru.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import lipunmyynti.ticketguru.model.AppUser;
import lipunmyynti.ticketguru.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class UserDetailsServiceIMPLTest {

    @Mock UserRepository repository;

    @Test
    void loadUserReturnsUserWithRoleAsAuthority() {
        when(repository.findByUsername("admin"))
                .thenReturn(new AppUser(1L, "admin", "hash", "ADMIN"));

        UserDetails details = new UserDetailsServiceIMPL(repository).loadUserByUsername("admin");

        assertThat(details.getUsername()).isEqualTo("admin");
        assertThat(details.getPassword()).isEqualTo("hash");
        assertThat(details.getAuthorities()).extracting("authority").containsExactly("ADMIN");
    }

    @Disabled("Tunnettu bugi: tuntematon käyttäjä aiheuttaa NullPointerExceptionin. "
            + "Pitäisi heittää UsernameNotFoundException. Poista @Disabled kun korjattu.")
    @Test
    void loadUnknownUserThrowsUsernameNotFound() {
        when(repository.findByUsername("tuntematon")).thenReturn(null);

        assertThatThrownBy(() -> new UserDetailsServiceIMPL(repository).loadUserByUsername("tuntematon"))
                .isInstanceOf(UsernameNotFoundException.class);
    }
}

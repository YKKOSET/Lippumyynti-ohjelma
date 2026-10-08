package lipunmyynti.ticketguru;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import static org.assertj.core.api.Assertions.assertThat;

import lipunmyynti.ticketguru.repository.*;

@SpringBootTest

public class RepositorySmokeTest {

    @Autowired
    private AsiakasRepository asiakasRepository;

    @Autowired
    private EsityskertaRepository esityskertaRepository;

    @Autowired
    private JarjestajaRepository jarjestajaRepository;

    @Autowired
    private LippuRepository lippuRepository;

    @Autowired
    private LipputyyppiRepository lipputyyppiRepository;

    @Autowired
    private OstoRepository ostoRepository;

    @Autowired
    private OstoriviRepository ostoriviRepository;

    @Autowired
    private PaikkaRepository paikkaRepository;

    @Autowired
    private PostinumeroRepository postinumeroRepository;

    @Autowired
    private UserRepository userRepository;

    @Test
    public void repositoriesAreLoaded() throws Exception {
        assertThat(asiakasRepository).isNotNull();
        assertThat(esityskertaRepository).isNotNull();
        assertThat(jarjestajaRepository).isNotNull();
        assertThat(lippuRepository).isNotNull();
        assertThat(lipputyyppiRepository).isNotNull();
        assertThat(ostoRepository).isNotNull();
        assertThat(ostoriviRepository).isNotNull();
        assertThat(paikkaRepository).isNotNull();
        assertThat(postinumeroRepository).isNotNull();
        assertThat(userRepository).isNotNull();
    }

}

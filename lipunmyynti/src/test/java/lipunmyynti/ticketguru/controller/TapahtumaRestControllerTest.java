package lipunmyynti.ticketguru.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import lipunmyynti.ticketguru.model.Esityskerta;
import lipunmyynti.ticketguru.model.Lippu;
import lipunmyynti.ticketguru.model.Tapahtuma;
import lipunmyynti.ticketguru.repository.LippuRepository;
import lipunmyynti.ticketguru.repository.TapahtumaRepository;

@ExtendWith(MockitoExtension.class)
class TapahtumaRestControllerTest {

    @Mock TapahtumaRepository tapahtumaRepository;
    @Mock LippuRepository lippuRepository;

    TapahtumaRestController controller;

    @BeforeEach
    void setUp() {
        controller = new TapahtumaRestController(tapahtumaRepository, lippuRepository);
    }

    @Test
    void getAllTapahtumatReturnsList() {
        Tapahtuma t = new Tapahtuma("Festari");
        when(tapahtumaRepository.findAll()).thenReturn(List.of(t));
        assertThat(controller.getAllTapahtumat()).containsExactly(t);
    }

    @Test
    void addTapahtumaSaves() {
        Tapahtuma t = new Tapahtuma("Festari");
        when(tapahtumaRepository.save(t)).thenReturn(t);
        assertThat(controller.addTapahtuma(t)).isSameAs(t);
    }

    @Test
    void updateTapahtumaSetsPathId() {
        Tapahtuma t = new Tapahtuma("Uusi nimi");
        when(tapahtumaRepository.save(t)).thenReturn(t);

        Tapahtuma result = controller.updateTapahtuma(5L, t);

        assertThat(result.getId()).isEqualTo(5L);
        verify(tapahtumaRepository).save(t);
    }

    @Test
    void deleteTapahtumaDeletesAndReturnsRemaining() {
        when(tapahtumaRepository.findAll()).thenReturn(List.of());
        assertThat(controller.deleteTapahtuma(1L)).isEmpty();
        verify(tapahtumaRepository).deleteById(1L);
    }

    @Test
    void getTapahtumatByJarjestajaUsesRepository() {
        Tapahtuma t = new Tapahtuma("Festari");
        when(tapahtumaRepository.findByJarjestajaId(2L)).thenReturn(List.of(t));
        assertThat(controller.getTapahtumatByJarjestaja(2L)).containsExactly(t);
    }

    @Test
    void getLiputByTapahtumaGroupsTicketsBySessionId() {
        // liput-kenttään ei ole setteriä, joten käytetään mockattua Esityskertaa
        Esityskerta mock1 = org.mockito.Mockito.mock(Esityskerta.class);
        when(mock1.getId()).thenReturn(10L);
        Lippu lippu = new Lippu();
        when(mock1.getLiput()).thenReturn(List.of(lippu));

        Tapahtuma t = new Tapahtuma("Festari");
        t.setEsityskerrat(List.of(mock1));
        when(tapahtumaRepository.findById(1L)).thenReturn(Optional.of(t));

        Map<Long, List<Lippu>> result = controller.getLiputByTapahtuma(1L);

        assertThat(result).containsOnlyKeys(10L);
        assertThat(result.get(10L)).containsExactly(lippu);
    }

    @Test
    void getLiputByTapahtumaReturnsNullWhenEventMissing() {
        when(tapahtumaRepository.findById(99L)).thenReturn(Optional.empty());
        assertThat(controller.getLiputByTapahtuma(99L)).isNull();
    }

    @Test
    void getLiputByEsityskertaUsesRepository() {
        Lippu lippu = new Lippu();
        when(lippuRepository.findByEsityskertaIdAndEsityskertaTapahtumaId(7L, 3L)).thenReturn(List.of(lippu));
        assertThat(controller.getLiputByEsityskerta(3L, 7L)).containsExactly(lippu);
    }
}

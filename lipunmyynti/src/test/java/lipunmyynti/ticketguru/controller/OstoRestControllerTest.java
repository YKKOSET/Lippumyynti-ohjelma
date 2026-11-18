package lipunmyynti.ticketguru.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.sql.Timestamp;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import lipunmyynti.ticketguru.model.Osto;
import lipunmyynti.ticketguru.repository.LippuRepository;
import lipunmyynti.ticketguru.repository.OstoRepository;
import lipunmyynti.ticketguru.repository.OstoriviRepository;

@ExtendWith(MockitoExtension.class)
class OstoRestControllerTest {

    @Mock OstoRepository ostoRepository;
    @Mock OstoriviRepository ostoriviRepository;
    @Mock LippuRepository lippuRepository;

    OstoRestController controller;
    Osto osto;

    @BeforeEach
    void setUp() {
        controller = new OstoRestController(ostoRepository, ostoriviRepository, lippuRepository);
        osto = new Osto(new Timestamp(System.currentTimeMillis() - 1000), 25.0, null);
        osto.setId(1L);
    }

    @Test
    void getAllOstotReturnsList() {
        when(ostoRepository.findAll()).thenReturn(List.of(osto));
        assertThat(controller.getAllOstot()).containsExactly(osto);
    }

    @Test
    void addOstoSavesAndReturns() {
        when(ostoRepository.save(osto)).thenReturn(osto);
        assertThat(controller.addOsto(osto)).isSameAs(osto);
        verify(ostoRepository).save(osto);
    }

    @Test
    void getOstoByIdReturnsOsto() {
        when(ostoRepository.findById(1L)).thenReturn(Optional.of(osto));
        assertThat(controller.getOstoById(1L)).isSameAs(osto);
    }

    @Test
    void getOstoByIdThrowsWhenMissing() {
        when(ostoRepository.findById(99L)).thenReturn(Optional.empty());
        assertThatThrownBy(() -> controller.getOstoById(99L)).isInstanceOf(NoSuchElementException.class);
    }

    @Test
    void deleteOstoDeletesAndReturnsRemaining() {
        when(ostoRepository.findAll()).thenReturn(List.of());
        assertThat(controller.deleteOsto(1L)).isEmpty();
        verify(ostoRepository).deleteById(1L);
    }

    // updateOsto: tallentaa kun osto on olemassa, muuten heittää NoSuchElementExceptionin (-> 404)
    @Test
    void updateOstoSavesWithGivenIdWhenExists() {
        when(ostoRepository.existsById(1L)).thenReturn(true);
        when(ostoRepository.save(osto)).thenReturn(osto);
        Osto paivitys = osto;
        paivitys.setId(null);

        Osto result = controller.updateOsto(1L, paivitys);

        assertThat(result.getId()).isEqualTo(1L);
        verify(ostoRepository).save(paivitys);
    }

    @Test
    void updateOstoThrowsWhenMissing() {
        when(ostoRepository.existsById(99L)).thenReturn(false);
        when(ostoRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> controller.updateOsto(99L, osto)).isInstanceOf(NoSuchElementException.class);
        verify(ostoRepository, never()).save(osto);
    }
}

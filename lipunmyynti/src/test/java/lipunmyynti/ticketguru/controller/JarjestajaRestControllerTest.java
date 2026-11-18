package lipunmyynti.ticketguru.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import lipunmyynti.ticketguru.model.Jarjestaja;
import lipunmyynti.ticketguru.repository.JarjestajaRepository;

@ExtendWith(MockitoExtension.class)
class JarjestajaRestControllerTest {

    @Mock JarjestajaRepository repository;

    JarjestajaRestController controller;
    Jarjestaja j;

    @BeforeEach
    void setUp() {
        controller = new JarjestajaRestController(repository);
        j = new Jarjestaja("Matti", "Halminen", "matti@kukat.fi", "0401234567");
    }

    @Test
    void getAllReturnsList() {
        when(repository.findAll()).thenReturn(List.of(j));
        assertThat(controller.getAlljarjestajat()).containsExactly(j);
    }

    @Test
    void addSavesOrganizer() {
        when(repository.save(j)).thenReturn(j);
        assertThat(controller.addJarjestaja(j)).isSameAs(j);
    }

    @Test
    void updateSetsIdFromPath() {
        when(repository.save(j)).thenReturn(j);
        assertThat(controller.updateJarjestaja(4L, j).getId()).isEqualTo(4L);
    }

    @Test
    void getByIdReturnsOrganizer() {
        when(repository.findById(1L)).thenReturn(Optional.of(j));
        assertThat(controller.getJarjestajaById(1L)).isSameAs(j);
    }

    @Test
    void getByIdReturnsNullWhenMissing() {
        when(repository.findById(1L)).thenReturn(Optional.empty());
        assertThat(controller.getJarjestajaById(1L)).isNull();
    }
}

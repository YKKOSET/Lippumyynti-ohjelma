package lipunmyynti.ticketguru.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import lipunmyynti.ticketguru.exception.LiianVahanLippujaException;
import lipunmyynti.ticketguru.model.Esityskerta;
import lipunmyynti.ticketguru.model.Lippu;
import lipunmyynti.ticketguru.model.Lipputyyppi;
import lipunmyynti.ticketguru.repository.EsityskertaRepository;
import lipunmyynti.ticketguru.repository.LippuRepository;
import lipunmyynti.ticketguru.repository.LipputyyppiRepository;
import lipunmyynti.ticketguru.service.QrCodeService;

/** Testaa paikkarajoituksen, eli lippuja ei voi luoda eikä myydä yli maxOsallistujat. */
@ExtendWith(MockitoExtension.class)
class LippuKapasiteettiTest {

    @Mock LippuRepository lippuRepository;
    @Mock EsityskertaRepository esityskertaRepository;
    @Mock LipputyyppiRepository lipputyyppiRepository;
    @Mock QrCodeService qrCodeService;

    LippuRestController controller;
    Esityskerta esityskerta;
    Lipputyyppi tyyppi;

    @BeforeEach
    void setUp() {
        controller = new LippuRestController(lippuRepository, esityskertaRepository, lipputyyppiRepository, qrCodeService);

        // Esityskerta, jolla on 10 paikkaa
        esityskerta = new Esityskerta(null, null, 10, Timestamp.valueOf(LocalDateTime.now().plusDays(1)));
        esityskerta.setId(1L);

        tyyppi = new Lipputyyppi("Normaali");
        tyyppi.setId_(1L);
    }

    private Lippu uusiLippu() {
        return new Lippu(esityskerta, tyyppi, new BigDecimal("20.00"), false, false);
    }

    // ---------- POST /api/liput ----------

    @Test
    void luoLippuOnnistuuKunPaikkojaOnJaljella() {
        when(esityskertaRepository.findById(1L)).thenReturn(Optional.of(esityskerta));
        when(lipputyyppiRepository.findById(1L)).thenReturn(Optional.of(tyyppi));
        when(lippuRepository.countByEsityskertaId(1L)).thenReturn(9L);
        when(lippuRepository.save(any(Lippu.class))).thenAnswer(inv -> inv.getArgument(0));

        // ServletUriComponentsBuilder tarvitsee pyyntökontekstia
        // käytetään apuna MockHttpServletRequestia
        org.springframework.mock.web.MockHttpServletRequest req = new org.springframework.mock.web.MockHttpServletRequest();
        org.springframework.web.context.request.RequestContextHolder.setRequestAttributes(
                new org.springframework.web.context.request.ServletRequestAttributes(req));
        try {
            ResponseEntity<Lippu> vastaus = controller.luoLippu(uusiLippu());
            assertThat(vastaus.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        } finally {
            org.springframework.web.context.request.RequestContextHolder.resetRequestAttributes();
        }
    }

    @Test
    void luoLippuHeittaaVirheenKunEsityskertaOnTaynna() {
        when(esityskertaRepository.findById(1L)).thenReturn(Optional.of(esityskerta));
        when(lipputyyppiRepository.findById(1L)).thenReturn(Optional.of(tyyppi));
        when(lippuRepository.countByEsityskertaId(1L)).thenReturn(10L);

        assertThatThrownBy(() -> controller.luoLippu(uusiLippu()))
                .isInstanceOf(LiianVahanLippujaException.class)
                .hasMessage("Lippuja ei ole tarpeeksi");
        verify(lippuRepository, never()).save(any());
    }

    // ---------- GET /api/liput/saatavuus ----------

    @Test
    void saatavuusTrueKunMaaraMahtuu() {
        when(esityskertaRepository.findById(1L)).thenReturn(Optional.of(esityskerta));
        when(lippuRepository.countByEsityskertaIdAndOstettuTrue(1L)).thenReturn(5L);

        LippuRestController.Saatavuus s = controller.tarkistaSaatavuus(1L, 5).getBody();

        assertThat(s.saatavilla()).isTrue();
        assertThat(s.jaljella()).isEqualTo(5);
    }

    @Test
    void saatavuusFalseKunJaljellaOnVahemmanKuinHalutaan() {
        when(esityskertaRepository.findById(1L)).thenReturn(Optional.of(esityskerta));
        when(lippuRepository.countByEsityskertaIdAndOstettuTrue(1L)).thenReturn(8L); // jäljellä 2

        LippuRestController.Saatavuus s = controller.tarkistaSaatavuus(1L, 5).getBody();

        assertThat(s.saatavilla()).isFalse();
        assertThat(s.jaljella()).isEqualTo(2);
        assertThat(s.viesti()).isEqualTo("Lippuja ei ole tarpeeksi");
    }

    @Test
    void saatavuusPalauttaa404KunEsityskertaaEiOle() {
        when(esityskertaRepository.findById(99L)).thenReturn(Optional.empty());

        assertThat(controller.tarkistaSaatavuus(99L, 1).getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    // ---------- PATCH /api/liput/{id}/ostettu ----------

    @Test
    void merkitseOstetuksiHeittaaVirheenKunKaikkiPaikatMyyty() {
        UUID id = UUID.randomUUID();
        Lippu lippu = uusiLippu();
        lippu.setId(id);
        when(lippuRepository.findById(id)).thenReturn(Optional.of(lippu));
        when(lippuRepository.countByEsityskertaIdAndOstettuTrue(1L)).thenReturn(10L);

        assertThatThrownBy(() -> controller.merkitseOstetuksi(id))
                .isInstanceOf(LiianVahanLippujaException.class);
        assertThat(lippu.isOstettu()).isFalse();
        verify(lippuRepository, never()).save(any());
    }

    @Test
    void merkitseOstetuksiOnnistuuKunPaikkojaOnJaljella() {
        UUID id = UUID.randomUUID();
        Lippu lippu = uusiLippu();
        lippu.setId(id);
        when(lippuRepository.findById(id)).thenReturn(Optional.of(lippu));
        when(lippuRepository.countByEsityskertaIdAndOstettuTrue(1L)).thenReturn(9L);

        ResponseEntity<Lippu> vastaus = controller.merkitseOstetuksi(id);

        assertThat(vastaus.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(lippu.isOstettu()).isTrue();
    }
}

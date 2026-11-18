package lipunmyynti.ticketguru.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import lipunmyynti.ticketguru.model.Lippu;
import lipunmyynti.ticketguru.repository.EsityskertaRepository;
import lipunmyynti.ticketguru.repository.LippuRepository;
import lipunmyynti.ticketguru.repository.LipputyyppiRepository;
import lipunmyynti.ticketguru.service.QrCodeService;

@ExtendWith(MockitoExtension.class)
class LippuRestControllerTest {

    @Mock LippuRepository lippuRepository;
    @Mock EsityskertaRepository esityskertaRepository;
    @Mock LipputyyppiRepository lipputyyppiRepository;
    @Mock QrCodeService qrCodeService;

    LippuRestController controller;
    UUID id;
    Lippu lippu;

    @BeforeEach
    void setUp() {
        controller = new LippuRestController(lippuRepository, esityskertaRepository,
                lipputyyppiRepository, qrCodeService);
        id = UUID.randomUUID();
        lippu = new Lippu();
        lippu.setId(id);
        lippu.setHinta(new BigDecimal("10.00"));
    }

    @Test
    void getAllLiputReturnsRepositoryContents() {
        when(lippuRepository.findAll()).thenReturn(List.of(lippu));
        assertThat(controller.getAllLiput()).containsExactly(lippu);
    }

    @Test
    void getLippuByIdReturnsTicket() {
        when(lippuRepository.findById(id)).thenReturn(Optional.of(lippu));
        assertThat(controller.getLippuById(id)).isSameAs(lippu);
    }

    @Test
    void getLippuByIdReturnsNullWhenMissing() {
        when(lippuRepository.findById(id)).thenReturn(Optional.empty());
        assertThat(controller.getLippuById(id)).isNull();
    }

    @Test
    void merkitseKaytetyksiSetsFlagAndSaves() {
        when(lippuRepository.findById(id)).thenReturn(Optional.of(lippu));

        ResponseEntity<Lippu> response = controller.merkitseKaytetyksi(id);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody().isKaytetty()).isTrue();
        verify(lippuRepository).save(lippu);
    }

    @Test
    void merkitseKaytetyksiReturns404WhenMissing() {
        when(lippuRepository.findById(id)).thenReturn(Optional.empty());

        ResponseEntity<Lippu> response = controller.merkitseKaytetyksi(id);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        verify(lippuRepository, never()).save(any());
    }

    @Test
    void merkitseKayttamattomaksiClearsFlag() {
        lippu.setKaytetty(true);
        when(lippuRepository.findById(id)).thenReturn(Optional.of(lippu));

        ResponseEntity<Lippu> response = controller.merkitseKayttamattomaksi(id);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody().isKaytetty()).isFalse();
        verify(lippuRepository).save(lippu);
    }

    @Test
    void merkitseKayttamattomaksiReturns404WhenMissing() {
        when(lippuRepository.findById(id)).thenReturn(Optional.empty());
        assertThat(controller.merkitseKayttamattomaksi(id).getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    void merkitseOstetuksiSetsFlag() {
        when(lippuRepository.findById(id)).thenReturn(Optional.of(lippu));

        ResponseEntity<Lippu> response = controller.merkitseOstetuksi(id);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody().isOstettu()).isTrue();
        verify(lippuRepository).save(lippu);
    }

    @Test
    void merkitseOstetuksiReturns404WhenMissing() {
        when(lippuRepository.findById(id)).thenReturn(Optional.empty());
        assertThat(controller.merkitseOstetuksi(id).getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    void merkitseOstamattomaksiClearsFlag() {
        lippu.setOstettu(true);
        when(lippuRepository.findById(id)).thenReturn(Optional.of(lippu));

        ResponseEntity<Lippu> response = controller.merkitseOstamattomaksi(id);

        assertThat(response.getBody().isOstettu()).isFalse();
        verify(lippuRepository).save(lippu);
    }

    @Test
    void merkitseOstamattomaksiReturns404WhenMissing() {
        when(lippuRepository.findById(id)).thenReturn(Optional.empty());
        assertThat(controller.merkitseOstamattomaksi(id).getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    void getLippuQrReturnsPng() throws Exception {
        byte[] png = {1, 2, 3};
        when(lippuRepository.findById(id)).thenReturn(Optional.of(lippu));
        when(qrCodeService.qrgen(id.toString(), 300, 300)).thenReturn(png);

        ResponseEntity<byte[]> response = controller.getLippuQr(id);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getHeaders().getContentType()).isEqualTo(MediaType.IMAGE_PNG);
        assertThat(response.getBody()).isEqualTo(png);
    }

    @Test
    void getLippuQrReturns404WhenMissing() throws Exception {
        when(lippuRepository.findById(id)).thenReturn(Optional.empty());

        ResponseEntity<byte[]> response = controller.getLippuQr(id);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        verify(qrCodeService, never()).qrgen(any(), org.mockito.ArgumentMatchers.anyInt(),
                org.mockito.ArgumentMatchers.anyInt());
    }

    @Test
    void poistaLippuDeletesExisting() {
        when(lippuRepository.existsById(id)).thenReturn(true);

        ResponseEntity<Void> response = controller.poistaLippu(id);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
        verify(lippuRepository).deleteById(id);
    }

    @Test
    void poistaLippuReturns404WhenMissing() {
        when(lippuRepository.existsById(id)).thenReturn(false);

        ResponseEntity<Void> response = controller.poistaLippu(id);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        verify(lippuRepository, never()).deleteById(any());
    }
}

package lipunmyynti.ticketguru.model;

import static org.assertj.core.api.Assertions.assertThat;

import java.sql.Timestamp;
import java.time.LocalDateTime;

import org.junit.jupiter.api.Test;

/** Yksikkötestit esityskerran paikkalaskennalle (ei Springiä, ei tietokantaa). */
class EsityskertaKapasiteettiTest {

    private Esityskerta esityskerta(int max) {
        return new Esityskerta(null, null, max, Timestamp.valueOf(LocalDateTime.now().plusDays(1)));
    }

    @Test
    void vapaitaPaikkojaLaskeeJaljellaOlevat() {
        assertThat(esityskerta(100).vapaitaPaikkoja(30)).isEqualTo(70);
    }

    @Test
    void vapaitaPaikkojaEiKoskaanNegatiivinen() {
        assertThat(esityskerta(10).vapaitaPaikkoja(15)).isZero();
    }

    @Test
    void onTilaaTrueKunMahtuu() {
        assertThat(esityskerta(10).onTilaa(8, 2)).isTrue();
    }

    @Test
    void onTilaaFalseKunHaluttuYlittaaJaljella() {
        // jäljellä 2, halutaan 5 -> heti false
        assertThat(esityskerta(10).onTilaa(8, 5)).isFalse();
    }

    @Test
    void onTilaaFalseKunTäynnä() {
        assertThat(esityskerta(10).onTilaa(10, 1)).isFalse();
    }

    @Test
    void onTilaaFalseKunMaksimiOnNolla() {
        assertThat(esityskerta(0).onTilaa(0, 1)).isFalse();
    }

    @Test
    void onTilaaFalseKunHaluttuEiOlePositiivinen() {
        assertThat(esityskerta(10).onTilaa(0, 0)).isFalse();
    }
}

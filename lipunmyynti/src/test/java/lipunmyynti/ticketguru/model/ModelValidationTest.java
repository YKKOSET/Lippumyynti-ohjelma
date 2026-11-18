package lipunmyynti.ticketguru.model;

import static org.assertj.core.api.Assertions.assertThat;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.LocalDateTime;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;

class ModelValidationTest {

    private static ValidatorFactory factory;
    private static Validator validator;

    @BeforeAll
    static void init() {
        factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @AfterAll
    static void close() {
        factory.close();
    }

    // ---------- Asiakas ----------
    @Test
    void validAsiakasHasNoViolations() {
        assertThat(validator.validate(new Asiakas("Jordi", "Alba", "jordi@gmail.com", "+358 878 8473289"))).isEmpty();
    }

    @Test
    void asiakasInvalidEmailFails() {
        assertThat(validator.validate(new Asiakas("A", "B", "ei-sahkoposti", "0401234567"))).hasSize(1);
    }

    @Test
    void asiakasPhoneWithLettersFails() {
        assertThat(validator.validate(new Asiakas("A", "B", "a@b.fi", "04012abc"))).isNotEmpty();
    }

    @Test
    void asiakasEtunimiOver50CharsFails() {
        assertThat(validator.validate(new Asiakas("x".repeat(51), "B", "a@b.fi", "0401234567"))).hasSize(1);
    }

    // ---------- Jarjestaja ----------
    @Test
    void validJarjestajaHasNoViolations() {
        assertThat(validator.validate(new Jarjestaja("Matti", "Halminen", "matti@kukat.fi", "+358401234567"))).isEmpty();
    }

    @Test
    void jarjestajaPhoneWithSpacesFails() {
        // Järjestäjän puhelinnumerossa ei sallita välilyöntejä (toisin kuin Asiakkaalla)
        assertThat(validator.validate(new Jarjestaja("M", "H", "m@k.fi", "040 123 4567"))).isNotEmpty();
    }

    @Test
    void jarjestajaInvalidEmailFails() {
        assertThat(validator.validate(new Jarjestaja("M", "H", "virhe", "0401234567"))).isNotEmpty();
    }

    // ---------- Lippu ----------
    private Lippu lippu(BigDecimal hinta) {
        Esityskerta e = new Esityskerta(null, Timestamp.valueOf(LocalDateTime.now().plusDays(1)));
        return new Lippu(e, new Lipputyyppi("Normaali"), hinta, false, false);
    }

    @Test
    void validLippuHasNoViolations() {
        assertThat(validator.validate(lippu(new BigDecimal("20.00")))).isEmpty();
    }

    @Test
    void lippuNullPriceFails() {
        assertThat(validator.validate(lippu(null))).hasSize(1);
    }

    @Test
    void lippuPriceBelowMinimumFails() {
        assertThat(validator.validate(lippu(new BigDecimal("0.00")))).isNotEmpty();
    }

    @Test
    void lippuPriceWithThreeDecimalsFails() {
        assertThat(validator.validate(lippu(new BigDecimal("10.123")))).isNotEmpty();
    }

    @Test
    void lippuWithoutTypeFails() {
        Lippu l = lippu(new BigDecimal("10.00"));
        l.setLipputyyppi(null);
        assertThat(validator.validate(l)).hasSize(1);
    }

    @Test
    void lippuWithoutEsityskertaFails() {
        Lippu l = lippu(new BigDecimal("10.00"));
        l.setEsityskerta(null);
        assertThat(validator.validate(l)).hasSize(1);
    }

    // ---------- Lipputyyppi ----------
    @Test
    void lipputyyppiBlankNameFails() {
        assertThat(validator.validate(new Lipputyyppi(" "))).isNotEmpty();
    }

    @Test
    void lipputyyppiTooShortNameFails() {
        assertThat(validator.validate(new Lipputyyppi("A"))).hasSize(1);
    }

    @Test
    void lipputyyppiValidNamePasses() {
        assertThat(validator.validate(new Lipputyyppi("Opiskelija"))).isEmpty();
    }

    // ---------- Esityskerta ----------
    @Test
    void esityskertaPastStartTimeFails() {
        Esityskerta e = new Esityskerta(null, Timestamp.valueOf(LocalDateTime.now().minusDays(1)));
        assertThat(validator.validate(e)).hasSize(1);
    }

    @Test
    void esityskertaNullStartTimeFails() {
        assertThat(validator.validate(new Esityskerta(null, null))).hasSize(1);
    }

    @Test
    void esityskertaFutureStartTimePasses() {
        Esityskerta e = new Esityskerta(null, Timestamp.valueOf(LocalDateTime.now().plusDays(1)));
        assertThat(validator.validate(e)).isEmpty();
    }

    // ---------- Osto ----------
    @Test
    void ostoFutureTimeFails() {
        Osto o = new Osto(Timestamp.valueOf(LocalDateTime.now().plusDays(1)), 10.0, null);
        assertThat(validator.validate(o)).hasSize(1);
    }

    @Test
    void ostoNegativeTotalFails() {
        Osto o = new Osto(Timestamp.valueOf(LocalDateTime.now().minusMinutes(1)), -1.0, null);
        assertThat(validator.validate(o)).hasSize(1);
    }

    @Test
    void ostoNullTimeFails() {
        assertThat(validator.validate(new Osto(null, 10.0, null))).hasSize(1);
    }

    @Test
    void validOstoPasses() {
        Osto o = new Osto(Timestamp.valueOf(LocalDateTime.now().minusMinutes(1)), 0.0, null);
        assertThat(validator.validate(o)).isEmpty();
    }

    // ---------- Ostorivi ----------
    @Test
    void ostoriviWithoutRequiredFieldsFails() {
        assertThat(validator.validate(new Ostorivi())).hasSize(3);
    }

    @Test
    void ostoriviNegativePriceFails() {
        Ostorivi r = new Ostorivi(new Osto(), new Lippu(), new BigDecimal("-0.01"));
        assertThat(validator.validate(r)).isNotEmpty();
    }

    // ---------- Tapahtuma ----------
    @Test
    void tapahtumaNullNameFails() {
        assertThat(validator.validate(new Tapahtuma((String) null))).hasSize(1);
    }

    @Test
    void tapahtumaNameOver200Fails() {
        assertThat(validator.validate(new Tapahtuma("x".repeat(201)))).hasSize(1);
    }

    @Test
    void tapahtumaValidNamePasses() {
        assertThat(validator.validate(new Tapahtuma("Ruislock 2026"))).isEmpty();
    }
}

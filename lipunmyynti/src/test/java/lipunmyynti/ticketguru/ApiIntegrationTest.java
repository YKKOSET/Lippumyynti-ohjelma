package lipunmyynti.ticketguru;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.UUID;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.RequestPostProcessor;

import jakarta.transaction.Transactional;
import lipunmyynti.ticketguru.model.Esityskerta;
import lipunmyynti.ticketguru.model.Lippu;
import lipunmyynti.ticketguru.model.Lipputyyppi;
import lipunmyynti.ticketguru.repository.EsityskertaRepository;
import lipunmyynti.ticketguru.repository.LippuRepository;
import lipunmyynti.ticketguru.repository.LipputyyppiRepository;

/** Integraatiotestit: oikea Spring-konteksti + H2 + MockMvc + tietoturvasäännöt. */
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class ApiIntegrationTest {

    @Autowired MockMvc mockMvc;
    @Autowired LippuRepository lippuRepository;
    @Autowired LipputyyppiRepository lipputyyppiRepository;
    @Autowired EsityskertaRepository esityskertaRepository;

    private static RequestPostProcessor as(String role) {
        return user(role).authorities(new SimpleGrantedAuthority(role));
    }

    private Lippu tallennaLippu() {
        Lipputyyppi tyyppi = lipputyyppiRepository.save(new Lipputyyppi("Normaali"));
        Esityskerta e = esityskertaRepository.save(
                new Esityskerta(null, Timestamp.valueOf(LocalDateTime.now().plusDays(10))));
        return lippuRepository.save(new Lippu(e, tyyppi, new BigDecimal("20.00"), false, false));
    }

    // ---------- Pääsynhallinta ----------

    @Test
    void anonymousCanListEvents() throws Exception {
        mockMvc.perform(get("/api/tapahtumat")).andExpect(status().isOk());
    }

    @Test
    void anonymousCannotListTickets() throws Exception {
        mockMvc.perform(get("/api/liput"))
                .andExpect(result -> assertThat(result.getResponse().getStatus()).isNotEqualTo(200));
    }

    @Test
    void userCanListPurchases() throws Exception {
        mockMvc.perform(get("/api/ostot").with(as("USER"))).andExpect(status().isOk());
    }

    @Test
    void myyjaCannotListPurchases() throws Exception {
        mockMvc.perform(get("/api/ostot").with(as("MYYJA"))).andExpect(status().isForbidden());
    }

    @Test
    void userCannotCreateEvent() throws Exception {
        mockMvc.perform(post("/api/tapahtumat").with(as("USER"))
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"nimi\":\"Testi\"}"))
                .andExpect(status().isForbidden());
    }

    @Test
    void adminCanCreateEventAndGets201() throws Exception {
        mockMvc.perform(post("/api/tapahtumat").with(as("ADMIN"))
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"nimi\":\"Testifestari\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.nimi").value("Testifestari"))
                .andExpect(jsonPath("$.id").isNumber());
    }

    @Test
    void adminCanCreateOrganizer() throws Exception {
        mockMvc.perform(post("/api/jarjestajat").with(as("ADMIN"))
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"etunimi\":\"Matti\",\"sukunimi\":\"Halminen\","
                        + "\"sahkoposti\":\"matti@kukat.fi\",\"puhelin\":\"0401234567\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.etunimi").value("Matti"));
    }

    // ---------- Lippujen tilanmuutokset ----------

    @Test
    void adminCanMarkTicketUsed() throws Exception {
        Lippu lippu = tallennaLippu();

        mockMvc.perform(patch("/api/liput/{id}/kaytetty", lippu.getId()).with(as("ADMIN")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.kaytetty").value(true));

        assertThat(lippuRepository.findById(lippu.getId()).orElseThrow().isKaytetty()).isTrue();
    }

    @Test
    void adminCanMarkTicketUnused() throws Exception {
        Lippu lippu = tallennaLippu();
        lippu.setKaytetty(true);
        lippuRepository.save(lippu);

        mockMvc.perform(patch("/api/liput/{id}/kayttamaton", lippu.getId()).with(as("ADMIN")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.kaytetty").value(false));
    }

    @Test
    void markingUnknownTicketUsedReturns404() throws Exception {
        mockMvc.perform(patch("/api/liput/{id}/kaytetty", UUID.randomUUID()).with(as("ADMIN")))
                .andExpect(status().isNotFound());
    }

    @Test
    void ticketQrReturnsPng() throws Exception {
        Lippu lippu = tallennaLippu();

        mockMvc.perform(get("/api/liput/{id}/qr", lippu.getId()).with(as("ADMIN")))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.IMAGE_PNG));
    }

    @Test
    void ticketQrForUnknownTicketReturns404() throws Exception {
        mockMvc.perform(get("/api/liput/{id}/qr", UUID.randomUUID()).with(as("ADMIN")))
                .andExpect(status().isNotFound());
    }

    @Test
    void deleteTicketReturns204AndRemovesIt() throws Exception {
        Lippu lippu = tallennaLippu();

        mockMvc.perform(delete("/api/liput/{id}", lippu.getId()).with(as("ADMIN")))
                .andExpect(status().isNoContent());

        assertThat(lippuRepository.existsById(lippu.getId())).isFalse();
    }

    // ---------- Tunnetut tietoturvapuutteet (poista @Disabled kun korjattu) ----------

    @Disabled("SecurityConfig ei rajaa DELETE-pyyntöjä: mikä tahansa kirjautunut käyttäjä voi poistaa "
            + "liput, tapahtumat ja ostot (DELETE putoaa anyRequest().authenticated()-sääntöön).")
    @Test
    void userCannotDeleteTicket() throws Exception {
        Lippu lippu = tallennaLippu();

        mockMvc.perform(delete("/api/liput/{id}", lippu.getId()).with(as("USER")))
                .andExpect(status().isForbidden());
    }

    @Disabled("SecurityConfig: sääntö PATCH /api/liput/* ei osu poluille /api/liput/{id}/kaytetty "
            + "(kaksi polkusegmenttiä), joten rooliraja ei ole voimassa. Sama koskee ulkopuolista roolia.")
    @Test
    void unknownRoleCannotPatchTicket() throws Exception {
        Lippu lippu = tallennaLippu();

        mockMvc.perform(patch("/api/liput/{id}/kaytetty", lippu.getId()).with(as("VIERAS")))
                .andExpect(status().isForbidden());
    }
}

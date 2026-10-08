package lipunmyynti.ticketguru;

import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.web.servlet.MockMvc;

import lipunmyynti.ticketguru.model.*;
import lipunmyynti.ticketguru.controller.SecurityConfig;

import tools.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import org.springframework.security.test.context.support.WithMockUser;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

@SpringBootTest
@AutoConfigureMockMvc
// @Transactional //non-permanental changes
// @AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
// //allready for db

public class RestSecurityTest {

    @Autowired
    private MockMvc mockMvc;

    // ADMIN sees events:
    @Test
    public void testGETAllEvents() throws Exception {
        mockMvc.perform(
                get("/api/tapahtumat")
                        .with(user("ADMIN")
                                .authorities(new SimpleGrantedAuthority("ADMIN"))))
                .andExpect(status().isOk());
    }

    // USER cannot see organizers:
    @Test
    public void testGETAllEventsWithoutAdmin() throws Exception {
        mockMvc.perform(
                get("/api/jarjestajat")
                        .with(user("USER")
                                .authorities(new SimpleGrantedAuthority("USER"))))
                .andExpect(status().isForbidden());
    }

}

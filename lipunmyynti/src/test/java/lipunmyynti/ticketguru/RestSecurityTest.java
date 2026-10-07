package lipunmyynti.ticketguru;

import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.web.servlet.MockMvc;

import lipunmyynti.ticketguru.model.*;
import tools.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import org.springframework.security.test.context.support.WithMockUser;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
// @AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)

// TOIMIMATON VIELÄ, JATKAN TÄTÄ MYÖHEMMIN :)

public class RestSecurityTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    // events
    @Test
    public void testGETAllEvents() throws Exception {
        mockMvc.perform(get("/api/tapahtumat"))
                .andExpect(status().isOk());
    }

}

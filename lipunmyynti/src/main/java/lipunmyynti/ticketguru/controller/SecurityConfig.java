package lipunmyynti.ticketguru.controller;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableMethodSecurity(securedEnabled = true)

public class SecurityConfig {

        @Bean
        public SecurityFilterChain configure(HttpSecurity http) throws Exception {
                http
                                .csrf(csrf -> csrf.disable())
                                .authorizeHttpRequests(authorize -> authorize
                                                .requestMatchers("/css/**").permitAll()
                                                .requestMatchers("/h2-console/**").permitAll()
                                                .requestMatchers(HttpMethod.GET, "/api/tapahtumat").permitAll()
                                                .requestMatchers(HttpMethod.GET, "/api/**").hasAuthority("ADMIN")
                                                .requestMatchers(HttpMethod.POST, "/api/**")
                                                .hasAuthority("ADMIN")
                                                .requestMatchers(HttpMethod.PUT, "/api/**")
                                                .hasAuthority("ADMIN")
                                                .anyRequest().authenticated())

                                .httpBasic(Customizer.withDefaults()) // Postman's login

                                .headers(headers -> headers.frameOptions(frameOptions -> frameOptions
                                                .disable())) // h2-console

                                .formLogin(formlogin -> formlogin
                                                .defaultSuccessUrl("/api/tapahtumat", true)
                                                .permitAll())
                                .logout(logout -> logout
                                                .permitAll());

                return http.build();
        }

        @Bean
        public PasswordEncoder passwordEncoder() {
                return new BCryptPasswordEncoder();
        }
}

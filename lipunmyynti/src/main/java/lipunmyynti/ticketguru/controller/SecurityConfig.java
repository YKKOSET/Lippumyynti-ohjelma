package lipunmyynti.ticketguru.controller;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration 
@EnableWebSecurity
@EnableMethodSecurity (securedEnabled = true)
public class SecurityConfig {

    

    @Bean 
    public SecurityFilterChain configure(HttpSecurity http) throws Exception {
        http
        .authorizeHttpRequests(authorize -> authorize
            .requestMatchers("/css/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/tapahtumat").permitAll()
            .anyRequest().authenticated()
        )
        .formLogin( formlogin -> formlogin
            .defaultSuccessUrl("/api/tapahtumat", true)
            .permitAll()
        )
        .httpBasic(httpBasic -> {})
        .logout(logout -> logout
            .permitAll()
        );
        return http.build();
    }
    @Bean 
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }
}

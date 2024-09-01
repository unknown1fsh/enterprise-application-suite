package com.ecommerce.inventory_service.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf().disable()
            .authorizeHttpRequests(authorizeRequests -> authorizeRequests
                .requestMatchers("/inventory/health").permitAll() // Health endpoint'ini güvenlikten muaf tut
                .anyRequest().authenticated() // Diğer tüm istekler için kimlik doğrulama iste
            )
            .httpBasic(); // Temel kimlik doğrulamayı etkinleştir

        return http.build();
    }
}

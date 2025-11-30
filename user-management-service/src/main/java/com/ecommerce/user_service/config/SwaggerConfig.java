package com.ecommerce.user_service.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("User Management Service API")
                        .version("1.0.0")
                        .description("API documentation for User Management Service")
                        .contact(new Contact()
                                .name("Enterprise Application Suite")
                                .email("support@ecommerce.com")));
    }
}


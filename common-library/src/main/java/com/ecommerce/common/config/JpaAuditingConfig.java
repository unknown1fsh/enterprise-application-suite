package com.ecommerce.common.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@Configuration
@EnableJpaAuditing
@EnableJpaRepositories(
        basePackages = "com.ecommerce",
        repositoryBaseClass = com.ecommerce.common.repository.GenericRepositoryImpl.class
)
public class JpaAuditingConfig {
}


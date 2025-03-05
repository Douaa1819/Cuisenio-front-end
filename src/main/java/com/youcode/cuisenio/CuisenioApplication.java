package com.youcode.cuisenio;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
public class CuisenioApplication {
    public static void main(String[] args) {
        SpringApplication.run(CuisenioApplication.class, args);
    }
}



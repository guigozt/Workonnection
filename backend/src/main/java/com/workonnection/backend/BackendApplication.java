package com.workonnection.backend;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BackendApplication {

    public static void main(String[] args) {
        Dotenv dotenv = Dotenv.configure().directory("./").ignoreIfMissing().load();
        if (dotenv.entries().isEmpty()) {
            dotenv = Dotenv.configure().directory("../").ignoreIfMissing().load();
        }
        dotenv.entries().forEach(e -> {
            if (System.getProperty(e.getKey()) == null) {
                System.setProperty(e.getKey(), e.getValue());
            }
        });
        SpringApplication.run(BackendApplication.class, args);
    }
}
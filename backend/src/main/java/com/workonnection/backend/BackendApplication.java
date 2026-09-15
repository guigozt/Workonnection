package com.workonnection.backend;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import java.io.File;

@SpringBootApplication
public class BackendApplication {

    public static void main(String[] args) {
        String envPath = "./";
        if (!new File("./.env").exists() && new File("../.env").exists()) {
            envPath = "../";
        }
        
        try {
            Dotenv dotenv = Dotenv.configure().directory(envPath).ignoreIfMissing().load();
            dotenv.entries().forEach(e -> {
                if (System.getProperty(e.getKey()) == null) {
                    System.setProperty(e.getKey(), e.getValue());
                }
            });
        } catch (Exception e) {
            System.out.println("Warning: Could not load .env file");
        }
        
        SpringApplication.run(BackendApplication.class, args);
    }
}

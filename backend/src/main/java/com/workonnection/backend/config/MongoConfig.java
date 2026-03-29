package com.workonnection.backend.config;

import com.mongodb.client.MongoClients;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.MongoTemplate;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.Properties;

@Configuration
public class MongoConfig {

    @Bean
    public MongoTemplate mongoTemplate() throws IOException {
        Properties props = new Properties();
        props.load(new FileInputStream("local.env")); // carrega arquivo local
        String uri = props.getProperty("MONGO_URI");

        return new MongoTemplate(MongoClients.create(uri), "workonnection");
    }
}
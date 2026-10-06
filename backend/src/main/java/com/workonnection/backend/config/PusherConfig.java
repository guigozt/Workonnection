package com.workonnection.backend.config;

import com.pusher.rest.Pusher;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class PusherConfig {

    @Bean
    @ConditionalOnMissingBean
    public Pusher pusher(
            @Value("${pusher.app-id:}") String appId,
            @Value("${pusher.key:}") String key,
            @Value("${pusher.secret:}") String secret,
            @Value("${pusher.cluster:mt1}") String cluster
    ) {
        if (appId != null && !appId.isBlank() && key != null && !key.isBlank() && secret != null && !secret.isBlank()) {
            Pusher pusher = new Pusher(appId, key, secret);
            pusher.setCluster(cluster);
            pusher.setEncrypted(true);
            return pusher;
        }
        // Retorna uma instância dummy para permitir a inicialização do contexto sem credenciais
        return new Pusher("dummy", "dummy", "dummy");
    }
}

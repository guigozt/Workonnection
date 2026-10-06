package com.workonnection.backend.service;

import com.pusher.rest.Pusher;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class PusherService {

    private final Pusher pusher;

    public PusherService(
            @Value("${pusher.app-id:}") String appId,
            @Value("${pusher.key:}") String key,
            @Value("${pusher.secret:}") String secret,
            @Value("${pusher.cluster:mt1}") String cluster
    ) {
        Pusher p = null;
        try {
            if (appId != null && !appId.isBlank() && key != null && !key.isBlank()) {
                p = new Pusher(appId, key, secret);
                p.setCluster(cluster);
                p.setEncrypted(true);
            }
        } catch (Exception e) {
            System.err.println("Aviso: Falha ao inicializar Pusher Channels: " + e.getMessage());
        }
        this.pusher = p;
    }

    /**
     * Dispara um evento em tempo real para um canal específico do Pusher.
     */
    public void dispararEvento(String canal, String evento, Object dados) {
        if (pusher != null) {
            try {
                pusher.trigger(canal, evento, dados);
            } catch (Exception e) {
                System.err.println("Aviso: Erro ao disparar evento no Pusher (" + canal + " / " + evento + "): " + e.getMessage());
            }
        }
    }
}

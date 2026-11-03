package com.workonnection.backend.service;

import com.workonnection.backend.exception.ApiException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.mock.web.MockMultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;

import static org.junit.jupiter.api.Assertions.*;

class FileStorageServiceTest {

    @TempDir
    Path tempDir;

    private FileStorageService fileStorageService;

    @BeforeEach
    void setUp() {
        fileStorageService = new FileStorageService(tempDir.toString());
    }

    @Test
    @DisplayName("Deve armazenar fotos e documentos localmente quando Cloudinary não está configurado")
    void armazenarArquivosLocalmente() {
        MockMultipartFile foto = new MockMultipartFile("foto", "avatar.jpg", "image/jpeg", new byte[]{1, 2, 3, 4});
        String urlFoto = fileStorageService.armazenarFotoPerfil(foto);
        assertTrue(urlFoto.startsWith("/uploads/fotos/"));
        assertTrue(urlFoto.endsWith(".jpg"));

        MockMultipartFile doc = new MockMultipartFile("arquivo", "contrato.pdf", "application/pdf", new byte[]{5, 6, 7});
        String urlDoc = fileStorageService.armazenarDocumento(doc);
        assertTrue(urlDoc.startsWith("/uploads/documentos/"));
        assertTrue(urlDoc.endsWith(".pdf"));

        assertEquals(tempDir.toAbsolutePath().normalize(), fileStorageService.getUploadDirectory());
        assertTrue(Files.exists(tempDir.resolve("fotos")));
        assertTrue(Files.exists(tempDir.resolve("documentos")));
    }

    @Test
    @DisplayName("Deve validar arquivo vazio, tamanho acima de 10MB, sem extensão ou extensão proibida")
    void validarArquivosInvalidos() {
        assertThrows(ApiException.class, () -> fileStorageService.validarArquivo(null));

        MockMultipartFile vazio = new MockMultipartFile("f", "a.png", "image/png", new byte[0]);
        assertThrows(ApiException.class, () -> fileStorageService.validarArquivo(vazio));

        MockMultipartFile semPonto = new MockMultipartFile("f", "arquivoSemExtensao", "text/plain", new byte[]{1});
        assertThrows(ApiException.class, () -> fileStorageService.validarArquivo(semPonto));
        assertEquals("", fileStorageService.extrairExtensao("arquivoSemExtensao"));

        MockMultipartFile exe = new MockMultipartFile("f", "virus.exe", "application/octet-stream", new byte[]{1});
        assertThrows(ApiException.class, () -> fileStorageService.validarArquivo(exe));

        byte[] onzeMb = new byte[11 * 1024 * 1024];
        MockMultipartFile gigante = new MockMultipartFile("f", "grande.pdf", "application/pdf", onzeMb);
        assertThrows(ApiException.class, () -> fileStorageService.validarArquivo(gigante));
    }
}


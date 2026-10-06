package com.workonnection.backend.service;

import com.workonnection.backend.exception.ApiException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path uploadDirectory;
    private final List<String> extensoesPermitidas = Arrays.asList(".pdf", ".png", ".jpg", ".jpeg");
    private final long maxFileSize = 10 * 1024 * 1024; // 10MB

    public FileStorageService(@Value("${app.upload.dir:uploads}") String uploadDir) {
        this.uploadDirectory = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.uploadDirectory);
        } catch (IOException e) {
            throw new ApiException("Falha ao criar diretório de uploads: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public String armazenarArquivo(MultipartFile arquivo, String subpasta) {
        validarArquivo(arquivo);

        try {
            Path destinoSubpasta = this.uploadDirectory.resolve(subpasta).normalize();
            Files.createDirectories(destinoSubpasta);

            String nomeOriginal = arquivo.getOriginalFilename() != null ? arquivo.getOriginalFilename() : "documento";
            String extensao = extrairExtensao(nomeOriginal);
            String nomeUnico = UUID.randomUUID().toString() + extensao;

            Path destinoFinal = destinoSubpasta.resolve(nomeUnico).normalize();
            Files.copy(arquivo.getInputStream(), destinoFinal, StandardCopyOption.REPLACE_EXISTING);

            // Retorna URL relativa que é servida pelo ResourceHandler
            return "/uploads/" + subpasta + "/" + nomeUnico;
        } catch (IOException e) {
            throw new ApiException("Erro ao salvar arquivo no servidor: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public void validarArquivo(MultipartFile arquivo) {
        if (arquivo == null || arquivo.isEmpty()) {
            throw new ApiException("Nenhum arquivo enviado ou o arquivo está vazio", HttpStatus.BAD_REQUEST);
        }

        if (arquivo.getSize() > maxFileSize) {
            throw new ApiException("Tamanho máximo de arquivo excedido (limite: 10MB)", HttpStatus.BAD_REQUEST);
        }

        String nomeOriginal = arquivo.getOriginalFilename();
        if (nomeOriginal == null || !nomeOriginal.contains(".")) {
            throw new ApiException("Nome de arquivo inválido", HttpStatus.BAD_REQUEST);
        }

        String extensao = extrairExtensao(nomeOriginal).toLowerCase();
        if (!extensoesPermitidas.contains(extensao)) {
            throw new ApiException("Extensão não permitida (" + extensao + "). Permitidos: PDF, PNG, JPG, JPEG", HttpStatus.BAD_REQUEST);
        }
    }

    public String extrairExtensao(String nomeArquivo) {
        int index = nomeArquivo.lastIndexOf(".");
        if (index == -1) {
            return "";
        }
        return nomeArquivo.substring(index).toLowerCase();
    }

    public Path getUploadDirectory() {
        return uploadDirectory;
    }
}

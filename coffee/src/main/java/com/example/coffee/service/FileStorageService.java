package com.example.coffee.service;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileStorageService {

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    private Path uploadPath;

    @PostConstruct
    public void init() throws IOException {
        uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
    }

    public String storeFile(MultipartFile file, String subDir) throws IOException {
        if (file == null || file.isEmpty()) return null;

        String original = StringUtils.cleanPath(file.getOriginalFilename());
        String ext = "";
        int idx = original.lastIndexOf('.');
        if (idx >= 0) ext = original.substring(idx);

        String filename = UUID.randomUUID() + ext;

        Path dirPath = uploadPath;
        if (subDir != null && !subDir.isBlank()) {
            dirPath = uploadPath.resolve(subDir).normalize();
            if (!Files.exists(dirPath)) {
                Files.createDirectories(dirPath);
            }
        }

        Path target = dirPath.resolve(filename);
        Files.copy(file.getInputStream(), target);

        return (subDir == null || subDir.isBlank())
                ? filename
                : subDir + "/" + filename;
    }
}

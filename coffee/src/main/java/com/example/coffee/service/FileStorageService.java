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
import java.util.Set;
import java.util.UUID;

@Service
public class FileStorageService {

    private static final Set<String> ALLOWED_EXTENSIONS = Set.of(".jpg", ".jpeg", ".png", ".gif", ".webp");
    private static final Set<String> ALLOWED_MIME_TYPES = Set.of(
            "image/jpeg", "image/png", "image/gif", "image/webp"
    );
    private static final Set<String> ALLOWED_SUBDIRS = Set.of("thumbnail", "detail");

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

        // 서브디렉토리 검증
        if (subDir != null && !subDir.isBlank() && !ALLOWED_SUBDIRS.contains(subDir)) {
            throw new IllegalArgumentException("허용되지 않은 디렉토리입니다: " + subDir);
        }

        String original = StringUtils.cleanPath(file.getOriginalFilename());
        String ext = "";
        int idx = original.lastIndexOf('.');
        if (idx >= 0) ext = original.substring(idx).toLowerCase();

        // 파일 확장자 검증
        if (!ALLOWED_EXTENSIONS.contains(ext)) {
            throw new IllegalArgumentException("허용되지 않은 파일 형식입니다. (jpg, jpeg, png, gif, webp만 허용)");
        }

        // MIME 타입 검증
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_MIME_TYPES.contains(contentType)) {
            throw new IllegalArgumentException("허용되지 않은 파일 타입입니다.");
        }

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

    public boolean deleteFile(String filePath) {
        if (filePath == null || filePath.isBlank()) return false;

        try {
            Path target = uploadPath.resolve(filePath).normalize();
            // 경로 탐색 공격 방지
            if (!target.startsWith(uploadPath)) {
                return false;
            }
            return Files.deleteIfExists(target);
        } catch (IOException e) {
            return false;
        }
    }
}

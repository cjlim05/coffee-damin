package com.example.coffee.controller;

import com.example.coffee.dto.ProductRequest;
import com.example.coffee.dto.ProductResponse;
import com.example.coffee.service.FileStorageService;
import com.example.coffee.service.ProductService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;
    private final FileStorageService fileStorageService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    // =========================
    // 상품 등록 (multipart/form-data)
    // =========================
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ProductResponse createProduct(
            @RequestParam("productName") String productName,
            @RequestParam(value = "basePrice", required = false, defaultValue = "0") int basePrice,
            @RequestParam(value = "type", required = false) String type,
            @RequestParam(value = "nationality", required = false) String nationality,
            @RequestParam(value = "options", required = false) String optionsJson,
            @RequestPart(value = "thumbnail", required = false) MultipartFile thumbnail,
            @RequestPart(value = "detailImages", required = false) List<MultipartFile> detailImages
    ) throws IOException {

        ProductRequest req = ProductRequest.builder()
                .productName(productName)
                .basePrice(basePrice)
                .type(type)
                .nationality(nationality)
                .build();

        // 옵션 JSON 파싱
        if (optionsJson != null && !optionsJson.isEmpty()) {
            List<ProductRequest.OptionRequest> opts = objectMapper.readValue(
                    optionsJson,
                    new TypeReference<List<ProductRequest.OptionRequest>>() {}
            );
            req.setOptions(opts);
        }

        // 썸네일 저장
        if (thumbnail != null && !thumbnail.isEmpty()) {
            String fname = fileStorageService.storeFile(thumbnail, "thumbnail");
            req.setThumbnailImg(fname);
        }

        // 서비스 호출 (썸네일 + 상세 이미지 리스트 전달)
        return productService.createProduct(req, thumbnail, detailImages);
    }

    // =========================
    // 상품 수정 (multipart/form-data)
    // =========================
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ProductResponse updateProduct(
            @PathVariable Long id,
            @RequestParam("productName") String productName,
            @RequestParam(value = "basePrice", required = false, defaultValue = "0") int basePrice,
            @RequestParam(value = "type", required = false) String type,
            @RequestParam(value = "nationality", required = false) String nationality,
            @RequestParam(value = "options", required = false) String optionsJson,
            @RequestPart(value = "thumbnail", required = false) MultipartFile thumbnail,
            @RequestPart(value = "detailImages", required = false) List<MultipartFile> detailImages
    ) throws IOException {

        ProductRequest req = ProductRequest.builder()
                .productName(productName)
                .basePrice(basePrice)
                .type(type)
                .nationality(nationality)
                .build();

        // 옵션 JSON 파싱
        if (optionsJson != null && !optionsJson.isEmpty()) {
            List<ProductRequest.OptionRequest> opts = objectMapper.readValue(
                    optionsJson,
                    new TypeReference<List<ProductRequest.OptionRequest>>() {}
            );
            req.setOptions(opts);
        }

        // 썸네일 저장
        if (thumbnail != null && !thumbnail.isEmpty()) {
            String fname = fileStorageService.storeFile(thumbnail, "thumbnail");
            req.setThumbnailImg(fname);
        }

        // 서비스 호출 (썸네일 + 상세 이미지 리스트 전달)
        return productService.updateProduct(id, req, thumbnail, detailImages);
    }

    // =========================
    // 상품 삭제
    // =========================
    @DeleteMapping("/{id}")
    public void deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
    }

    // =========================
    // 전체 상품 조회
    // =========================
    @GetMapping
    public List<ProductResponse> getProducts() {
        return productService.getAllProducts();
    }
}

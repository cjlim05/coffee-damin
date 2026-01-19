package com.example.coffee.service;

import com.example.coffee.dto.ProductRequest;
import com.example.coffee.dto.ProductResponse;
import com.example.coffee.entity.Product;
import com.example.coffee.entity.ProductImage;
import com.example.coffee.entity.ProductOption;
import com.example.coffee.entity.ProductVariant;
import com.example.coffee.repository.ProductImageRepository;
import com.example.coffee.repository.ProductRepository;
import com.example.coffee.repository.ProductOptionRepository;
import com.example.coffee.repository.ProductVariantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductOptionRepository optionRepository;
    private final ProductVariantRepository variantRepository;
    private final ProductImageRepository productImageRepository;
    private final FileStorageService fileStorageService;

    /* =========================
       상품 생성
       ========================= */
    @Transactional
    public ProductResponse createProduct(
            ProductRequest request,
            MultipartFile thumbnail,
            List<MultipartFile> detailImages
    ) throws IOException {

        // 1. 썸네일 저장
        String thumbnailPath = fileStorageService.storeFile(thumbnail, "thumbnail");

        // 2. 상품 생성
        Product product = Product.builder()
                .productName(request.getProductName())
                .basePrice(request.getBasePrice())
                .type(request.getType())
                .continent(request.getContinent())
                .nationality(request.getNationality())
                .thumbnailImg(thumbnailPath)
                .build();

        productRepository.save(product);

        // 3. 상세 이미지 저장 (여러 장 + 순서)
        if (detailImages != null && !detailImages.isEmpty()) {
            int order = 1;
            for (MultipartFile file : detailImages) {
                String path = fileStorageService.storeFile(file, "detail");

                ProductImage img = ProductImage.builder()
                        .product(product)
                        .imageUrl(path)
                        .sortOrder(order++)
                        .build();

                productImageRepository.save(img);
            }
        }

        // 4. 옵션 + 재고
        if (request.getOptions() != null) {
            for (ProductRequest.OptionRequest opt : request.getOptions()) {
                ProductOption option = optionRepository.save(
                        ProductOption.builder()
                                .product(product)
                                .optionValue(opt.getOptionValue())
                                .extraPrice(opt.getExtraPrice())
                                .build()
                );

                variantRepository.save(
                        ProductVariant.builder()
                                .product(product)
                                .option(option)
                                .stock(opt.getStock())
                                .build()
                );
            }
        }

        return toResponse(product);
    }

    /* =========================
       전체 조회
       ========================= */
    @Transactional(readOnly = true)
    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    /* =========================
       상품 수정
       ========================= */
    @Transactional
    public ProductResponse updateProduct(
            Long id,
            ProductRequest request,
            MultipartFile thumbnail,
            List<MultipartFile> detailImages
    ) throws IOException {

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("상품 없음"));

        product.setProductName(request.getProductName());
        product.setBasePrice(request.getBasePrice());
        product.setType(request.getType());
        product.setContinent(request.getContinent());
        product.setNationality(request.getNationality());

        // 썸네일 변경
        if (thumbnail != null && !thumbnail.isEmpty()) {
            // 기존 썸네일 파일 삭제
            if (product.getThumbnailImg() != null) {
                fileStorageService.deleteFile(product.getThumbnailImg());
            }
            String thumbnailPath = fileStorageService.storeFile(thumbnail, "thumbnail");
            product.setThumbnailImg(thumbnailPath);
        }

        // 상세 이미지: 새 이미지가 있으면 기존 삭제 후 새로 저장
        if (detailImages != null && !detailImages.isEmpty()) {
            // 기존 상세 이미지 파일들 삭제
            List<ProductImage> oldImages = productImageRepository.findByProductOrderBySortOrder(product);
            for (ProductImage oldImg : oldImages) {
                fileStorageService.deleteFile(oldImg.getImageUrl());
            }
            productImageRepository.deleteByProduct(product);

            int order = 1;
            for (MultipartFile file : detailImages) {
                String path = fileStorageService.storeFile(file, "detail");

                productImageRepository.save(
                        ProductImage.builder()
                                .product(product)
                                .imageUrl(path)
                                .sortOrder(order++)
                                .build()
                );
            }
        }

        // 옵션/재고 업데이트
        if (request.getOptions() != null) {
            // 기존 삭제
            List<ProductOption> oldOptions = optionRepository.findByProduct(product);
            for (ProductOption option : oldOptions) {
                variantRepository.deleteByOption(option);
            }
            optionRepository.deleteByProduct(product);

            // 새로 저장
            for (ProductRequest.OptionRequest opt : request.getOptions()) {
                ProductOption option = optionRepository.save(
                        ProductOption.builder()
                                .product(product)
                                .optionValue(opt.getOptionValue())
                                .extraPrice(opt.getExtraPrice())
                                .build()
                );

                variantRepository.save(
                        ProductVariant.builder()
                                .product(product)
                                .option(option)
                                .stock(opt.getStock())
                                .build()
                );
            }
        }

        return toResponse(product);
    }

    /* =========================
       삭제
       ========================= */
    @Transactional
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("상품 없음"));

        // 썸네일 파일 삭제
        if (product.getThumbnailImg() != null) {
            fileStorageService.deleteFile(product.getThumbnailImg());
        }

        // 상세 이미지 파일들 삭제
        List<ProductImage> images = productImageRepository.findByProductOrderBySortOrder(product);
        for (ProductImage img : images) {
            fileStorageService.deleteFile(img.getImageUrl());
        }
        productImageRepository.deleteByProduct(product);

        List<ProductOption> options = optionRepository.findByProduct(product);
        for (ProductOption option : options) {
            variantRepository.deleteByOption(option);
        }
        optionRepository.deleteByProduct(product);

        productRepository.delete(product);
    }

    /* =========================
       Entity → DTO
       ========================= */
    private ProductResponse toResponse(Product product) {

        List<ProductResponse.ImageResponse> detailImages =
                productImageRepository.findByProductOrderBySortOrder(product)
                        .stream()
                        .map(img -> ProductResponse.ImageResponse.builder()
                                .imageId(img.getImageId())
                                .imageUrl(img.getImageUrl())
                                .sortOrder(img.getSortOrder())
                                .build())
                        .collect(Collectors.toList());

        // N+1 해결: 한 번에 모든 variant 조회 후 Map으로 변환
        Map<Long, Integer> stockMap = variantRepository.findByProduct(product)
                .stream()
                .collect(Collectors.toMap(
                        v -> v.getOption().getOptionId(),
                        ProductVariant::getStock
                ));

        List<ProductResponse.OptionResponse> options =
                optionRepository.findByProduct(product).stream()
                        .map(option -> ProductResponse.OptionResponse.builder()
                                .optionId(option.getOptionId())
                                .optionValue(option.getOptionValue())
                                .extraPrice(option.getExtraPrice())
                                .stock(stockMap.getOrDefault(option.getOptionId(), 0))
                                .build())
                        .collect(Collectors.toList());

        return ProductResponse.builder()
                .productId(product.getProductId())
                .productName(product.getProductName())
                .basePrice(product.getBasePrice())
                .type(product.getType())
                .continent(product.getContinent())
                .nationality(product.getNationality())
                .thumbnailImg(product.getThumbnailImg())
                .detailImages(detailImages)
                .options(options)
                .build();
    }
}

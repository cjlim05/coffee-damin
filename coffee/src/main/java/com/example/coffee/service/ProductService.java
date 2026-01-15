package com.example.coffee.service;

import com.example.coffee.dto.ProductRequest;
import com.example.coffee.dto.ProductResponse;
import com.example.coffee.entity.Category;
import com.example.coffee.entity.Product;
import com.example.coffee.entity.ProductImage;
import com.example.coffee.entity.ProductOption;
import com.example.coffee.entity.ProductVariant;
import com.example.coffee.repository.CategoryRepository;
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
                .nationality(request.getNationality())
                .thumbnailImg(thumbnailPath)
                .build();

        productRepository.save(product);

        // 3. 상세 이미지 저장 (여러 장 + 순서)
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

        // 4. 옵션 + 재고
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
        product.setNationality(request.getNationality());

        // 썸네일 변경
        if (thumbnail != null && !thumbnail.isEmpty()) {
            String thumbnailPath = fileStorageService.storeFile(thumbnail, "thumbnail");
            product.setThumbnailImg(thumbnailPath);
        }

        // 기존 상세 이미지 삭제
        productImageRepository.deleteByProduct(product);

        // 새 상세 이미지 저장
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

        // 기존 옵션/재고 삭제
        List<ProductOption> options = optionRepository.findByProduct(product);
        for (ProductOption option : options) {
            variantRepository.deleteByOption(option);
        }
        optionRepository.deleteByProduct(product);

        // 새 옵션/재고
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

        return toResponse(product);
    }

    /* =========================
       삭제
       ========================= */
    @Transactional
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("상품 없음"));

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

        List<ProductResponse.ImageResponse> images =
                productImageRepository.findByProductOrderBySortOrder(product)
                        .stream()
                        .map(img -> ProductResponse.ImageResponse.builder()
                                .imageId(img.getImageId())
                                .imageUrl(img.getImageUrl())
                                .sortOrder(img.getSortOrder())
                                .build())
                        .collect(Collectors.toList());

        List<ProductResponse.OptionResponse> options =
                optionRepository.findByProduct(product).stream()
                        .map(option -> {
                            ProductVariant variant =
                                    variantRepository.findByProductAndOption(product, option).orElse(null);

                            return ProductResponse.OptionResponse.builder()
                                    .optionId(option.getOptionId())
                                    .optionValue(option.getOptionValue())
                                    .extraPrice(option.getExtraPrice())
                                    .stock(variant != null ? variant.getStock() : 0)
                                    .build();
                        })
                        .collect(Collectors.toList());

        return ProductResponse.builder()
                .productId(product.getProductId())
                .productName(product.getProductName())
                .basePrice(product.getBasePrice())
                .type(product.getType())
                .nationality(product.getNationality())
                .thumbnailImg(product.getThumbnailImg())
                .images(images)
                .options(options)
                .build();
    }
}

# Coffee Admin Database Schema

어드민 페이지에서 사용하는 데이터베이스 스키마 문서입니다.

## 테이블 관계도

```
                    ┌─────────────┐
                    │   product   │
                    └──────┬──────┘
                           │
         ┌─────────────────┼─────────────────┐
         │ 1:N             │ 1:N             │ 1:N
         ▼                 ▼                 ▼
┌─────────────────┐ ┌─────────────┐ ┌─────────────────┐
│ product_option  │ │product_image│ │ product_variant │
└────────┬────────┘ └─────────────┘ └─────────────────┘
         │                                   │
         └───────────────────────────────────┘
                         1:1
              (option_id로 연결)
```

---

## 테이블 목록

| 테이블 | 설명 |
|--------|------|
| `product` | 원두 상품 기본 정보 |
| `product_option` | 상품 옵션 (용량별 추가금액) |
| `product_variant` | 옵션별 재고 관리 |
| `product_image` | 상품 상세 이미지 |

---

## 테이블 상세

### 1. product (상품)

| 컬럼 | 타입 | NULL | 설명 |
|------|------|------|------|
| product_id | BIGINT | PK | 상품 ID |
| product_name | VARCHAR(200) | NO | 상품명 |
| base_price | INT | NO | 기본 가격 |
| continent | VARCHAR(50) | YES | 대륙 (아프리카, 중남미, 아시아) |
| nationality | VARCHAR(100) | YES | 원산지 |
| type | VARCHAR(100) | YES | 가공방식 |
| thumbnail_img | VARCHAR(250) | YES | 썸네일 이미지 경로 |

**인덱스**
- PK: `product_id`

**필터링**
- `continent`: 대륙별 필터 (프론트엔드 하드코딩)
- `nationality`: 원산지별 필터 (대륙 선택 시 해당 국가만 표시)
- `type`: 가공방식별 필터 (프론트엔드 하드코딩)

**대륙-국가 매핑**
| 대륙 | 국가 |
|------|------|
| 아프리카 | 에티오피아, 케냐, 탄자니아, 르완다 |
| 중남미 | 브라질, 콜롬비아, 과테말라, 코스타리카, 온두라스, 멕시코, 엘살바도르, 파나마, 페루, 니카라과, 볼리비아 |
| 아시아 | 인도네시아, 베트남, 인도 |

---

### 2. product_option (상품 옵션)

| 컬럼 | 타입 | NULL | 설명 |
|------|------|------|------|
| option_id | BIGINT | PK | 옵션 ID |
| product_id | BIGINT | FK, NO | 상품 ID |
| option_value | VARCHAR(50) | NO | 옵션값 (200g, 300g, 500g, 1kg) |
| extra_price | INT | NO | 추가금액 |

**인덱스**
- PK: `option_id`
- FK: `product_id` → `product.product_id`

---

### 3. product_variant (재고)

| 컬럼 | 타입 | NULL | 설명 |
|------|------|------|------|
| variant_id | BIGINT | PK | 변형 ID |
| product_id | BIGINT | FK, NO | 상품 ID |
| option_id | BIGINT | FK, NO | 옵션 ID |
| stock | INT | NO | 재고 수량 |

**인덱스**
- PK: `variant_id`
- FK: `product_id` → `product.product_id`
- FK: `option_id` → `product_option.option_id`

---

### 4. product_image (상품 이미지)

| 컬럼 | 타입 | NULL | 설명 |
|------|------|------|------|
| image_id | BIGINT | PK | 이미지 ID |
| product_id | BIGINT | FK | 상품 ID |
| image_url | VARCHAR(250) | YES | 이미지 경로 |
| sort_order | INT | YES | 정렬 순서 |

**인덱스**
- PK: `image_id`
- FK: `product_id` → `product.product_id`

---

## FK 관계 요약

| 테이블 | 참조하는 FK |
|--------|-------------|
| product_option | product_id → product |
| product_variant | product_id → product, option_id → product_option |
| product_image | product_id → product |

---

## 데이터 예시

### product
```sql
INSERT INTO product (product_name, base_price, nationality, type, thumbnail_img)
VALUES ('에티오피아 예가체프', 15000, '에티오피아', '워시드', 'thumbnail/abc123.jpg');
```

### product_option
```sql
INSERT INTO product_option (product_id, option_value, extra_price)
VALUES
  (1, '200g', 0),
  (1, '500g', 5000),
  (1, '1kg', 12000);
```

### product_variant
```sql
INSERT INTO product_variant (product_id, option_id, stock)
VALUES
  (1, 1, 100),  -- 200g 재고 100개
  (1, 2, 50),   -- 500g 재고 50개
  (1, 3, 20);   -- 1kg 재고 20개
```

---

## 참고: 전체 시스템 스키마

이 어드민 프로젝트는 `give-me-more-coffee` 프로젝트와 동일한 데이터베이스를 사용합니다.
전체 스키마(User, Order, Cart, Review 등)는 해당 프로젝트의 `DATABASE_SCHEMA.md`를 참조하세요.

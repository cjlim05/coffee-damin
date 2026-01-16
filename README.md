# Coffee Admin - 원두 판매 관리자 시스템

원두 판매 애플리케이션의 **관리자 페이지**와 **백엔드 API**를 포함하는 풀스택 프로젝트입니다.

## 기술 스택

| 구분 | 기술 |
|------|------|
| **Backend** | Spring Boot 3.5.10, Java 17, JPA/Hibernate, MySQL |
| **Frontend** | React 19, Vite 7, JavaScript (JSX) |
| **인증/보안** | Spring Security (현재 API 전체 허용) |
| **빌드 도구** | Maven (Backend), npm (Frontend) |

---

## 프로젝트 구조

```
coffee-damin/
├── coffee/                      # Backend (Spring Boot)
│   ├── src/main/java/com/example/coffee/
│   │   ├── CoffeeApplication.java           # 앱 진입점
│   │   ├── config/
│   │   │   ├── SecurityConfig.java          # Spring Security 설정
│   │   │   └── WebConfig.java               # CORS, 정적 리소스 설정
│   │   ├── controller/
│   │   │   └── ProductController.java       # 상품 API 컨트롤러
│   │   ├── dto/
│   │   │   ├── ProductRequest.java          # 요청 DTO
│   │   │   └── ProductResponse.java         # 응답 DTO
│   │   ├── entity/
│   │   │   ├── Product.java                 # 상품 엔티티
│   │   │   ├── ProductOption.java           # 상품 옵션
│   │   │   ├── ProductVariant.java          # 옵션별 재고
│   │   │   ├── ProductImage.java            # 상세 이미지
│   │   │   └── Category.java                # 카테고리
│   │   ├── repository/                      # JPA Repository
│   │   └── service/
│   │       ├── ProductService.java          # 상품 비즈니스 로직
│   │       └── FileStorageService.java      # 파일 업로드 처리
│   ├── src/main/resources/
│   │   └── application.properties           # 앱 설정
│   ├── uploads/                             # 업로드된 이미지 저장소
│   └── pom.xml
│
└── coffee-admin/                # Frontend (React + Vite)
    ├── src/
    │   ├── App.jsx                          # 메인 앱 (사이드바 + 라우팅)
    │   ├── App.css
    │   ├── main.jsx                         # React 진입점
    │   ├── index.css
    │   └── product/                         # 상품 관리 기능
    │       ├── AdminProducts.jsx            # 메인 페이지 (조합)
    │       ├── ProductForm.jsx              # 상품 등록/수정 폼
    │       ├── ProductList.jsx              # 상품 목록
    │       ├── useProducts.js               # API 훅
    │       └── product.css                  # 스타일
    └── package.json
```

### 프론트엔드 구조 설명 (기능별 분리)

```
src/
├── App.jsx              ← 메인: 사이드바 + 라우팅만 담당
└── product/             ← 상품 관련 기능 전부
    ├── AdminProducts.jsx    ← 페이지: 컴포넌트 조합
    ├── ProductForm.jsx      ← 폼: 등록/수정 UI + 로직
    ├── ProductList.jsx      ← 목록: 상품 카드 UI
    ├── useProducts.js       ← 훅: API 호출 (조회/저장/삭제)
    └── product.css          ← 스타일

# 향후 확장 시
├── order/               ← 주문 관리 (추가 예정)
└── user/                ← 회원 관리 (추가 예정)
```

---

## 데이터베이스 구조 (ERD)

```
┌─────────────────┐       ┌──────────────────┐
│    Category     │       │     Product      │
├─────────────────┤       ├──────────────────┤
│ category_id PK  │◄──────│ product_id PK    │
│ category_name   │       │ product_name     │
└─────────────────┘       │ base_price       │
                          │ type             │
                          │ nationality      │
                          │ thumbnail_img    │
                          │ detail_img       │
                          │ category_id FK   │
                          └──────────────────┘
                                   │
                 ┌─────────────────┼─────────────────┐
                 │                 │                 │
                 ▼                 ▼                 ▼
        ┌────────────────┐ ┌───────────────┐ ┌───────────────────┐
        │ ProductOption  │ │ ProductImage  │ │  ProductVariant   │
        ├────────────────┤ ├───────────────┤ ├───────────────────┤
        │ option_id PK   │ │ image_id PK   │ │ variant_id PK     │
        │ product_id FK  │ │ product_id FK │ │ product_id FK     │
        │ option_value   │ │ image_url     │ │ option_id FK      │
        │ extra_price    │ │ sort_order    │ │ stock             │
        └────────────────┘ └───────────────┘ └───────────────────┘
```

> 상세 스키마 정보는 [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)를 참조하세요.

### 테이블 설명

| 테이블 | 설명 |
|--------|------|
| `product` | 원두 상품 기본 정보 (이름, 기본가격, 원산지, 가공방식, 썸네일, 상세이미지) |
| `product_option` | 상품 옵션 (200g, 300g, 500g, 1kg 용량별 추가금액) |
| `product_variant` | 옵션별 재고 수량 관리 |
| `product_image` | 상품 상세 이미지 (여러 장, 순서 지정 가능) |
| `category` | 상품 카테고리 (현재 미사용) |

---

## API 명세

### 기본 정보
- **Base URL**: `http://localhost:8080`
- **Content-Type**: `multipart/form-data` (등록/수정), `application/json` (응답)

### 엔드포인트

#### 1. 전체 상품 조회
```http
GET /api/products
```
**Response**
```json
[
  {
    "productId": 1,
    "productName": "에티오피아 예가체프",
    "basePrice": 15000,
    "type": "워시드",
    "nationality": "에티오피아",
    "thumbnailImg": "thumbnail/abc123.jpg",
    "detailImg": "detail/main.jpg",
    "detailImages": [
      { "imageId": 1, "imageUrl": "detail/def456.jpg", "sortOrder": 1 }
    ],
    "options": [
      { "optionId": 1, "optionValue": "200g", "extraPrice": 0, "stock": 100 },
      { "optionId": 2, "optionValue": "500g", "extraPrice": 5000, "stock": 50 }
    ]
  }
]
```

#### 2. 상품 등록
```http
POST /api/products
Content-Type: multipart/form-data
```
**Parameters**
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| productName | string | O | 상품명 |
| basePrice | number | X | 기본 가격 (기본값: 0) |
| type | string | X | 가공 방식 |
| nationality | string | X | 원산지 |
| options | string (JSON) | X | 옵션 배열 JSON |
| thumbnail | file | X | 썸네일 이미지 |
| detailImages | file[] | X | 상세 이미지 (다중) |

**options JSON 형식**
```json
[
  { "optionValue": "200g", "extraPrice": 0, "stock": 100 },
  { "optionValue": "300g", "extraPrice": 2000, "stock": 50 }
]
```

#### 3. 상품 수정
```http
PUT /api/products/{id}
Content-Type: multipart/form-data
```
- 파라미터는 등록과 동일
- 기존 상세 이미지와 옵션은 모두 삭제 후 새로 등록됨

#### 4. 상품 삭제
```http
DELETE /api/products/{id}
```
- 연관된 옵션, 재고, 이미지 모두 함께 삭제

---

## 프론트엔드 기능

### 상품 관리 (`/coffee-admin/src/product/`)

| 기능 | 설명 |
|------|------|
| 상품 등록 | 상품명, 가격, 원산지, 가공방식, 썸네일, 상세이미지, 옵션 입력 |
| 상품 목록 | 카드 형태로 등록된 상품 조회 |
| 상품 수정 | 기존 상품 정보 불러와서 수정 |
| 상품 삭제 | 확인 후 삭제 |
| 이미지 순서 변경 | 상세 이미지 좌/우 버튼으로 순서 조절 |
| 옵션 관리 | 최대 4개 옵션 (200g, 300g, 500g, 1kg) |
| 폼 검증 | 필수 입력값 검증 및 에러 메시지 표시 |
| 로딩 상태 | 저장/삭제 시 로딩 오버레이 표시 |

### 지원 원산지
브라질, 콜롬비아, 에티오피아, 케냐, 과테말라, 코스타리카, 온두라스, 멕시코, 엘살바도르, 인도네시아, 베트남, 인도, 탄자니아, 르완다, 파나마, 페루, 니카라과, 볼리비아

### 지원 가공 방식
워시드, 내추럴, 허니, 화이트 허니, 옐로우 허니, 레드 허니, 블랙 허니, 애너로빅, 카보닉 매서레이션

---

## 실행 방법

### 사전 요구사항
- Java 17+
- Node.js 16+ (18 권장)
- MySQL 8.0+

### 1. 데이터베이스 설정

MySQL에 데이터베이스 생성 후 `coffee/.env` 파일 생성:
```env
DB_URL=jdbc:mysql://localhost:3306/coffee_db?useSSL=false&serverTimezone=Asia/Seoul
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

### 2. 백엔드 실행
```bash
cd coffee
./mvnw spring-boot:run
```
- 서버: http://localhost:8080
- JPA가 자동으로 테이블 생성 (`ddl-auto=update`)

### 3. 프론트엔드 실행
```bash
cd coffee-admin
npm install
npm run dev
```
- 개발 서버: http://localhost:5173

---

## 설정 파일

### application.properties
```properties
# 서버 포트
server.port=8080

# 파일 업로드 크기 제한
spring.servlet.multipart.max-file-size=200MB
spring.servlet.multipart.max-request-size=200MB

# 업로드 디렉토리
app.upload.dir=uploads

# JPA 설정
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

### CORS 설정
- 허용 Origin: `http://localhost:5173`
- 허용 메서드: GET, POST, PUT, DELETE, OPTIONS
- 설정 위치: `SecurityConfig.java`, `WebConfig.java`

---

## 파일 업로드

업로드된 파일은 `coffee/uploads/` 디렉토리에 저장됩니다:
- 썸네일: `uploads/thumbnail/{uuid}.{ext}`
- 상세이미지: `uploads/detail/{uuid}.{ext}`

정적 리소스로 서빙되어 다음 URL로 접근 가능:
```
http://localhost:8080/uploads/thumbnail/abc123.jpg
http://localhost:8080/uploads/detail/def456.png
```

---

## 향후 개발 계획

- [ ] 카테고리 관리 기능
- [ ] 사용자 인증/인가 (관리자 로그인)
- [ ] 주문 관리 기능
- [ ] 고객용 쇼핑몰 프론트엔드
- [ ] 이미지 리사이징/최적화
- [ ] 검색/필터링 기능

---

## 문제 해결

| 문제 | 해결 방법 |
|------|-----------|
| CORS 에러 | `SecurityConfig.java`에서 allowedOrigins 확인 |
| 파일 업로드 실패 | `max-file-size` 설정 확인, uploads 디렉토리 권한 확인 |
| DB 연결 실패 | `.env` 파일의 DB 정보 확인 |
| 포트 충돌 | `-Dserver.port=포트` 옵션으로 포트 변경 |

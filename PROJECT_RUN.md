# 프로젝트 실행 가이드 (Frontend + Backend)

빠르게 프로젝트를 실행하고 테스트할 수 있는 가이드입니다.

## 프로젝트 설명

원두 판매 애플리케이션의 **관리자(Admin) 페이지**와 **백엔드 API**를 포함합니다.

- **주요 기능**: 상품 등록/수정/삭제, 옵션/재고 관리, 이미지 업로드
- **프론트엔드**: React + Vite (`coffee-admin/`)
- **백엔드**: Spring Boot (`coffee/`)

---

## 구조 요약

```
coffee-damin/
├── coffee/                  # Backend (Spring Boot)
│   ├── src/main/java/...
│   │   └── controller/ProductController.java
│   └── application.properties
│
└── coffee-admin/            # Frontend (React + Vite)
    └── src/
        ├── App.jsx          # 메인 (사이드바 + 라우팅)
        └── product/         # 상품 관리 기능
            ├── AdminProducts.jsx
            ├── ProductForm.jsx
            ├── ProductList.jsx
            └── useProducts.js
```

---

## 사전 준비

- Java 17+
- Node.js 16+ (18 권장)
- MySQL 8.0+

**포트**
- 백엔드: `8080`
- 프론트엔드: `5173`

---

## 1. 데이터베이스 설정

`coffee/.env` 파일 생성:
```env
DB_URL=jdbc:mysql://localhost:3306/coffee_db?useSSL=false&serverTimezone=Asia/Seoul
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

---

## 2. Backend 실행

```bash
cd coffee
./mvnw spring-boot:run
```

- 서버: http://localhost:8080
- API 테스트:
```bash
curl http://localhost:8080/api/products
```

---

## 3. Frontend 실행

```bash
cd coffee-admin
npm install
npm run dev
```

- 개발 서버: http://localhost:5173

---

## 빠른 확인 (권장 순서)

1. **백엔드 실행**
   ```bash
   cd coffee && ./mvnw spring-boot:run
   ```

2. **프론트엔드 실행**
   ```bash
   cd coffee-admin && npm install && npm run dev
   ```

3. **브라우저에서 확인**
   - http://localhost:5173 접속
   - 사이드바에서 "상품 관리" 클릭
   - 상품 등록/수정/삭제 테스트

---

## 문제 해결

| 문제 | 해결 방법 |
|------|-----------|
| 포트 충돌 | `-Dserver.port=포트` 옵션으로 변경 |
| mvnw 권한 없음 | `chmod +x mvnw` |
| CORS 에러 | `SecurityConfig.java` 확인 |
| DB 연결 실패 | `.env` 파일 확인 |

---

## 참고 링크

- [README.md](./README.md) - 전체 프로젝트 문서
- [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) - DB 스키마 정보

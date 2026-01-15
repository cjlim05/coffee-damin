# 프로젝트 실행 가이드 (Frontend + Backend)

아래 문서는 개발자가 별도 설명 없이 바로 프로젝트를 실행하고 테스트할 수 있도록 정리한 빠른 실행 가이드입니다.

## 프로젝트 설명
이 리포지토리는 원두 판매 애플리케이션의 **관리자(Admin) 페이지**와 **백엔드 API**를 함께 포함합니다. 현재 목표는 관리자가 원두(제품)를 등록/수정/삭제하고, 카테고리와 옵션(예: 분쇄도, 중량 등)과 변형(Variant)을 관리할 수 있는 어드민 인터페이스를 제공하는 것입니다.

- **주요 기능(계획)**: 제품 업로드/수정/삭제, 카테고리 관리, 옵션/버리언트 설정, 이미지 업로드(프론트), 제품 목록/상세 API(백엔드)
- **프론트**: 관리자 UI는 `coffee-admin/coffee-admin`에 위치한 React + Vite 프로젝트로 구성되어 있으며, `AdminProducts` 페이지에서 제품 관리를 진행합니다.
- **백엔드**: Spring Boot로 작성된 REST API는 제품, 카테고리, 옵션, 버리언트를 처리합니다. 주요 엔티티는 `Product`, `Category`, `ProductOption`, `ProductVariant` 입니다.

실제 배포 전에는 프론트의 API base URL과 백엔드 CORS 설정을 확인하세요.

**구조 요약**
- **Backend (Spring Boot)**: `coffee/` 폴더
  - 앱 진입점: [coffee/src/main/java/com/example/coffee/CoffeeApplication.java](coffee/src/main/java/com/example/coffee/CoffeeApplication.java#L1)
  - 컨트롤러 예시: [coffee/src/main/java/com/example/coffee/controller/ProductController.java](coffee/src/main/java/com/example/coffee/controller/ProductController.java#L1)
  - 설정 파일: [coffee/src/main/resources/application.properties](coffee/src/main/resources/application.properties#L1)
- **Frontend (Vite + React)**: `coffee-admin/coffee-admin/` 폴더
  - 진입점: [coffee-admin/coffee-admin/src/main.jsx](coffee-admin/coffee-admin/src/main.jsx#L1)
  - 관리자 페이지 예시: [coffee-admin/coffee-admin/src/pages/AdminProducts.jsx](coffee-admin/coffee-admin/src/pages/AdminProducts.jsx#L1)

---

## 사전 준비
- Java 17+ (프로젝트에서 사용하는 JDK 버전에 맞춰 설치)
- Maven (또는 제공된 wrapper `./mvnw` 사용)
- Node.js 16+ 또는 18+ 권장
- npm 또는 pnpm (프로젝트는 `package.json` 기반)

환경변수/포트 기본값
- 백엔드 기본 포트: 8080 (변경 시 `application.properties` 또는 JVM 옵션 `-Dserver.port=포트` 사용)
- 프론트 개발서버 기본 포트(Vite): 5173

---

## Backend 실행 (개발)
1. 백엔드 폴더로 이동

```bash
cd coffee
```

2. 의존성 설치/실행 (wrapper 사용 권장)

```bash
./mvnw spring-boot:run
# 또는 (환경에 따라)
mvn spring-boot:run
```

3. 빌드된 jar로 실행 (배포/테스트)

```bash
./mvnw clean package
java -jar target/*-SNAPSHOT.jar
```

4. 테스트 실행

```bash
./mvnw test
```

포인트
- 애플리케이션 설정은 `coffee/src/main/resources/application.properties` 를 확인하세요.
- 컨트롤러(API 경로)는 [ProductController](coffee/src/main/java/com/example/coffee/controller/ProductController.java#L1) 등에서 확인할 수 있습니다.

예시: 서버 구동 후 API 확인 (컨트롤러에서 실제 엔드포인트를 확인하세요)

```bash
curl http://localhost:8080/api/products
```

---

## Frontend 실행 (개발)
1. 프론트엔드 폴더로 이동

```bash
cd coffee-admin/coffee-admin
```

2. 의존성 설치

```bash
npm install
# 또는
# pnpm install
```

3. 개발 서버 실행

```bash
npm run dev
```

4. 빌드 & 미리보기

```bash
npm run build
npm run preview
```

프론트에서 백엔드 API 사용시
- 프론트 환경에서 백엔드 주소를 지정해야 할 경우 `VITE_` 접두사의 환경변수(또는 코드의 상수)를 사용하세요. 예: `VITE_API_BASE_URL=http://localhost:8080` 또는 소스 파일에서 API base URL을 수정.

예시: 개발 서버 실행 후 브라우저 열기

http://localhost:5173

---

## 빠른 확인(권장 순서)
1. 백엔드 실행 (`cd coffee` → `./mvnw spring-boot:run`) — 정상 구동 확인
2. (선택) 백엔드가 사용하는 엔드포인트 확인: [ProductController](coffee/src/main/java/com/example/coffee/controller/ProductController.java#L1)
3. 프론트 실행 (`cd coffee-admin/coffee-admin` → `npm run dev`) — UI에서 동작 확인

간단한 curl 예시 (엔드포인트는 컨트롤러에서 확인 후 수정)

```bash
curl -v http://localhost:8080/api/products
```

---

## 문제해결 팁
- 포트 충돌: 다른 프로세스가 8080을 사용 중이면 `-Dserver.port=포트` 로 변경
- 권한 문제(./mvnw 실행 불가): `chmod +x mvnw`
- 프론트에서 CORS 에러 발생 시: 백엔드에서 CORS 설정(`WebConfig` 또는 `SecurityConfig`) 확인

참고 링크
- 백엔드 메인: [coffee/src/main/java/com/example/coffee/CoffeeApplication.java](coffee/src/main/java/com/example/coffee/CoffeeApplication.java#L1)
- 백엔드 컨트롤러 예시: [coffee/src/main/java/com/example/coffee/controller/ProductController.java](coffee/src/main/java/com/example/coffee/controller/ProductController.java#L1)
- 프론트 진입점: [coffee-admin/coffee-admin/src/main.jsx](coffee-admin/coffee-admin/src/main.jsx#L1)

---

원하시면 이 파일을 커밋하거나(원격에 푸시) 자동 실행 스크립트(.sh/.ps1)를 추가해 드리겠습니다.

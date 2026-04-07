# SweetBook — AI 여행 가이드북 제작 서비스

여행 정보를 입력하면 AI가 가이드북 콘텐츠를 자동으로 생성하고, Sweetbook Book Print API를 통해 실제 책으로 주문할 수 있는 풀스택 웹 서비스입니다.

**타겟층**: 여행을 준비하는 단계에서 본인이 원하는 일정을 손쉽게 구성하고 싶은 사용자

---

## 주요 기능

- **AI 가이드북 생성**: 여행지, 날짜, 설명을 입력하면 Groq AI(llama-3.3-70b)가 여행지 소개, 명소, 일정, 맛집, 꿀팁, 포토스팟, 마무리 글 등 7개 섹션의 가이드북 콘텐츠를 자동 생성
- **커버 사진 업로드**: 여행 사진 업로드 후 톤(분위기)과 표지 디자인을 단계별로 선택해 나만의 책 표지 제작
- **책 미리보기**: 주문 전 가이드북 내용을 페이지 단위로 미리 확인
- **책 주문**: Sweetbook Book Print API로 실물 책 주문 및 배송
- **주문 내역 조회**: 생성한 가이드북 제목과 주문 상태 확인
- **회원 인증**: 이메일 회원가입 / 로그인, 구글 소셜 로그인 지원

---

## 기술 스택

| 영역 | 사용 기술 |
|------|-----------|
| 프론트엔드 | React, React Router |
| 백엔드 | Node.js, Express |
| 데이터베이스 | MongoDB (Mongoose) |
| AI | Groq API (llama-3.3-70b) |
| Book Print | Sweetbook Node.js SDK |
| 인증 | JWT, Google OAuth |

---

## 실행 방법

### 사전 요건

- Node.js 18 이상
- MongoDB (로컬 또는 Atlas)
- Sweetbook Sandbox API Key ([api.sweetbook.com](https://api.sweetbook.com))
- Groq API Key ([console.groq.com](https://console.groq.com))
- Google OAuth Client ID (소셜 로그인 사용 시)

### 설치 및 실행

```bash
# 1. 저장소 클론
git clone https://github.com/csr1968/sweetbook_api_pj.git
cd sweetbook_api_pj

# 2. 의존성 설치 (백엔드 + 프론트엔드 한 번에)
npm run install:all

# 3. 환경변수 설정
cp .env.example .env
# .env 파일을 열어 각 항목에 키 값 입력

# 4. 개발 서버 실행 (백엔드 :4000 + 프론트엔드 :3000 동시 실행)
npm run dev
```

브라우저에서 `http://localhost:3000` 접속

### 환경변수 목록

**백엔드** (`/.env`)

```
SWEETBOOK_API_KEY=     # Sweetbook Sandbox API Key
SWEETBOOK_ENV=sandbox
GROQ_API_KEY=          # Groq API Key
PORT=4000
CLIENT_URL=http://localhost:3000
MONGO_URL=             # MongoDB 연결 문자열
JWT_SECRET=            # JWT 서명 비밀키 (임의 문자열)
GOOGLE_CLIENT_ID=      # Google OAuth Client ID
GOOGLE_CLIENT_PW=      # Google OAuth Client Secret
```

**프론트엔드** (`/client/.env`)

```
REACT_APP_GOOGLE_CLIENT_ID=    # Google OAuth Client ID (백엔드와 동일한 값)
```

### 더미 데이터(dummy data)

서비스 실행 직후 확인할 수 있는 샘플 가이드북이 포함되어 있습니다.

```
dummy/sample_guidebook.json   # 도쿄 3박 4일 여행 가이드북 샘플 (7개 섹션)
```

샘플 데이터를 참고하여 Create 페이지에서 여행지, 날짜, 설명을 동일하게 입력하면 AI 가이드북 생성 흐름을 바로 테스트할 수 있습니다.

---

## 사용한 API 목록

| API | 용도 |
|-----|------|
| `POST /books` | 가이드북 생성 (표지 이미지 + 페이지 콘텐츠 업로드) |
| `GET /books` | 생성한 책 목록 조회 |
| `GET /books/:bookUid` | 특정 책 정보 조회 |
| `GET /templates` | 표지·콘텐츠 템플릿 목록 조회 |
| `POST /orders/estimate` | 주문 전 가격 견적 계산 |
| `POST /orders` | 책 주문 생성 (수량, 배송지 입력) |
| `GET /orders` | 주문 내역 전체 조회 |
| `GET /orders/:orderUid` | 특정 주문 상세 조회 |

---

## AI 도구 사용 내역

| AI 도구 | 활용 내용 |
|---------|-----------|
| Claude Code | 백엔드 API 라우팅 구조 설계, Sweetbook SDK 연동, 기능 구현 및 디버깅, 더미 데이터 생성 |
| Cursor | 프론트엔드 UI 컴포넌트 개발, CSS 스타일링 |
| Groq API | 서비스 내 기능 — 여행 정보를 기반으로 가이드북 콘텐츠 자동 생성 |

---

## 설계 의도

### 왜 이 서비스를 선택했는가

여행은 누구나 공감하고 경험할 수 있는 보편적인 경험입니다. 하지만 여행 전 계획을 구성할 때 참고할 것이 너무 많거나 어떤 기준으로 구성해야할지에 대한 어려움이 있다고 생각했습니다. 따라서 SweetbookAPI와 AI를 사용하여 콘텐츠 작성의 진입 장벽을 낮추고, 그 결과를 실물 책으로 만들어주는 것이 기술적으로도, 감성적으로도 의미 있는 서비스라고 판단했습니다.

### 비즈니스 가능성

온디맨드 출판 시장은 개인 맞춤형 콘텐츠 수요와 함께 성장하고 있습니다. 여행 가이드북은 여행 준비, 신혼여행 앨범, 가족 여행 기념품 등 다양한 구매 동기를 가진 시장으로 확장할 수 있습니다. AI 생성 콘텐츠를 기반으로 제작 시간을 대폭 단축하면 소량·맞춤 출판의 단가 문제도 해결 가능하다고 생각합니다.

### 더 시간이 있었다면 추가했을 기능

- 카카오맵 / Google Places API 연동으로 실제 장소 정보 자동 삽입
- 영상 업로드로 가이드북 생성
- 완성된 가이드북을 링크로 공유하는 기능
- 웹훅(Webhook)을 통한 실시간 주문 상태 알림

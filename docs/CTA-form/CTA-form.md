### 7-B. 폼 백엔드 (리드 수집 — 택 1)

폼으로 고객 정보를 수집할 때 어떤 백엔드를 쓸지 선택합니다.

#### 폼 백엔드 비교표

| | **Tally.so** | **Next.js API + Sheets** | **Web3Forms** |
|---|:---:|:---:|:---:|
| **한줄 요약** | 외부 폼 서비스 (API로 자동 생성) | 자체 API Route (완전 자체 구현) | 외부 폼 API (간단) |
| **폼 UI** | Tally가 렌더링 (iframe embed) | 직접 구현 필요 | 직접 구현 필요 |
| **무료 한도** | ~50,000건/월 (fair use) | 사실상 무제한 | 250건/월 |
| **데이터 저장** | Tally 대시보드 + Sheets 연동 | Google Sheets | 이메일만 (저장 없음) |
| **이메일 알림** | 무료 (기본 알림) | Resend 등 별도 필요 | 무료 |
| **Webhook** | 무료 + API로 설정 | 자체 API route가 곧 endpoint | 없음 |
| **폼 Validation** | Tally가 처리 | 직접 구현 필요 | 직접 구현 필요 |
| **스팸 방지** | Tally 내장 | 직접 구현 필요 | hCaptcha 지원 |
| **Ralph 자동화** | API로 폼 생성+webhook 설정 가능 | 100% 코드 자동화 | access key 발급만 |
| **운영자 1회 셋업** | Tally 가입 + API key 발급 (3분) | GCP 서비스계정 + Resend key (10분) | Web3Forms 가입 (2분) |
| **프로젝트별 셋업** | 자동 (API call) | 자동 (코드) | 자동 (key 재사용) |
| **외부 의존성** | Tally 서비스 | Google Cloud | Web3Forms 서비스 |
| **추천 시나리오** | MVP/빠른 론칭, 폼 UI 개발 생략 | 자체 디자인 폼, 대규모 운영 | 초소형, 최소 코드 |

> **기본값: `tally`** — 폼 UI 개발 생략 + API 자동화 + 무료 ~50K건/월. MVP 단계에서 최적.
> 
> **스케일업 시**: `nextjs_sheets`로 전환 — 폼 UI를 자체 컴포넌트로 교체, 완전한 자유도 확보.

#### 폼 백엔드별 구현 상세

**A) Tally.so** (기본값)

  * 폼 생성: `POST https://api.tally.so/forms` (이름/전화/이메일/문의내용 필드)
  * Webhook 설정: `POST https://api.tally.so/webhooks` → 우리 Next.js `/api/tally-webhook`으로 연결
  * Embed: `<iframe src="https://tally.so/embed/{formId}" ...>` 를 CTA 섹션에 삽입
  * 데이터 흐름: Tally 폼 제출 → Tally webhook → 우리 API route → (선택) Sheets 저장 + 이메일 발송
  * 인증: `Authorization: Bearer tly-xxxx` (운영자가 1회 발급, 모든 프로젝트 공유)
  * Rate limit: 100 req/분. 폼 생성은 프로젝트당 1회이므로 문제 없음
  * 참고: https://developers.tally.so

**B) Next.js API Route + Google Sheets API**

  * 폼 UI: 자체 React 컴포넌트로 구현 (섹션 컴포넌트 라이브러리에 포함)
  * API route: `/api/submit` → Google Sheets API `spreadsheets.values.append` → Resend 이메일
  * 인증: GCP 서비스 계정 JSON key (운영자 1회 셋업, 환경변수로 주입)
  * Sheet 생성: Sheets API로 자동 생성 + 서비스 계정에 Editor 권한 공유 (Drive API)
  * 이메일: Resend (무료 100통/일) 또는 Nodemailer + Gmail SMTP
  * 참고: `googleapis` + `nodemailer` npm 패키지

**C) Web3Forms**

  * 폼 UI: 자체 HTML `<form action="https://api.web3forms.com/submit">`
  * `access_key`: 운영자 계정에서 발급 (클라이언트 이메일 지정)
  * 데이터: 이메일로만 전달 (Sheet 저장 없음)
  * 참고: https://web3forms.com

### 7-C. 프리미엄 CTA (선택 — 해당 브리프 필드가 있을 때만)

| CTA | 적용 조건 | 구현 | 참고 |
|-----|----------|------|------|
| Cal.com 예약 | `calcom_event_url` 존재 | CTA 섹션에 inline embed 또는 버튼→예약 페이지 | https://cal.com/help/embedding/embed-instructions |
| GoHighLevel CRM | `ghl_webhook_url` 존재 | 폼 submit → webhook POST + 재시도/에러 처리 | https://help.gohighlevel.com/support/solutions/articles/155000003147 |
| 카카오 채널 | `kakao_channel_url` 존재 | 채널 추가 버튼 삽입 (비즈니스 브랜딩용) | 카카오 비즈니스 계정 필요 |
| Channel.io 채팅 | `channeltalk_plugin_key` 존재 | `<script>` 플러그인 삽입 | https://channel.io |
**Playwright MCP 기반으로 레퍼런스 사이트를 “눈”으로 보고**, 그 결과를 토대로 **조립형 템플릿 + 토큰 주입**으로 Next.js 웹앱을 만들고, **GitHub → Vercel 자동배포**까지 “무검수(사람 0)”로 닫는 설계

---
# 0) 목표 정의 (이번 버전)

* **입력**: 레퍼런스 사이트 URL(1~N), 제품/서비스 정보, 고객/지표(후기·수치·인증·사례), CTA/연동(폼·전화·카카오·지도·예약 등), SEO 키워드/지역, 법무/개인정보 필수 문구
    - 처음에 입력하라고 json 형태를 만들어서 주세요. [first-clientbrief.json]
    - 질문 형태로 같이 조사하면서, breif.json 파일을 수정/업그레이드 해주고, 기획 방향이 맞는지 재확인해서 사용자가 수락하면 확정하세요.
* **출력**: **도메인 미적용 상태**의 `*.vercel.app` 주소로 배포된 **Next.js 웹앱**

  * 이미지 최적화/OG/파비콘 포함
  * SEO(메타/OG/robots/sitemap/schema/블로그) 포함 
  * Vercel Analytics + Speed Insights 포함
  * Core Web Vitals “90점 근처” 목표를 위한 성능 가드레일 포함
  * WCAG 2.2 4원칙 기반 최소 접근성 체크 포함
  * PIPA 기반 개인정보/쿠키 문서 포함
  * CTA 플러그인(폼→리드, 전화, 카카오톡, 지도, 예약 등) 포함
  
- 참고: (랜딩페이지에 관한 전문지식을 넣은 md파일)[knowledgeoflandingpage.md]
- 디자인은 gemini 3.0 pro 로 진행하세요. 
- 관련 이미지(사진,이미지,그림)는 생성 가능하다면 Antigravity 를 통해서 gemini 3.0 pro를 통해 이미지를 생성하세요
- 한글로 작성해야합니다. 폰트는 비슷한 한글을 찾아서 사용하세요.
- 래퍼런스에서 찾은 캡쳐본은 capture-images/references-1/ 이렇게 폴더에 저장해주세요. (전체 페이지를 다 캡쳐해서 이해해야합니다.) 꼭 하단까지 스크롤해서 캡쳐합시다. 동적인 웹사이트(애니메이션 등) 이 있으니, 유의
- 보통 clientbrief.json이 완벽하지 않을것이니, 보완해주셔야합니다.
---

# 1) 입력 스키마 (클라이언트 브리프 JSON)

아래는 “최소 필수 + 옵션”으로 나눈 표준 입력입니다. 이게 고정되면 자동화가 쉬워집니다.

## 1-1. 필수 입력 (반드시 받아야 자동 생성 가능)

1. **Reference**

* `reference_urls`: 레퍼런스 사이트 1~N개
* `reference_priority`: “디자인/레이아웃/카피/애니메이션” 중 무엇을 따라갈지

2. **Offer & Product**

* `product_type`: 업종(예: 미용실/학원/카페/헬스/PT/법무/세무/이커머스 등)
* `offer_summary`: 한 줄 가치제안
* `pricing`: 가격/플랜/상담비(없으면 “문의”로 처리)

3. **Audience & Proof**

* `target_audience`: 핵심 타겟(지역/연령/상황/니즈)
* `proof_assets`: 후기/전후사진/수치/인증/사례 (없으면 `proof_mode = "generated"`로 “신뢰장치 대체안” 생성)

4. **CTA & Integrations**

  CTA는 **기본 CTA**(거의 모든 프로젝트에 포함)와 **폼 백엔드**(리드 수집 방식 선택), **프리미엄 CTA**(선택)로 나뉩니다.

  #### 4-A. 기본 CTA (자동 적용 — 브리프 데이터만 있으면 됨)

  | CTA 유형 | 브리프 필드 | 적용 조건 | 구현 |
  |----------|-----------|----------|------|
  | `phone_call` | `business_phone` | 전화번호가 있으면 **항상 적용** | `<a href="tel:...">` |
  | `kakao_openchat` | `kakao_url` | URL이 있으면 적용 | `<a href="https://open.kakao.com/o/...">` |
  | `map_directions` | `store_address` | 주소가 있으면 **자동 적용** | 네이버/카카오 지도 링크 생성 |
  | `email_contact` | `business_email` | 이메일이 있으면 적용 | `<a href="mailto:...">` |

  > 기본 CTA는 **외부 서비스 계정 불필요**. 브리프의 전화번호/주소/이메일만으로 자동 생성.

  #### 4-B. 폼 백엔드 (리드 수집 폼 방식 — 택 1)

  * `form_backend`: 아래 3개 중 선택 (기본값: `tally`)

    * `tally` — Tally.so API로 폼 자동 생성 + iframe embed
    * `nextjs_sheets` — Next.js API Route + Google Sheets API 자체 구현
    * `web3forms` — Web3Forms 외부 서비스 (간단하지만 월 250건 제한)

  > 상세 비교는 **Step 7 "폼 백엔드 비교표"** 참조.

  * 폼 백엔드별 필수 정보:
    * `tally`: 없음 (Tally API key는 운영자가 1회 발급해두면 모든 프로젝트에 공유)
    * `nextjs_sheets`: 없음 (GCP 서비스 계정은 운영자가 1회 셋업)
    * `web3forms`: `client_email` (리드 수신용 이메일)

  #### 4-C. 프리미엄 CTA (선택 — 원하는 클라이언트만)

  | CTA 유형 | 브리프 필드 | 설명 | 필요 계정 |
  |----------|-----------|------|----------|
  | `calcom_embed` | `calcom_event_url` | 온라인 예약 위젯 (헬스/PT/법무/세무 등) | Cal.com 계정 |
  | `gohighlevel_webhook` | `ghl_webhook_url` | 폼→CRM 자동화 | GoHighLevel 계정 ($97/월) |
  | `kakao_channel` | `kakao_channel_url` | 카카오 비즈니스 채널 (브랜드용) | 카카오 비즈니스 계정 |
  | `channeltalk` | `channeltalk_plugin_key` | 실시간 채팅 위젯 | Channel.io 계정 |

5. **Legal & Tracking**

* `business_owner_info`: 사업자명/대표명/주소(표기 필요 여부)/연락처/이메일
* `privacy_fields`: 수집 필드(이름/전화/이메일 등), 보관기간, 처리위탁(있으면 업체명)
* `tracking`: GA4 사용 여부, 광고 픽셀 여부(있으면 ID)

## 1-2. 있으면 퀄리티가 급상승하는 입력 (옵션)

* `brand_assets`: 로고/파비콘/OG 이미지 원본(없으면 자동 생성)
* `brand_tone`: 말투(친근/프리미엄/직설/전문)
* `seo`: 주요 키워드/보조 키워드/지역 키워드/경쟁 URL
* `blog`: 블로그 활성화 여부 + 주제/카테고리 + 월 발행량
* `media`: 촬영사진/제품사진/매장사진(없으면 대체 이미지 정책 필요)
* `constraints`: 금지 표현(의료·효능 과장 등), 꼭 들어가야 할 문구

---

# 2) 에이전트 구성 (무검수 자동화를 위한 “역할 분리”)

사람이 0명이어야 하므로, 책임을 에이전트로 나눕니다.

1. **Orchestrator(총괄)**

* 입력 검증 → 전체 플로우 실행 → 실패 시 재시도/대체 경로 선택 → 최종 배포 URL 출력

2. **WebEye(Playwright MCP)**

* 레퍼런스 사이트를 실제로 방문
* 산출:

  * 전체 페이지 스크린샷(1장) + 뷰포트 분할 스크린샷(여러 장)
  * HTML/DOM 스냅샷(중요 섹션)
  * 주요 UI 컴포넌트 패턴(버튼/카드/섹션) 추출
  * 색상/폰트 후보 추정(가능한 범위)

3. **BrandTokenizer**

* WebEye 결과 + 입력 로고(옵션)를 바탕으로:

  * `theme.json`(colors, fonts, radius, spacing, tone)
  * “섹션 스타일 가이드” 생성(예: 히어로 배경 스타일, 버튼 스타일)

4. **TemplatePlanner**

* 내부 “조립형 섹션 라이브러리(블록)”에서 어떤 조합을 쓸지 결정
* 출력: `page_plan.json`
  (예: Hero → Problem → Solution → Proof → Pricing → FAQ → CTA → Footer)

5. **Copy&SEO Agent**

* 고객 데이터(지표/후기) 기반 카피 생성 + SEO 메타/FAQ/PAA 느낌 문답 생성 (입력이 없을 경우 생성)
* 출력:

  * `copy.json`(섹션별 카피)
  * `seo.json`(title/description/canonical/og/twitter/schema/alt 텍스트)
  * 블로그 활성화 시 `blog_seed.md(x)` N개

6. **Integrations Agent**

* 브리프의 CTA 설정에 따라 기능 삽입:

  * 기본 CTA 자동 삽입 (전화/카카오/이메일/지도 — 브리프 데이터 기반)
  * 폼 백엔드 셋업 (Tally API 폼 생성 / Next.js API Route / Web3Forms 중 택 1)
  * 프리미엄 CTA 삽입 (Cal.com embed / GoHighLevel webhook / Channel.io — 선택)

7. **Compliance Agent**

* PIPA 기반 개인정보 처리방침/쿠키·추적 고지 템플릿 페이지 생성
* 폼 수집 필드와 “수집 목적/보관기간/동의” 문구 매칭

8. **QA Gate Agent (자동 통과/실패 판정)**

* 성능/CWV 목표선 체크(라이트하우스)
* 링크체크, 이미지 누락 체크
* 접근성(기본 룰) 체크
* 폼/웹훅 호출 E2E 테스트(가능한 범위)

9. **Deployer**

* GitHub 커밋/푸시
* Vercel 자동 배포 확인
    - vercel api: https://docs.vercel.com/docs/rest-api/reference/welcome#endpoints/domains/register-or-transfer-in-a-new-domain

    - vercel sdkhttps://docs.vercel.com/docs/rest-api/reference/sdk
* 최종 URL 리포트 생성

---

# 3) 실제 실행 과정 (디테일: 단계별 입력/출력/실패 대체)

아래 순서대로 “작업이 끝나면 다음 단계로만” 진행됩니다.

## Step 1) 입력 검증 & 작업 폴더 생성

* **입력**: 브리프 JSON
* **출력**

  * `client/{client_id}/brief.json`
  * 필수 누락이면 자동으로 “대체값 생성 정책” 적용
    예) 로고 없음 → 텍스트 로고/심볼 생성, 후기 없음 → “신뢰장치(연혁/프로세스/보증/FAQ 강화)” 모드

## Step 2) 레퍼런스 수집 (Playwright MCP)

* **입력**: reference_urls, priority
* **출력**

  * `/research/reference/{site}/fullpage.png`
  * `/research/reference/{site}/viewport_001.png ...`
  * `/research/reference/{site}/dom.json`(주요 섹션 DOM/텍스트)
  * `/research/reference/{site}/ui_patterns.json`(버튼/카드/섹션 패턴 힌트)

## Step 3) 브랜드 토큰 생성 (BrandTokenizer)

* **입력**: 스크린샷 + ui_patterns + (옵션) logo
* **출력**

  * `/theme/theme.json`
  * `/theme/tokens.css` 또는 tailwind config 확장
  * 폰트 정책: 기본 Inter류 + 헤딩 폰트(대체 폰트 포함)로 안전하게
    ex: - Colors
        Primary:
        #374151
        Accent:
        #0000EE
        Background:
        #F4F4F4
        Text Primary:
        #0000EE
        Link:
        #0000EE
        - Fonts
        Inter(body)
        Cal Sans(heading)
        - Typography
        primary: Inter
        heading: Cal Sans
        h1: 64px
        h2: 48px
        body: 14px
        - Spacing
        Base Unit:
        4
        Border Radius:
        8px
        - Personality
        Tone: modern
        Energy: medium
        Audience: tech-savvy professionals
## Step 4) 페이지 설계(조립형 플랜)

* **입력**: product_type, audience, proof_mode, cta_mode, theme
* **출력**

  * `/plan/page_plan.json` (섹션 순서/각 섹션에 필요한 데이터 정의)
  * `/plan/components_map.json` (어떤 블록/섹션 컴포넌트를 쓸지)

  - 참고: 섹션별로 나누어진 랜딩페이지: https://tailwindcss.com/plus/ui-blocks?utm_source=chatgpt.com

    https://www.shadcnblocks.com/blocks : **`npx shadcn add`**로 설치/추가 흐름을 강조

    https://bundui.io/

    https://flowbite.com/blocks/?utm_source=chatgpt.com
## Step 5) 카피 + SEO + FAQ + 스키마 생성

* **입력**: 고객 데이터(지표/후기/인증) + 페이지 플랜 + 키워드(있으면)
* **출력**

  * `/content/copy.json`
  * `/content/seo.json`
  * `/content/faqs.json`
  * `/content/schema.jsonld`(FAQ/LocalBusiness/Service/Product/Article 중 조건부)
  - 참고 (SEO관련 정보)[[seo.md]]
## Step 6) 코드 생성(템플릿 주입)

* **입력**: page_plan + copy + theme + integrations
* **출력**: Next.js 프로젝트 완성

  * 섹션 컴포넌트는 “조립형”으로만 구성 (클라이언트 편집 시 레이아웃 붕괴 최소화)
  * 이미지: `/public`에 들어가거나, `next/image` 최적화 정책 적용
  * OG 이미지/파비콘 세팅
  * robots.txt, sitemap.xml 생성
  * 블로그 on이면:

    * (A) MDX 기반 `/blog/[slug]`
    * [현재 단계는 아직 X] (B) 또는 CMS 연동 (나중에 선택)

## Step 7) 연동 삽입 (CTA 플러그인)

### 7-A. 기본 CTA (브리프 데이터 → 자동 생성)

브리프에 해당 정보가 있으면 **자동으로 삽입**. 외부 서비스 계정 불필요.

| CTA | 브리프 조건 | 구현 | 비고 |
|-----|-----------|------|------|
| 전화 | `business_phone` 존재 | `<a href="tel:010-1234-5678">` | 모바일에서 바로 통화 |
| 카카오톡 | `kakao_url` 존재 | `<a href="https://open.kakao.com/o/...">` | 오픈채팅 = 비즈니스 계정 불필요 |
| 이메일 | `business_email` 존재 | `<a href="mailto:...">` | 보조 CTA |
| 지도 | `store_address` 존재 | 네이버 지도/카카오맵 링크 자동 생성 | 주소 → URL 변환 자동화 |

- 더 자세한 내용은 docs/CTA-form/CTA-form.md 참고

## Step 8) 컴플라이언스 페이지 생성

* `/privacy` 개인정보 처리방침
* `/cookies` 쿠키/추적 고지(필요 시)
* 폼 아래 체크박스: “개인정보 수집/이용 동의” + 링크

## Step 9) 자동 QA Gate (무검수의 핵심)

**통과 못 하면 배포를 실패 처리**합니다.

* 성능: Lighthouse 점수 하한선(예: Performance ≥ 85, SEO ≥ 90, A11y ≥ 85)
  → “90점 근처” 목표는 여기서 점진 상향
* 링크 체크: 404/외부 링크 깨짐 제거
* 이미지 체크: 누락/과대용량 감지
* 접근성: 최소 룰(버튼 라벨, 대비, 폼 라벨, 헤딩 계층)
* E2E: 폼 제출/웹훅 샘플 테스트(가능한 범위)

## Step 10) GitHub 푸시 → Vercel 자동배포

* **입력**: repo + env vars
* **출력**

  * Vercel preview/prod URL (`https://{project}.vercel.app`)
  * 배포 리포트 `/reports/deploy_report.md`

    * URL
    * 사용한 레퍼런스 목록
    * CTA 연동 상태
    * Lighthouse 결과 요약
    * Analytics/Speed Insights 활성화 여부

---

# 4) 최종 산출물(클라이언트에게 “납품/운영” 가능한 형태)

### 4-1. 지금 버전(도메인 미적용)

* `*.vercel.app` 배포 URL
* 운영 가이드(관리자용)

  * 콘텐츠 수정 위치(텍스트/이미지/블로그)
  * 리드 확인 방법:
    - Tally 사용 시: Tally 대시보드 또는 연동된 Google Sheets
    - Next.js+Sheets 사용 시: Google Sheets 직접 확인
    - Web3Forms 사용 시: 이메일 수신함
  * 예약 관리(Cal.com — 프리미엄 CTA 선택 시)
  * 월간 리포트 항목(트래픽/전환/CTA 클릭)

### 4-2. 운영형 모델에 필요한 “내부 산출물”

* `client_id`별 아카이브
  * brief.json / theme.json / plan.json / copy.json / deploy_report.md
  * “프롬프트/의사결정 로그”(사후 개선용)
* 수정 정책
  * 월 X회 수정(예: 카피/이메일 교체/섹션 순서 변경)
  * 범위 밖(리브랜딩/전체 재구성/새 기능) 유상

---

- 디자인 코드는 gemini 3.0 pro로 할 것을 추천합니다. (Antigravity gemini pro 3.0 || gemini --model gemini-3-pro --yolo 를 통해 gemini cli 실행)

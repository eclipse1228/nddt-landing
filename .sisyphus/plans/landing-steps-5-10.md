# NDDT Landing Page Pipeline — Steps 5-10

## TL;DR

> **Quick Summary**: Complete the automated landing page for 옆집개발실(NDDT) by generating Korean copy/SEO content, scaffolding a Next.js 14 project with 9 section components, wiring CTA integrations (Web3Forms, phone, email, map), adding PIPA compliance pages, passing Lighthouse QA gates, and deploying to Vercel.
>
> **Deliverables**:
> - Content artifacts: `copy.json`, `seo.json`, `faqs.json`, `schema.jsonld`
> - Full Next.js 14 App Router project with 9 sections + 3 pages + 404
> - Working Web3Forms contact form with consent checkbox
> - PIPA-compliant privacy policy page
> - Lighthouse scores ≥85/90/85 (Perf/SEO/A11y)
> - Live deployment at `*.vercel.app`
>
> **Estimated Effort**: Large
> **Parallel Execution**: YES — 4 waves
> **Critical Path**: T0 (prereqs) → T1-T4 (content) → T5-T8 (Next.js scaffold + components) → T9-T12 (CTA/compliance/QA) → T13-T14 (deploy + final review)

---

## Context

### Original Request
Continue the 10-step automated landing page pipeline. Steps 1-4 are complete (input validation, reference capture, brand tokenizer, template planning). Build Steps 5-10: Copy/SEO → Codegen → Integrations → Compliance → QA → Deploy.

### Interview Summary
**Key Discussions**:
- Zero human review ("무검수 자동화") is the core constraint
- First client is NDDT, an AI landing page agency targeting 소상공인/스타트업 in Busan
- Dark cinematic theme inspired by refokus.com and superwhisper.com
- Korean language throughout, professional ("전문") tone
- Web3Forms as form backend (250/month limit acceptable for MVP)
- No logo, favicon, or OG images — auto-generate text-based versions
- No testimonials — use "신뢰장치 대체안" (trust-building alternatives)
- No GA4/pixel tracking currently configured

**Research Findings**:
- Reference sites analyzed: bold purple neon gradients, high-motion — BUT must constrain to CSS-only animations for Perf ≥85
- Web3Forms integration documented in `docs/CTA-form/web3form-examples.md`
- Korean fonts Pretendard + SUIT Variable available via CDN
- bun 1.2.23 installed and ready; gh CLI authenticated as eclipse1228
- Vercel CLI NOT installed — requires installation + authentication (human step)
- No GitHub remote configured for this project

### Metis Review
**Identified Gaps** (addressed):
- **kakao_chat in page_plan.json pricing section but kakao_url is empty** → Remove kakao_chat from pricing CTAs (Task T0)
- **No concrete "신뢰장치 대체안" content defined** → Define 3 metric cards: 프로젝트 건수, 평균 제작일, 기술 만족도 (Task T3)
- **Gemini 3.0 Pro role unclear** → Default: use Claude/agent for all codegen; Gemini is optional design enhancement, not blocking
- **Web3Forms key must be env var, not hardcoded** → Use `.env.local` with `NEXT_PUBLIC_WEB3FORMS_KEY`
- **privacy_fields.third_party must include "Web3Forms"** → Fix in compliance page copy
- **Store address needs geocoding for schema.jsonld** → Hardcode lat:35.1553, lng:129.0596
- **No /thank-you or 404 pages planned** → Added to Step 6 scope
- **Vercel CLI + login is human prerequisite** → Document in .job-shadowing
- **OG image needed** → Use `next/og` (Satori) API route for dynamic OG

---

## Work Objectives

### Core Objective
Build and deploy a production-ready, SEO-optimized, PIPA-compliant Next.js landing page for NDDT from the existing planning artifacts, with zero human intervention except Vercel CLI authentication.

### Concrete Deliverables
- `client/first-client/content/copy.json` — section-level Korean copy
- `client/first-client/content/seo.json` — meta/OG/twitter tags
- `client/first-client/content/faqs.json` — 7 FAQ items
- `client/first-client/content/schema.jsonld` — LocalBusiness + FAQPage + Service
- Next.js 14 project in project root with App Router
- 9 section components matching `components_map.json`
- `/privacy` page, `/thank-you` page, `not-found.tsx`
- OG image generation via `next/og`
- Working Web3Forms form with PIPA consent
- Lighthouse-passing QA
- Live `*.vercel.app` deployment
- `client/first-client/reports/deploy_report.json`

### Definition of Done
- [ ] `bun run build` exits 0 with no errors
- [ ] `curl` to localhost:3000 returns 200
- [ ] All 9 sections render on the page
- [ ] Form submission to Web3Forms returns `{"success":true}`
- [ ] Lighthouse Performance ≥0.85, SEO ≥0.90, Accessibility ≥0.85
- [ ] `/privacy` page returns 200 and contains "개인정보처리방침"
- [ ] Production URL `*.vercel.app` returns 200

### Must Have
- All content in Korean (html lang="ko")
- Pretendard heading font + SUIT Variable body font + Noto Sans KR fallback
- Dark theme: #060915 bg, #5B2EFF primary, #FF6A00 accent
- Web3Forms form with 4 fields: 이름, 전화번호, 이메일, 요구사항
- Phone CTA: `tel:010-8477-6339`
- Email CTA: `mailto:qudtnrh@naver.com`
- Map link: Naver Map to "부산 부산진구 동천로 116, 3층 303호"
- 사업자정보 in footer: 옆집개발실(NDDT), 고병수, 부산 부산진구 동천로 116 3층 303호
- robots.txt + sitemap.xml
- Touch targets ≥44px on mobile
- `@vercel/analytics` + `@vercel/speed-insights`

### Must NOT Have (Guardrails)
- **NO animations beyond CSS transitions** — no GSAP, no scroll-linked parallax, no complex Framer Motion sequences. ONE simple fade-in via IntersectionObserver is max.
- **NO component abstraction beyond the 9 sections** — no shared Button/Card/Badge components. Each section is self-contained.
- **NO blog, MDX, CMS** — workflow explicitly says "[현재 단계는 아직 X]"
- **NO AI-generated images** — use CSS gradients, Lucide icons, text-based visuals only
- **NO cookie consent banner** — no tracking cookies in scope (no GA4/pixel)
- **NO additional pages beyond**: index, /privacy, /thank-you, 404
- **NO hardcoded secrets** — Web3Forms key in `.env.local` only
- **NO fake testimonials or fabricated client reviews** — use process/metric/guarantee trust signals
- **NO 과장 광고 표현** — per client brief constraint
- **NO English-only content** — all user-facing text must be Korean
- **Copy limits**: max 100 chars per heading, max 400 chars per body block (prevent verbose AI copy)

---

## Verification Strategy (MANDATORY)

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed. No exceptions.

### Test Decision
- **Infrastructure exists**: NO (no package.json yet)
- **Automated tests**: NO — QA Gate (Step 9) serves as the verification layer via Lighthouse + curl + link check
- **Framework**: None (testing deferred to future iteration)

### QA Policy
Every task MUST include agent-executed QA scenarios.
Evidence saved to `.sisyphus/evidence/task-{N}-{scenario-slug}.{ext}`.

| Deliverable Type | Verification Tool | Method |
|------------------|-------------------|--------|
| JSON artifacts | Bash (jq) | Parse, count fields, validate structure |
| Next.js build | Bash (bun) | `bun run build` exit code 0 |
| Page render | Bash (curl) | HTTP status + content grep |
| Form submission | Bash (curl) | POST to Web3Forms, assert success:true |
| Lighthouse | Bash (npx lighthouse) | Score thresholds |
| Deployment | Bash (curl) | Production URL returns 200 |

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 0 (Prerequisite fixes — sequential, fast):
├── Task T0: Fix artifacts + install prereqs [quick]

Wave 1 (Content generation — 4 parallel):
├── Task T1: Generate copy.json (depends: T0) [unspecified-high]
├── Task T2: Generate seo.json (depends: T0) [unspecified-high]
├── Task T3: Generate faqs.json (depends: T0) [unspecified-high]
├── Task T4: Generate schema.jsonld (depends: T0) [unspecified-high]

Wave 2 (Next.js project + components — 4 parallel after scaffold):
├── Task T5: Scaffold Next.js 14 project + Tailwind + fonts + theme (depends: T0) [unspecified-high]
├── Task T6: Build section components 1-5: Hero, ProofStrip, PainSolution, ServiceStack, Process (depends: T1,T3,T5) [visual-engineering]
├── Task T7: Build section components 6-9: Pricing, FAQ, FinalCTA, Footer (depends: T1,T3,T5) [visual-engineering]
├── Task T8: Build utility pages: /privacy, /thank-you, not-found, OG image route, layout, sitemap, robots (depends: T2,T4,T5) [unspecified-high]

Wave 3 (Integration + QA — 3 parallel then sequential QA):
├── Task T9: Wire Web3Forms + all CTAs (depends: T6,T7) [unspecified-high]
├── Task T10: Compliance audit + fix consent + footer data (depends: T8,T9) [unspecified-high]
├── Task T11: QA Gate — Lighthouse + link check + form E2E (depends: T9,T10) [deep]

Wave 4 (Deploy):
├── Task T12: Git push to GitHub + Vercel deploy (depends: T11) [quick]
├── Task T13: Generate deploy_report.json (depends: T12) [quick]

Wave FINAL (Independent review — 4 parallel):
├── Task F1: Plan compliance audit [oracle]
├── Task F2: Code quality review [unspecified-high]
├── Task F3: Real manual QA via Playwright [unspecified-high]
├── Task F4: Scope fidelity check [deep]

Critical Path: T0 → T5 → T6/T7 → T9 → T10 → T11 → T12 → F1-F4
Parallel Speedup: ~55% faster than sequential
Max Concurrent: 4 (Waves 1 & 2)
```

### Dependency Matrix

| Task | Depends On | Blocks | Wave |
|------|------------|--------|------|
| T0 | — | T1-T5 | 0 |
| T1 | T0 | T6, T7 | 1 |
| T2 | T0 | T8 | 1 |
| T3 | T0 | T6, T7 | 1 |
| T4 | T0 | T8 | 1 |
| T5 | T0 | T6, T7, T8 | 2 |
| T6 | T1, T3, T5 | T9 | 2 |
| T7 | T1, T3, T5 | T9 | 2 |
| T8 | T2, T4, T5 | T10 | 2 |
| T9 | T6, T7 | T10, T11 | 3 |
| T10 | T8, T9 | T11 | 3 |
| T11 | T9, T10 | T12 | 3 |
| T12 | T11 | T13, F1-F4 | 4 |
| T13 | T12 | F1-F4 | 4 |
| F1-F4 | T13 | — | FINAL |

### Agent Dispatch Summary

| Wave | # Parallel | Tasks → Agent Category |
|------|------------|----------------------|
| 0 | **1** | T0 → `quick` |
| 1 | **4** | T1-T4 → `unspecified-high` |
| 2 | **4** | T5 → `unspecified-high`, T6-T7 → `visual-engineering`, T8 → `unspecified-high` |
| 3 | **3→1** | T9-T10 → `unspecified-high`, T11 → `deep` |
| 4 | **2** | T12-T13 → `quick` |
| FINAL | **4** | F1 → `oracle`, F2 → `unspecified-high`, F3 → `unspecified-high`, F4 → `deep` |

---

## TODOs

- [ ] T0. Fix Planning Artifacts + Install Prerequisites

  **What to do**:
  - Edit `client/first-client/plan/page_plan.json`: remove `"kakao_chat"` from the pricing section's `cta` array (line 74) since `brief.json` has `kakao_url: ""`
  - Install Vercel CLI: `bun add -g vercel`
  - Verify Vercel auth status: `vercel whoami` — if not authenticated, document in `.job-shadowing/2026-02-16-vercel-auth-required.md` that human must run `vercel login`
  - Create GitHub remote: `gh repo create eclipse1228/nddt-landing --public --source=. --push` (or `--private` if preferred)
  - Verify: `gh repo view --json url`

  **Must NOT do**:
  - Do NOT modify brief.json
  - Do NOT push any code yet (just create the empty remote)

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Simple file edits and CLI commands, 5 minutes of work
  - **Skills**: [`git-master`]
    - `git-master`: Needed for GitHub repo creation and remote setup

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Sequential (Wave 0)
  - **Blocks**: T1, T2, T3, T4, T5
  - **Blocked By**: None

  **References**:

  **Pattern References**:
  - `client/first-client/plan/page_plan.json:73-76` — The pricing section CTA array containing `kakao_chat` that must be removed

  **API/Type References**:
  - `client/first-client/brief.json:19` — `kakao_url: ""` confirming kakao CTA is not available

  **External References**:
  - Vercel CLI docs: https://vercel.com/docs/cli

  **WHY Each Reference Matters**:
  - page_plan.json:73-76: This is the exact location of the kakao_chat entry that will cause a broken link if left in
  - brief.json:19: Confirms the kakao URL is empty, validating the removal

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: page_plan.json pricing CTA no longer contains kakao_chat
    Tool: Bash (jq)
    Preconditions: page_plan.json exists at client/first-client/plan/page_plan.json
    Steps:
      1. Run: cat client/first-client/plan/page_plan.json | jq '.sections[] | select(.id=="pricing") | .cta'
      2. Assert output is: ["form_submit"]
      3. Run: cat client/first-client/plan/page_plan.json | node -e "JSON.parse(require('fs').readFileSync('/dev/stdin','utf8'))"
      4. Assert: exit code 0 (valid JSON)
    Expected Result: pricing.cta = ["form_submit"] only, no "kakao_chat"
    Failure Indicators: "kakao_chat" still appears in output, or JSON parse error
    Evidence: .sisyphus/evidence/task-T0-pageplan-fix.txt

  Scenario: GitHub remote created and accessible
    Tool: Bash (gh)
    Preconditions: gh CLI authenticated as eclipse1228
    Steps:
      1. Run: gh repo view eclipse1228/nddt-landing --json url 2>/dev/null || echo "NOT_FOUND"
      2. If NOT_FOUND: run gh repo create eclipse1228/nddt-landing --public --source=. --remote=origin
      3. Run: git remote -v
      4. Assert: output contains "origin" with github.com URL
    Expected Result: Remote "origin" points to eclipse1228/nddt-landing
    Failure Indicators: No remote configured, or gh command fails
    Evidence: .sisyphus/evidence/task-T0-github-remote.txt

  Scenario: Vercel CLI installed or blocker documented
    Tool: Bash
    Preconditions: bun installed
    Steps:
      1. Run: bun add -g vercel
      2. Run: vercel whoami 2>&1
      3. If "not logged in" or error: create .job-shadowing/2026-02-16-vercel-auth-required.md documenting that human must run `vercel login`
      4. Assert: vercel command is available (which vercel returns a path)
    Expected Result: vercel CLI installed; auth status documented
    Failure Indicators: vercel command not found after install
    Evidence: .sisyphus/evidence/task-T0-vercel-cli.txt
  ```

  **Commit**: YES
  - Message: `fix(plan): remove kakao_chat from pricing CTA + setup GitHub remote`
  - Files: `client/first-client/plan/page_plan.json`
  - Pre-commit: `node -e "JSON.parse(require('fs').readFileSync('client/first-client/plan/page_plan.json','utf8'))"`

---

- [ ] T1. Generate copy.json — Section-Level Korean Copywriting

  **What to do**:
  - Read `client/first-client/brief.json`, `client/first-client/plan/page_plan.json`, `client/first-client/theme/theme.json`, `first-clients-info.md`, and `knowledgeoflandingpage.md`
  - Generate `client/first-client/content/copy.json` with this structure:
    ```json
    {
      "generated_at": "<ISO timestamp>",
      "client_id": "first-client",
      "locale": "ko",
      "sections": [
        {
          "id": "hero",
          "headline": "소상공인 맞춤 랜딩페이지, AI가 3일 만에 완성합니다",
          "subheadline": "...",
          "body": "...",
          "cta_primary_text": "무료 상담 받기",
          "cta_secondary_text": "전화 문의"
        },
        ...9 sections total
      ]
    }
    ```
  - For `proof_strip` (no testimonials), use "신뢰장치 대체안" — 3 metric cards:
    - `metric_1`: { label: "평균 제작 기간", value: "3일", detail: "기획부터 배포까지" }
    - `metric_2`: { label: "반응형 최적화", value: "100%", detail: "PC·태블릿·모바일" }
    - `metric_3`: { label: "SEO 기본 포함", value: "✓", detail: "메타태그·스키마·사이트맵" }
  - For `pricing` (pricing="문의"), render as single "맞춤 견적" card with form CTA, NOT a comparison grid
  - All Korean text, professional tone ("전문"), no 과장 광고
  - Headings ≤100 characters, body blocks ≤400 characters

  **Must NOT do**:
  - NO English content in user-facing fields
  - NO fabricated testimonials or client names
  - NO 과장 광고 표현 (e.g., "최고", "1위", "guaranteed")
  - NO lorem ipsum or placeholder text

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Content generation requiring domain knowledge and Korean language fluency
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with T2, T3, T4)
  - **Blocks**: T6, T7
  - **Blocked By**: T0

  **References**:

  **Pattern References**:
  - `client/first-client/plan/page_plan.json` — All 9 sections with their goals, required_inputs, and CTA mappings
  - `client/first-client/theme/theme.json:4-13` — Tone ("전문"), personality, style_notes for copywriting direction
  - `first-clients-info.md:49-92` — Service description content from 크몽 listing — reuse relevant Korean copy patterns

  **API/Type References**:
  - `client/first-client/brief.json:13` — `offer_summary`: "소상공인과 스타트업을 위한 AI 기반 랜딩페이지 자동 제작/배포 서비스"
  - `client/first-client/brief.json:15` — `target_audience`: "소상공인, 1인 사업자, 스타트업 마케팅 담당자"
  - `client/first-client/brief.json:47-56` — SEO keywords for natural inclusion in copy

  **External References**:
  - `knowledgeoflandingpage.md` — Landing page copywriting best practices and conversion patterns
  - `seo.md` — SEO-optimized content writing guidelines

  **WHY Each Reference Matters**:
  - page_plan.json: Defines exactly which sections need copy and what each section's conversion goal is
  - theme.json personality: Ensures copy tone matches "전문" (professional) not "친근" (friendly)
  - first-clients-info.md: Contains real Korean service descriptions that can inform authentic copy patterns
  - brief.json SEO keywords: Must be naturally woven into headings and body text for search visibility

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: copy.json has all 9 sections matching page_plan.json
    Tool: Bash (jq)
    Preconditions: client/first-client/content/copy.json exists
    Steps:
      1. Run: cat client/first-client/content/copy.json | jq '.sections | length'
      2. Assert output: 9
      3. Run: cat client/first-client/content/copy.json | jq '[.sections[].id] | sort'
      4. Assert output: ["faq","final_cta","footer","hero","pain_solution","pricing","process","proof_strip","service_stack"]
      5. Run: cat client/first-client/content/copy.json | jq '.locale'
      6. Assert output: "ko"
    Expected Result: 9 sections with correct IDs, locale is "ko"
    Failure Indicators: Missing sections, wrong IDs, or non-"ko" locale
    Evidence: .sisyphus/evidence/task-T1-copy-structure.txt

  Scenario: No 과장 광고 표현 in copy
    Tool: Bash (grep)
    Preconditions: copy.json exists
    Steps:
      1. Run: cat client/first-client/content/copy.json | grep -ci "최고\|1위\|guaranteed\|업계 최초\|100% 보장"
      2. Assert output: 0
    Expected Result: Zero matches for exaggerated marketing terms
    Failure Indicators: Any match count > 0
    Evidence: .sisyphus/evidence/task-T1-copy-no-exaggeration.txt

  Scenario: proof_strip uses metric cards, not testimonials
    Tool: Bash (jq)
    Preconditions: copy.json exists
    Steps:
      1. Run: cat client/first-client/content/copy.json | jq '.sections[] | select(.id=="proof_strip") | .metrics | length'
      2. Assert output: 3
      3. Run: cat client/first-client/content/copy.json | jq '.sections[] | select(.id=="proof_strip") | has("testimonials")'
      4. Assert output: false
    Expected Result: proof_strip has 3 metrics, no testimonials field
    Failure Indicators: metrics count != 3, or testimonials field exists
    Evidence: .sisyphus/evidence/task-T1-proof-strip-metrics.txt
  ```

  **Commit**: YES
  - Message: `feat(content): generate Korean copy for 9 landing page sections`
  - Files: `client/first-client/content/copy.json`
  - Pre-commit: `node -e "JSON.parse(require('fs').readFileSync('client/first-client/content/copy.json','utf8'))"`

---

- [ ] T2. Generate seo.json — Meta Tags, OG, Twitter Cards

  **What to do**:
  - Read `client/first-client/brief.json` (SEO keywords, business info), `client/first-client/theme/theme.json`
  - Generate `client/first-client/content/seo.json`:
    ```json
    {
      "generated_at": "<ISO timestamp>",
      "client_id": "first-client",
      "title": "소상공인 랜딩페이지 제작 | 옆집개발실 NDDT",
      "description": "AI 기반으로 3일 만에 반응형 랜딩페이지를 제작합니다. DB수집, SEO 최적화 기본 포함. 부산 소상공인·스타트업 전문.",
      "canonical": "",
      "locale": "ko_KR",
      "og": {
        "type": "website",
        "title": "...",
        "description": "...",
        "image": "/api/og",
        "image_width": 1200,
        "image_height": 630
      },
      "twitter": {
        "card": "summary_large_image",
        "title": "...",
        "description": "..."
      },
      "keywords": ["소상공인 랜딩페이지 제작", "반응형 랜딩페이지", ...],
      "robots": "index, follow",
      "alternate_hreflangs": []
    }
    ```
  - Title ≤55 characters, description ≤155 characters
  - Include primary + secondary + local keywords
  - canonical left empty (will be set to vercel.app URL after deploy)
  - OG image path: `/api/og` (will be generated by `next/og` Satori route in T8)

  **Must NOT do**:
  - NO English meta descriptions
  - NO keyword stuffing (max 2 keyword mentions in description)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: SEO expertise needed for Korean market meta tag optimization
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with T1, T3, T4)
  - **Blocks**: T8
  - **Blocked By**: T0

  **References**:

  **Pattern References**:
  - `client/first-client/brief.json:46-56` — SEO config: primary/secondary/local keywords

  **API/Type References**:
  - `client/first-client/brief.json:23-29` — business_owner_info for brand name in title

  **External References**:
  - `seo.md` — SEO optimization guidelines including meta title/description best practices

  **WHY Each Reference Matters**:
  - brief.json SEO section: Contains exact keywords to include in meta tags
  - seo.md: Provides character limits and Korean SEO formatting best practices

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: seo.json has valid title and description within length limits
    Tool: Bash (jq)
    Preconditions: client/first-client/content/seo.json exists
    Steps:
      1. Run: cat client/first-client/content/seo.json | jq '.title | length'
      2. Assert: output ≤ 60
      3. Run: cat client/first-client/content/seo.json | jq '.description | length'
      4. Assert: output ≤ 160
      5. Run: cat client/first-client/content/seo.json | jq '.og.image'
      6. Assert output: "/api/og"
      7. Run: cat client/first-client/content/seo.json | jq '.locale'
      8. Assert output: "ko_KR"
    Expected Result: title ≤60 chars, desc ≤160 chars, OG image path set, Korean locale
    Failure Indicators: title or desc exceeds limits, missing og.image, wrong locale
    Evidence: .sisyphus/evidence/task-T2-seo-validation.txt
  ```

  **Commit**: YES (grouped with T3, T4)
  - Message: `feat(content): generate SEO meta, FAQs, and schema.jsonld`
  - Files: `client/first-client/content/seo.json`, `client/first-client/content/faqs.json`, `client/first-client/content/schema.jsonld`
  - Pre-commit: `node -e "['seo','faqs'].forEach(f=>JSON.parse(require('fs').readFileSync('client/first-client/content/'+f+'.json','utf8')))"`

---

- [ ] T3. Generate faqs.json — FAQ for 구매저항 해소

  **What to do**:
  - Read `client/first-client/brief.json`, `first-clients-info.md` (existing FAQ content from 크몽 listing)
  - Generate `client/first-client/content/faqs.json`:
    ```json
    {
      "generated_at": "<ISO timestamp>",
      "client_id": "first-client",
      "faqs": [
        {
          "question": "랜딩페이지 제작 기간은 얼마나 걸리나요?",
          "answer": "평균 3일 이내에 기획부터 배포까지 완료됩니다..."
        },
        ...7 items minimum
      ]
    }
    ```
  - Minimum 7 FAQ items covering:
    1. 제작 기간
    2. 가격/비용
    3. 수정 가능 여부
    4. DB수집 방식
    5. 모바일 반응형
    6. SEO 적용 범위
    7. 유지보수/호스팅
  - Reference `first-clients-info.md:274-290` for existing FAQ patterns from 크몽 listing — adapt and improve
  - Korean only, factual, no exaggeration

  **Must NOT do**:
  - NO fabricated statistics
  - NO competitor bashing
  - NO answers longer than 300 characters

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Domain knowledge needed for Korean 소상공인 FAQ patterns
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with T1, T2, T4)
  - **Blocks**: T6, T7
  - **Blocked By**: T0

  **References**:

  **Pattern References**:
  - `first-clients-info.md:274-290` — Existing FAQ from 크몽 listing with proven questions/answers to adapt

  **API/Type References**:
  - `client/first-client/plan/page_plan.json:78-86` — FAQ section spec: block_type "accordion_faq", goal "구매 저항 해소"

  **External References**:
  - `knowledgeoflandingpage.md` — FAQ best practices for conversion

  **WHY Each Reference Matters**:
  - first-clients-info.md FAQ: Contains real Korean FAQ patterns tested on 크몽 marketplace — authentic voice
  - page_plan.json FAQ section: Confirms the section's conversion goal is "구매 저항 해소" (overcoming purchase resistance)

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: faqs.json has ≥7 Q&A items
    Tool: Bash (jq)
    Preconditions: client/first-client/content/faqs.json exists
    Steps:
      1. Run: cat client/first-client/content/faqs.json | jq '.faqs | length'
      2. Assert: output >= 7
      3. Run: cat client/first-client/content/faqs.json | jq '.faqs[0] | has("question","answer")'
      4. Assert: true
    Expected Result: ≥7 FAQ items, each with question and answer fields
    Failure Indicators: fewer than 7 items or missing fields
    Evidence: .sisyphus/evidence/task-T3-faqs-count.txt
  ```

  **Commit**: YES (grouped with T2 — see T2 commit)

---

- [ ] T4. Generate schema.jsonld — Structured Data

  **What to do**:
  - Read `client/first-client/brief.json`, `client/first-client/content/faqs.json` (from T3)
  - Generate `client/first-client/content/schema.jsonld` with combined schema:
    ```json
    {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "LocalBusiness",
          "name": "옆집개발실(NDDT)",
          "description": "소상공인과 스타트업을 위한 AI 기반 랜딩페이지 자동 제작/배포 서비스",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "동천로 116, 3층 303호",
            "addressLocality": "부산진구",
            "addressRegion": "부산",
            "addressCountry": "KR"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": 35.1553,
            "longitude": 129.0596
          },
          "telephone": "010-8477-6339",
          "email": "qudtnrh@naver.com"
        },
        {
          "@type": "FAQPage",
          "mainEntity": [... mapped from faqs.json ...]
        },
        {
          "@type": "Service",
          "name": "AI 랜딩페이지 제작",
          "provider": { "@type": "LocalBusiness", "name": "옆집개발실(NDDT)" },
          "serviceType": "웹/앱 개발"
        }
      ]
    }
    ```
  - Geocoordinates: lat 35.1553, lng 129.0596 (부산 부산진구 동천로 116)
  - FAQ schema items mapped directly from faqs.json

  **Must NOT do**:
  - NO incorrect geo coordinates
  - NO @type "Organization" (this is a LocalBusiness)
  - NO fabricated review/rating schema

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Structured data requires precise schema.org compliance
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (but ideally after T3 for FAQ data)
  - **Parallel Group**: Wave 1 (with T1, T2, T3)
  - **Blocks**: T8
  - **Blocked By**: T0, T3 (needs faqs.json for FAQPage schema)

  **References**:

  **Pattern References**:
  - `client/first-client/brief.json:23-29` — business_owner_info with name, address, contact

  **API/Type References**:
  - Schema.org LocalBusiness: https://schema.org/LocalBusiness
  - Schema.org FAQPage: https://schema.org/FAQPage

  **WHY Each Reference Matters**:
  - brief.json business_owner_info: Source of truth for all business details in schema
  - Schema.org specs: Ensures structured data is valid and recognized by Google

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: schema.jsonld contains LocalBusiness + FAQPage + Service
    Tool: Bash (jq)
    Preconditions: client/first-client/content/schema.jsonld exists
    Steps:
      1. Run: cat client/first-client/content/schema.jsonld | jq '.["@graph"] | map(.["@type"]) | sort'
      2. Assert output contains: "FAQPage", "LocalBusiness", "Service"
      3. Run: cat client/first-client/content/schema.jsonld | jq '.["@graph"][] | select(.["@type"]=="LocalBusiness") | .geo.latitude'
      4. Assert output: 35.1553
      5. Run: cat client/first-client/content/schema.jsonld | jq '.["@graph"][] | select(.["@type"]=="FAQPage") | .mainEntity | length'
      6. Assert output: >= 7
    Expected Result: All 3 schema types present, correct geocoordinates, FAQ items mapped
    Failure Indicators: Missing schema types, wrong coordinates, empty FAQ array
    Evidence: .sisyphus/evidence/task-T4-schema-validation.txt
  ```

  **Commit**: YES (grouped with T2 — see T2 commit)

---

- [ ] T5. Scaffold Next.js 14 Project + Tailwind + Fonts + Theme

  **What to do**:
  - Initialize Next.js 14.2.x project in project root with App Router:
    ```bash
    bunx create-next-app@14 . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-bun
    ```
    Note: Project root already has files (client/, scripts/, etc.) — the Next.js scaffold should add its files alongside them. If `create-next-app` refuses non-empty dir, manually scaffold: `package.json`, `next.config.mjs`, `tsconfig.json`, `tailwind.config.ts`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`
  - Set up `tailwind.config.ts` extending theme tokens from `client/first-client/theme/tokens.css`:
    - Map CSS custom properties to Tailwind theme colors: primary (#5B2EFF), accent (#FF6A00), background (#060915), surface (#10172B), text-primary (#F3F6FF), text-secondary (#B6C0D8), border (#29324A)
  - Set up Korean fonts via `next/font`:
    - Pretendard (heading): CDN `https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/pretendardvariable.css`
    - SUIT Variable (body): CDN `https://cdn.jsdelivr.net/gh/sunn-us/SUIT/fonts/variable/woff2/SUIT-Variable.css`
    - Noto Sans KR (fallback): via `next/font/google`
  - Create `src/app/globals.css` importing theme tokens
  - Create `src/app/layout.tsx` with:
    - `<html lang="ko">` with dark theme
    - Font classes applied
    - `@vercel/analytics` + `@vercel/speed-insights` imports
  - Create directory structure:
    ```
    src/
      app/
        layout.tsx
        page.tsx (empty shell importing sections)
        globals.css
        privacy/page.tsx (placeholder)
        thank-you/page.tsx (placeholder)
        not-found.tsx (placeholder)
        api/og/route.tsx (placeholder)
      components/
        sections/ (empty, for T6/T7)
    ```
  - Install dependencies: `bun add @vercel/analytics @vercel/speed-insights`
  - Create `.env.local` with `NEXT_PUBLIC_WEB3FORMS_KEY=6f575653-f96c-4e6d-9d08-5aff4818b955`
  - Add `.env.local` to `.gitignore`
  - Ensure `bun run build` succeeds with placeholder page

  **Must NOT do**:
  - NO complex animation libraries (no framer-motion, no GSAP)
  - NO additional UI libraries beyond Tailwind (no shadcn, no chakra)
  - NO `src/components/shared/` or `src/components/ui/` directories — sections are self-contained
  - Do NOT delete existing files in project root (client/, scripts/, docs/, etc.)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Next.js project scaffolding with specific configuration requirements
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Tailwind configuration, font setup, layout structure

  **Parallelization**:
  - **Can Run In Parallel**: NO (must complete before T6, T7, T8)
  - **Parallel Group**: Wave 2 start (sequential prerequisite)
  - **Blocks**: T6, T7, T8
  - **Blocked By**: T0

  **References**:

  **Pattern References**:
  - `client/first-client/theme/theme.json` — Full theme: colors, typography, spacing, motion tokens
  - `client/first-client/theme/tokens.css` — CSS custom properties ready to integrate

  **API/Type References**:
  - `client/first-client/plan/components_map.json` — Component names and directory structure
  - `client/first-client/brief.json:71-74` — form_config for .env.local Web3Forms key

  **External References**:
  - Next.js 14 App Router: https://nextjs.org/docs/app
  - Pretendard CDN: https://github.com/orioncactus/pretendard
  - SUIT Variable CDN: https://github.com/sunn-us/SUIT
  - @vercel/analytics: https://vercel.com/docs/analytics
  - @vercel/speed-insights: https://vercel.com/docs/speed-insights

  **WHY Each Reference Matters**:
  - theme.json/tokens.css: These are the ONLY source of truth for all colors, fonts, spacing — must be mapped to Tailwind config exactly
  - components_map.json: Defines the 9 component file names for the `src/components/sections/` directory
  - brief.json form_config: Contains the Web3Forms access key that must go in .env.local

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Next.js project builds successfully
    Tool: Bash (bun)
    Preconditions: package.json exists in project root
    Steps:
      1. Run: bun run build 2>&1
      2. Assert: exit code 0
      3. Run: bun run build 2>&1 | grep "First Load JS"
      4. Assert: shared JS < 200KB
    Expected Result: Build succeeds, bundle size under 200KB
    Failure Indicators: Build errors, bundle exceeds 200KB
    Evidence: .sisyphus/evidence/task-T5-build-output.txt

  Scenario: Dev server starts and returns 200
    Tool: Bash
    Preconditions: Build passed
    Steps:
      1. Run: timeout 20 bash -c 'bun run dev &; sleep 12; curl -s -o /dev/null -w "%{http_code}" http://localhost:3000; kill %1'
      2. Assert: HTTP status is 200
    Expected Result: Dev server responds with 200 on localhost:3000
    Failure Indicators: Connection refused, 500 error, or timeout
    Evidence: .sisyphus/evidence/task-T5-devserver-status.txt

  Scenario: html lang="ko" is set
    Tool: Bash (curl + grep)
    Preconditions: Dev server running
    Steps:
      1. Run: curl -s http://localhost:3000 | grep -o 'lang="ko"'
      2. Assert: output is 'lang="ko"'
    Expected Result: Korean language attribute present on html tag
    Failure Indicators: Missing lang attribute or wrong locale
    Evidence: .sisyphus/evidence/task-T5-html-lang.txt

  Scenario: .env.local exists with Web3Forms key
    Tool: Bash
    Preconditions: .env.local created
    Steps:
      1. Run: grep "NEXT_PUBLIC_WEB3FORMS_KEY" .env.local
      2. Assert: output contains "6f575653-f96c-4e6d-9d08-5aff4818b955"
      3. Run: grep ".env.local" .gitignore
      4. Assert: .env.local is in .gitignore
    Expected Result: Key present in .env.local, file is gitignored
    Failure Indicators: Key missing, or .env.local not in .gitignore
    Evidence: .sisyphus/evidence/task-T5-env-check.txt
  ```

  **Commit**: YES
  - Message: `feat(scaffold): initialize Next.js 14 with Tailwind, Korean fonts, and theme tokens`
  - Files: `package.json`, `next.config.mjs`, `tsconfig.json`, `tailwind.config.ts`, `src/app/**`, `.env.local`, `.gitignore`
  - Pre-commit: `bun run build`

---

- [ ] T6. Build Section Components 1-5: Hero, ProofStrip, PainSolution, ServiceStack, Process

  **What to do**:
  - Create 5 React components in `src/components/sections/`:
    1. `AgencyHeroSection.tsx` — Hero with dual CTA (form + phone), bold headline, dark bg with purple gradient
    2. `TrustProofStrip.tsx` — 3 metric cards (from copy.json proof_strip.metrics), horizontal layout
    3. `PainSolutionCards.tsx` — Problem→solution card pairs with form CTA
    4. `ServiceFeatureGrid.tsx` — Grid of service features with Lucide icons
    5. `ProcessTimeline.tsx` — Vertical timeline showing 4-6 process steps
  - Read copy from `client/first-client/content/copy.json` — import and render section-specific text
  - Use Tailwind classes mapped from theme tokens (primary, accent, bg, surface, text colors)
  - Mobile-first responsive design (touch targets ≥44px)
  - ONE simple CSS-based fade-in animation using IntersectionObserver (create once, reuse)
  - Each component is a self-contained file — no shared components extracted
  - Wire into `src/app/page.tsx` in correct order

  **Must NOT do**:
  - NO external animation libraries
  - NO shared component extraction (no Button.tsx, Card.tsx)
  - NO image tags or external images — use CSS gradients, icons (Lucide), text
  - NO hardcoded Korean text — all text must come from copy.json data
  - NO complex hover states beyond simple CSS transitions

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: UI component development with Tailwind CSS, responsive design, visual polish
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Korean typography, dark theme visual design, section component architecture

  **Parallelization**:
  - **Can Run In Parallel**: YES (parallel with T7 if T5 is done)
  - **Parallel Group**: Wave 2 (with T7, T8)
  - **Blocks**: T9
  - **Blocked By**: T1 (copy.json), T3 (faqs.json for proof metrics), T5 (scaffold)

  **References**:

  **Pattern References**:
  - `client/first-client/plan/components_map.json:3-28` — Component names: AgencyHeroSection, TrustProofStrip, PainSolutionCards, ServiceFeatureGrid, ProcessTimeline
  - `client/first-client/plan/page_plan.json:6-66` — Sections 1-5 goals, required_inputs, and CTA mappings
  - `client/first-client/theme/theme.json:15-34` — Color palette + typography scale for Tailwind classes

  **API/Type References**:
  - `client/first-client/content/copy.json` (from T1) — Section copy data to render
  - `client/first-client/brief.json:17` — business_phone for hero phone CTA

  **External References**:
  - Lucide React icons: https://lucide.dev/guide/packages/lucide-react
  - Tailwind dark theme: https://tailwindcss.com/docs/dark-mode

  **WHY Each Reference Matters**:
  - components_map.json: Exact component file names to create — must match exactly
  - page_plan.json sections 1-5: Each section has a specific conversion goal that dictates layout and CTA placement
  - theme.json colors: Dark theme requires high-contrast text (#F3F6FF on #060915), purple (#5B2EFF) accents, orange (#FF6A00) for CTAs
  - copy.json: ALL visible text must come from this file — no hardcoded strings

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: All 5 section component files exist and export correctly
    Tool: Bash
    Preconditions: T5 scaffold complete
    Steps:
      1. Run: ls src/components/sections/AgencyHeroSection.tsx src/components/sections/TrustProofStrip.tsx src/components/sections/PainSolutionCards.tsx src/components/sections/ServiceFeatureGrid.tsx src/components/sections/ProcessTimeline.tsx
      2. Assert: all 5 files listed (exit code 0)
      3. Run: bun run build 2>&1
      4. Assert: exit code 0
    Expected Result: All 5 files exist and project builds with them
    Failure Indicators: Missing files or build errors
    Evidence: .sisyphus/evidence/task-T6-components-exist.txt

  Scenario: Hero section renders with phone CTA
    Tool: Bash (curl + grep)
    Preconditions: Dev server running
    Steps:
      1. Run: curl -s http://localhost:3000 | grep -o 'href="tel:010-8477-6339"'
      2. Assert: output is not empty
      3. Run: curl -s http://localhost:3000 | grep -c "AgencyHeroSection\|hero"
      4. Assert: > 0
    Expected Result: Phone CTA link present in rendered HTML
    Failure Indicators: tel: link not found
    Evidence: .sisyphus/evidence/task-T6-hero-phone-cta.txt

  Scenario: Touch targets ≥ 44px on mobile viewport
    Tool: Bash (curl)
    Preconditions: Dev server running
    Steps:
      1. Run: curl -s http://localhost:3000 | grep -c "min-h-\[44px\]\|min-h-11\|p-3\|py-3\|h-11\|h-12"
      2. Assert: > 0 (touch-friendly classes present)
    Expected Result: Components use touch-friendly sizing
    Failure Indicators: No evidence of 44px minimum sizing
    Evidence: .sisyphus/evidence/task-T6-touch-targets.txt
  ```

  **Commit**: YES
  - Message: `feat(sections): build Hero, ProofStrip, PainSolution, ServiceStack, Process components`
  - Files: `src/components/sections/AgencyHeroSection.tsx`, `TrustProofStrip.tsx`, `PainSolutionCards.tsx`, `ServiceFeatureGrid.tsx`, `ProcessTimeline.tsx`, `src/app/page.tsx`
  - Pre-commit: `bun run build`

---

- [ ] T7. Build Section Components 6-9: Pricing, FAQ, FinalCTA, Footer

  **What to do**:
  - Create 4 React components in `src/components/sections/`:
    1. `PricingTeaserCards.tsx` — Single "맞춤 견적" card (pricing="문의") with form CTA. NOT a comparison grid.
    2. `FaqAccordion.tsx` — Accordion/collapse FAQ from faqs.json, `<details>`/`<summary>` for zero-JS
    3. `FinalCtaBanner.tsx` — Full-width CTA banner with form + phone + map links
    4. `LegalFooter.tsx` — 사업자정보 (옆집개발실 NDDT, 고병수, address, contact) + privacy policy link + copyright
  - Read copy from `client/first-client/content/copy.json` and `client/first-client/content/faqs.json`
  - PricingTeaserCards: single card layout since pricing is "문의" — highlight "맞춤 견적 상담" with form CTA
  - FaqAccordion: use native HTML `<details>` + `<summary>` for accessibility and zero-JS operation
  - LegalFooter must include: 상호명, 대표자, 사업장 주소, 연락처, 이메일, 개인정보처리방침 링크
  - Wire all 4 components into `src/app/page.tsx` in correct order (sections 6-9)

  **Must NOT do**:
  - NO pricing comparison grid (only one plan shown as "문의")
  - NO JavaScript-heavy accordion — use `<details>/<summary>` or simple CSS toggle
  - NO fake reviews or star ratings
  - NO links to pages that don't exist

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: UI component development with legal/compliance display requirements
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Dark theme accordion UI, footer layout, CTA banner design

  **Parallelization**:
  - **Can Run In Parallel**: YES (parallel with T6 if T5 is done)
  - **Parallel Group**: Wave 2 (with T6, T8)
  - **Blocks**: T9
  - **Blocked By**: T1 (copy.json), T3 (faqs.json), T5 (scaffold)

  **References**:

  **Pattern References**:
  - `client/first-client/plan/components_map.json:29-49` — Component names: PricingTeaserCards, FaqAccordion, FinalCtaBanner, LegalFooter
  - `client/first-client/plan/page_plan.json:67-114` — Sections 6-9 goals, CTA mappings
  - `client/first-client/brief.json:23-29` — business_owner_info for footer

  **API/Type References**:
  - `client/first-client/content/faqs.json` (from T3) — FAQ data for accordion
  - `client/first-client/content/copy.json` (from T1) — Section copy for pricing, CTA, footer

  **External References**:
  - HTML `<details>` element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details

  **WHY Each Reference Matters**:
  - components_map.json: Exact file names for the 4 components
  - page_plan.json sections 6-9: Each section's CTA mapping (pricing has form_submit only, final_cta has form+phone+map)
  - brief.json business_owner_info: Exact text for legal footer — must match business registration data

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: All 4 section component files exist
    Tool: Bash
    Preconditions: T5 scaffold complete
    Steps:
      1. Run: ls src/components/sections/PricingTeaserCards.tsx src/components/sections/FaqAccordion.tsx src/components/sections/FinalCtaBanner.tsx src/components/sections/LegalFooter.tsx
      2. Assert: all 4 files listed (exit code 0)
      3. Run: bun run build 2>&1
      4. Assert: exit code 0
    Expected Result: All 4 files exist and project builds
    Failure Indicators: Missing files or build errors
    Evidence: .sisyphus/evidence/task-T7-components-exist.txt

  Scenario: Footer contains 사업자정보
    Tool: Bash (curl + grep)
    Preconditions: Dev server running
    Steps:
      1. Run: curl -s http://localhost:3000 | grep -c "옆집개발실"
      2. Assert: > 0
      3. Run: curl -s http://localhost:3000 | grep -c "고병수"
      4. Assert: > 0
      5. Run: curl -s http://localhost:3000 | grep -o 'href="/privacy"'
      6. Assert: not empty
    Expected Result: Business info and privacy link in footer HTML
    Failure Indicators: Missing business name, representative, or privacy link
    Evidence: .sisyphus/evidence/task-T7-footer-info.txt

  Scenario: FAQ uses native HTML details/summary
    Tool: Bash (curl + grep)
    Preconditions: Dev server running
    Steps:
      1. Run: curl -s http://localhost:3000 | grep -c "<details"
      2. Assert: >= 7 (one per FAQ item)
      3. Run: curl -s http://localhost:3000 | grep -c "<summary"
      4. Assert: >= 7
    Expected Result: Native HTML accordion elements for FAQ
    Failure Indicators: No <details> elements found
    Evidence: .sisyphus/evidence/task-T7-faq-details.txt
  ```

  **Commit**: YES
  - Message: `feat(sections): build Pricing, FAQ, FinalCTA, Footer components`
  - Files: `src/components/sections/PricingTeaserCards.tsx`, `FaqAccordion.tsx`, `FinalCtaBanner.tsx`, `LegalFooter.tsx`, `src/app/page.tsx`
  - Pre-commit: `bun run build`

---

- [ ] T8. Build Utility Pages: Privacy, Thank-You, 404, OG Image, Layout, Sitemap, Robots

  **What to do**:
  - **`src/app/privacy/page.tsx`**: PIPA-compliant 개인정보처리방침 page with:
    - 수집 항목: 이름, 전화번호, 이메일, 요구사항 (from brief.json:31-35)
    - 수집 목적: 상담 문의 처리 및 회신
    - 보관 기간: 상담 완료 후 1년 (from brief.json:36)
    - 제3자 제공: Web3Forms (form delivery service) — **MUST add Web3Forms as third-party processor**
    - 동의 거부 권리 고지
    - 개인정보 보호 책임자: 고병수, qudtnrh@naver.com
  - **`src/app/thank-you/page.tsx`**: Form submission success page — "문의가 접수되었습니다" message, 5s auto-redirect to home
  - **`src/app/not-found.tsx`**: Custom 404 page — on-brand dark theme, "페이지를 찾을 수 없습니다", link back to home
  - **`src/app/api/og/route.tsx`**: OG image generation using `next/og` (Satori):
    - Dark bg (#060915), brand text "옆집개발실 NDDT", primary purple (#5B2EFF) accent line
    - 1200x630px, Korean text (use system fonts available in Satori)
  - **Update `src/app/layout.tsx`**: Add metadata from seo.json (title, description, OG, twitter cards)
  - **`next-sitemap.config.js`**: Install `next-sitemap` and configure for auto-generation of sitemap.xml and robots.txt
    ```bash
    bun add next-sitemap
    ```
  - **`src/app/robots.ts`** or `public/robots.txt`: Allow all crawlers
  - Schema.jsonld injection as `<script type="application/ld+json">` in layout or page

  **Must NOT do**:
  - NO cookie consent banner (no tracking cookies in scope)
  - NO external image URLs in OG route — generate pure SVG/text
  - NO placeholder or lorem ipsum in privacy page — must have real PIPA content

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Mixed concerns — legal compliance page, SEO metadata, API route, Next.js configuration
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Layout metadata setup, OG image design, page styling

  **Parallelization**:
  - **Can Run In Parallel**: YES (parallel with T6, T7)
  - **Parallel Group**: Wave 2 (with T6, T7)
  - **Blocks**: T10
  - **Blocked By**: T2 (seo.json), T4 (schema.jsonld), T5 (scaffold)

  **References**:

  **Pattern References**:
  - `client/first-client/content/seo.json` (from T2) — Meta title, description, OG config for layout.tsx
  - `client/first-client/content/schema.jsonld` (from T4) — Structured data to inject

  **API/Type References**:
  - `client/first-client/brief.json:30-38` — privacy_fields for privacy page content
  - `client/first-client/brief.json:23-29` — business_owner_info for privacy page contact

  **External References**:
  - next/og (Satori): https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image
  - next-sitemap: https://github.com/iamvishnusankar/next-sitemap
  - PIPA (개인정보보호법) guidelines for privacy policy pages

  **WHY Each Reference Matters**:
  - seo.json: Exact meta tag values for layout.tsx metadata export — title, description, OG
  - schema.jsonld: Must be injected verbatim as `<script type="application/ld+json">`
  - brief.json privacy_fields: Defines exactly which fields are collected, retention period — legal requirement
  - brief.json:38 third_party is empty but MUST be updated to mention Web3Forms

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Privacy page returns 200 and contains PIPA elements
    Tool: Bash (curl + grep)
    Preconditions: Dev server running
    Steps:
      1. Run: curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/privacy
      2. Assert: 200
      3. Run: curl -s http://localhost:3000/privacy | grep -c "개인정보"
      4. Assert: > 0
      5. Run: curl -s http://localhost:3000/privacy | grep -c "보관기간\|1년"
      6. Assert: > 0
      7. Run: curl -s http://localhost:3000/privacy | grep -ci "web3forms"
      8. Assert: > 0
    Expected Result: Privacy page accessible, contains PIPA-required elements and Web3Forms disclosure
    Failure Indicators: 404/500, missing privacy terms, no Web3Forms mention
    Evidence: .sisyphus/evidence/task-T8-privacy-page.txt

  Scenario: Thank-you page exists
    Tool: Bash (curl)
    Preconditions: Dev server running
    Steps:
      1. Run: curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/thank-you
      2. Assert: 200
    Expected Result: Thank-you page returns 200
    Failure Indicators: 404 or 500
    Evidence: .sisyphus/evidence/task-T8-thankyou-page.txt

  Scenario: OG image API route works
    Tool: Bash (curl)
    Preconditions: Dev server running
    Steps:
      1. Run: curl -s -o /dev/null -w "%{http_code}\n%{content_type}" http://localhost:3000/api/og
      2. Assert: HTTP 200 and content_type contains "image"
    Expected Result: OG image route returns an image
    Failure Indicators: 404/500, or content_type is not image
    Evidence: .sisyphus/evidence/task-T8-og-image.txt

  Scenario: Schema.jsonld present in page HTML
    Tool: Bash (curl + grep)
    Preconditions: Dev server running
    Steps:
      1. Run: curl -s http://localhost:3000 | grep -c "application/ld+json"
      2. Assert: > 0
    Expected Result: JSON-LD script tag present
    Failure Indicators: No ld+json script tag found
    Evidence: .sisyphus/evidence/task-T8-schema-injection.txt
  ```

  **Commit**: YES
  - Message: `feat(pages): add privacy, thank-you, 404, OG image, sitemap, schema.jsonld`
  - Files: `src/app/privacy/page.tsx`, `src/app/thank-you/page.tsx`, `src/app/not-found.tsx`, `src/app/api/og/route.tsx`, `src/app/layout.tsx`, `next-sitemap.config.js`
  - Pre-commit: `bun run build`

---

- [ ] T9. Wire Web3Forms + All CTAs

  **What to do**:
  - Create a contact form component or integrate into existing sections:
    - Form fields: 이름 (text), 전화번호 (tel), 이메일 (email), 요구사항 (textarea)
    - Hidden field: `access_key` from `process.env.NEXT_PUBLIC_WEB3FORMS_KEY`
    - Hidden field: `from_name`: "NDDT 랜딩페이지 문의"
    - Hidden field: `subject`: "새 상담 문의 | 옆집개발실"
    - Honeypot: `<input type="checkbox" name="botcheck" style="display:none">` for spam prevention
    - Consent checkbox: "개인정보 수집·이용에 동의합니다 (개인정보처리방침)" with link to /privacy — form MUST NOT submit without consent
    - On success: redirect to `/thank-you`
    - On error: inline error message "전송에 실패했습니다. 잠시 후 다시 시도해주세요."
  - Wire form into sections that have `form_submit` CTA: Hero, PainSolution, Pricing, FinalCTA
  - Phone CTA: `<a href="tel:010-8477-6339">` — show as text on desktop, prominent button on mobile
  - Email CTA: `<a href="mailto:qudtnrh@naver.com">` in footer and final_cta
  - Map CTA: `<a href="https://map.naver.com/v5/search/부산 부산진구 동천로 116" target="_blank" rel="noopener">` — URL-encode Korean address
  - Test form submission via curl to verify Web3Forms endpoint works

  **Must NOT do**:
  - NO hardcoded access_key in source — MUST use env var
  - NO form submission without consent checkbox checked
  - NO additional form fields beyond the 4 defined
  - NO client-side validation only — add basic HTML5 `required` attributes
  - NO redirect to external Web3Forms thank-you page — use our /thank-you

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Form integration with external API, CTA wiring across multiple sections
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Form UX design, consent checkbox UI, CTA button styling

  **Parallelization**:
  - **Can Run In Parallel**: NO (needs T6, T7 complete)
  - **Parallel Group**: Wave 3
  - **Blocks**: T10, T11
  - **Blocked By**: T6, T7

  **References**:

  **Pattern References**:
  - `docs/CTA-form/web3form-examples.md` — Web3Forms integration code examples
  - `docs/CTA-form/CTA-form.md:48-53` — Web3Forms implementation details

  **API/Type References**:
  - `client/first-client/brief.json:17-20` — business_phone, business_email, store_address for CTA links
  - `client/first-client/brief.json:71-74` — form_config with Web3Forms endpoint and access_key
  - Web3Forms API: `POST https://api.web3forms.com/submit` with `access_key`, `name`, `email`, `message`

  **External References**:
  - Web3Forms docs: https://web3forms.com/platforms/nextjs-contact-form
  - Naver Map search URL format: `https://map.naver.com/v5/search/{encoded_address}`

  **WHY Each Reference Matters**:
  - web3form-examples.md: Contains exact Next.js integration code patterns to follow
  - brief.json CTA data: Source of truth for phone number, email, and address
  - brief.json:31-35 privacy_fields: Defines form field set — consent checkbox text must match

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Web3Forms form submission works
    Tool: Bash (curl)
    Preconditions: Web3Forms access key is valid
    Steps:
      1. Run: curl -s -X POST https://api.web3forms.com/submit -H "Content-Type: application/json" -d '{"access_key":"6f575653-f96c-4e6d-9d08-5aff4818b955","name":"E2E 테스트","email":"test@example.com","phone":"010-0000-0000","message":"자동화 테스트 메시지","botcheck":""}' | jq '.success'
      2. Assert output: true
    Expected Result: Web3Forms returns success:true
    Failure Indicators: success:false or connection error
    Evidence: .sisyphus/evidence/task-T9-form-submit.txt

  Scenario: Phone CTA present in HTML
    Tool: Bash (curl + grep)
    Preconditions: Dev server running
    Steps:
      1. Run: curl -s http://localhost:3000 | grep -o 'href="tel:010-8477-6339"' | wc -l
      2. Assert: >= 1
    Expected Result: At least 1 phone CTA link in page
    Failure Indicators: Zero matches
    Evidence: .sisyphus/evidence/task-T9-phone-cta.txt

  Scenario: Email CTA present
    Tool: Bash (curl + grep)
    Preconditions: Dev server running
    Steps:
      1. Run: curl -s http://localhost:3000 | grep -o 'href="mailto:qudtnrh@naver.com"' | wc -l
      2. Assert: >= 1
    Expected Result: At least 1 email link in page
    Failure Indicators: Zero matches
    Evidence: .sisyphus/evidence/task-T9-email-cta.txt

  Scenario: Naver Map CTA present
    Tool: Bash (curl + grep)
    Preconditions: Dev server running
    Steps:
      1. Run: curl -s http://localhost:3000 | grep -c "map.naver.com"
      2. Assert: >= 1
    Expected Result: Naver map link present
    Failure Indicators: No map link found
    Evidence: .sisyphus/evidence/task-T9-map-cta.txt

  Scenario: Consent checkbox required before form submit
    Tool: Bash (curl + grep)
    Preconditions: Dev server running
    Steps:
      1. Run: curl -s http://localhost:3000 | grep -c "개인정보 수집"
      2. Assert: >= 1
      3. Run: curl -s http://localhost:3000 | grep -c "href=\"/privacy\""
      4. Assert: >= 1
    Expected Result: Consent text and privacy link present near form
    Failure Indicators: No consent checkbox or no privacy link
    Evidence: .sisyphus/evidence/task-T9-consent-checkbox.txt
  ```

  **Commit**: YES
  - Message: `feat(cta): wire Web3Forms contact form, phone/email/map CTAs with consent`
  - Files: relevant section files, form component/handler
  - Pre-commit: `bun run build`

---

- [ ] T10. Compliance Audit + Fix Consent + Footer Data

  **What to do**:
  - Review all compliance requirements against implemented code:
    - [ ] Privacy page mentions Web3Forms as third-party data processor
    - [ ] Form consent checkbox is `required` — form cannot submit without it
    - [ ] Footer contains all 사업자정보: 상호, 대표자, 주소, 연락처, 이메일
    - [ ] Footer links to /privacy page
    - [ ] No hardcoded secrets in source (grep for access_key value)
    - [ ] html lang="ko" set in layout
    - [ ] No 과장 광고 표현 in rendered content
  - Fix any issues found
  - Ensure `.env.local` is in `.gitignore`
  - Create `.env.example` with placeholder key for documentation

  **Must NOT do**:
  - Do NOT add cookie consent banner (no tracking cookies)
  - Do NOT modify business info — use exactly what's in brief.json

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Compliance verification across multiple files
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO (needs T8, T9 complete)
  - **Parallel Group**: Wave 3 (after T9)
  - **Blocks**: T11
  - **Blocked By**: T8, T9

  **References**:

  **Pattern References**:
  - `client/first-client/brief.json:23-38` — business_owner_info + privacy_fields
  - `client/first-client/brief.json:59-61` — constraints: 과장 광고 금지, 법률/개인정보 고지

  **WHY Each Reference Matters**:
  - brief.json constraints: These are the client's explicit legal requirements — must be verified

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: No hardcoded secrets in source
    Tool: Bash (grep)
    Preconditions: Source code exists
    Steps:
      1. Run: grep -r "6f575653-f96c-4e6d-9d08-5aff4818b955" src/ --include="*.tsx" --include="*.ts" | wc -l
      2. Assert: 0
      3. Run: grep -r "NEXT_PUBLIC_WEB3FORMS_KEY" src/ --include="*.tsx" --include="*.ts" | head -3
      4. Assert: uses process.env.NEXT_PUBLIC_WEB3FORMS_KEY (not raw key)
    Expected Result: Access key never appears in source code
    Failure Indicators: Raw key string found in source files
    Evidence: .sisyphus/evidence/task-T10-no-secrets.txt

  Scenario: .env.example exists with placeholder
    Tool: Bash
    Preconditions: Project root
    Steps:
      1. Run: cat .env.example | grep "WEB3FORMS"
      2. Assert: contains placeholder (not real key)
    Expected Result: .env.example documents required env vars
    Failure Indicators: Missing file or contains real key
    Evidence: .sisyphus/evidence/task-T10-env-example.txt
  ```

  **Commit**: YES
  - Message: `fix(compliance): audit PIPA consent, 사업자정보, secret management`
  - Files: modified compliance files, `.env.example`
  - Pre-commit: `bun run build`

---

- [ ] T11. QA Gate — Lighthouse + Link Check + Form E2E

  **What to do**:
  - Run Lighthouse on `http://localhost:3000` with headless Chrome:
    ```bash
    npx lighthouse http://localhost:3000 --output=json --output-path=.sisyphus/evidence/task-T11-lighthouse.json --chrome-flags="--headless --no-sandbox"
    ```
  - Parse results and verify thresholds:
    - Performance ≥ 0.85
    - SEO ≥ 0.90
    - Accessibility ≥ 0.85
  - Run link checker:
    ```bash
    npx linkinator http://localhost:3000 --recurse --format json > .sisyphus/evidence/task-T11-links.json
    ```
  - Verify all internal links resolve (no 404s)
  - Run form submission E2E test via curl (same as T9 scenario)
  - Check mobile responsiveness: verify viewport meta tag exists
  - If ANY threshold fails:
    1. Diagnose the specific issue from Lighthouse JSON
    2. Fix it (remove heavy JS, add alt texts, fix contrast, etc.)
    3. Re-run Lighthouse
    4. Repeat until all thresholds pass
  - Generate QA report: `client/first-client/reports/qa_report.json`

  **Must NOT do**:
  - Do NOT skip re-runs if thresholds fail — iterate until pass
  - Do NOT lower thresholds to pass
  - Do NOT send more than 2 form submissions (to avoid spamming client email)

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: Iterative debugging of Lighthouse failures requires deep analysis and multiple fix cycles
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Performance optimization, accessibility fixes, SEO improvements

  **Parallelization**:
  - **Can Run In Parallel**: NO (needs all prior tasks complete)
  - **Parallel Group**: Wave 3 (sequential, after T9 + T10)
  - **Blocks**: T12
  - **Blocked By**: T9, T10

  **References**:

  **Pattern References**:
  - `agentic-workflow.md:298-305` — QA Gate spec: Lighthouse thresholds, link check, E2E form test

  **External References**:
  - Lighthouse CLI: https://github.com/GoogleChrome/lighthouse
  - linkinator: https://github.com/JustinBeckwith/linkinator

  **WHY Each Reference Matters**:
  - agentic-workflow.md QA Gate: Defines exact pass/fail thresholds — these are non-negotiable

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Lighthouse scores meet thresholds
    Tool: Bash (npx lighthouse)
    Preconditions: Dev server running on localhost:3000
    Steps:
      1. Run: npx lighthouse http://localhost:3000 --output=json --chrome-flags="--headless --no-sandbox" 2>/dev/null | jq '{perf: .categories.performance.score, seo: .categories.seo.score, a11y: .categories.accessibility.score}'
      2. Assert: perf >= 0.85, seo >= 0.90, a11y >= 0.85
    Expected Result: All 3 scores above thresholds
    Failure Indicators: Any score below threshold
    Evidence: .sisyphus/evidence/task-T11-lighthouse.json

  Scenario: No broken links
    Tool: Bash (npx linkinator)
    Preconditions: Dev server running
    Steps:
      1. Run: npx linkinator http://localhost:3000 --recurse 2>&1 | tail -5
      2. Assert: "0 broken links" or equivalent pass message
    Expected Result: All internal links resolve
    Failure Indicators: Any broken links reported
    Evidence: .sisyphus/evidence/task-T11-links.txt

  Scenario: Viewport meta tag present
    Tool: Bash (curl + grep)
    Preconditions: Dev server running
    Steps:
      1. Run: curl -s http://localhost:3000 | grep -c "viewport"
      2. Assert: > 0
    Expected Result: Viewport meta tag for mobile responsiveness
    Failure Indicators: No viewport meta tag
    Evidence: .sisyphus/evidence/task-T11-viewport.txt
  ```

  **Commit**: YES
  - Message: `chore(qa): pass Lighthouse gate (perf≥85, seo≥90, a11y≥85) + link check`
  - Files: `client/first-client/reports/qa_report.json`, any performance fixes
  - Pre-commit: `bun run build`

---

- [ ] T12. Git Push to GitHub + Vercel Deploy

  **What to do**:
  - Ensure all changes are committed (all prior task commits)
  - Push to GitHub: `git push -u origin main`
  - Deploy to Vercel:
    - If `vercel` CLI is authenticated: `vercel --prod --yes`
    - If NOT authenticated: document in `.job-shadowing/` and provide manual instructions
  - Set Vercel environment variable: `NEXT_PUBLIC_WEB3FORMS_KEY` via `vercel env add`
  - Verify production URL responds: `curl -s -o /dev/null -w "%{http_code}" https://<project>.vercel.app`
  - Update `seo.json` canonical URL with actual vercel.app domain
  - Rebuild with updated canonical if changed

  **Must NOT do**:
  - Do NOT force push
  - Do NOT deploy without all QA gate passing (T11)
  - Do NOT expose .env.local in git

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Simple CLI operations — git push + vercel deploy
  - **Skills**: [`git-master`]
    - `git-master`: Git push, remote management

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 4 (sequential)
  - **Blocks**: T13, F1-F4
  - **Blocked By**: T11

  **References**:

  **Pattern References**:
  - `agentic-workflow.md:306-320` — Step 10 deploy spec: GitHub push, Vercel auto-deploy, deploy report

  **WHY Each Reference Matters**:
  - agentic-workflow.md Step 10: Defines exact deployment process and expected outputs

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: GitHub remote has latest code
    Tool: Bash (gh)
    Preconditions: All commits pushed
    Steps:
      1. Run: gh repo view eclipse1228/nddt-landing --json url | jq '.url'
      2. Assert: valid GitHub URL
      3. Run: git status
      4. Assert: "nothing to commit, working tree clean" or "Your branch is up to date"
    Expected Result: All code pushed to GitHub
    Failure Indicators: Unpushed commits or remote not found
    Evidence: .sisyphus/evidence/task-T12-github-push.txt

  Scenario: Vercel production URL responds 200
    Tool: Bash (curl)
    Preconditions: Vercel deploy completed
    Steps:
      1. Run: curl -s -o /dev/null -w "%{http_code}" https://nddt-landing.vercel.app (or actual URL)
      2. Assert: 200
      3. Run: curl -s https://nddt-landing.vercel.app | grep -c "옆집개발실"
      4. Assert: > 0
    Expected Result: Production site live and rendering Korean content
    Failure Indicators: Non-200 status or missing content
    Evidence: .sisyphus/evidence/task-T12-vercel-deploy.txt
  ```

  **Commit**: YES
  - Message: `chore(deploy): push to GitHub + deploy to Vercel production`
  - Files: any canonical URL updates
  - Pre-commit: `bun run build`

---

- [ ] T13. Generate deploy_report.json

  **What to do**:
  - Generate `client/first-client/reports/deploy_report.json`:
    ```json
    {
      "generated_at": "<ISO timestamp>",
      "client_id": "first-client",
      "project_name": "nddt-landing",
      "urls": {
        "production": "https://<actual>.vercel.app",
        "github": "https://github.com/eclipse1228/nddt-landing"
      },
      "reference_sites": [
        "https://www.refokus.com/",
        "https://superwhisper.com/"
      ],
      "cta_status": {
        "form_web3forms": "active",
        "phone": "active",
        "email": "active",
        "map_naver": "active",
        "kakao_chat": "not_configured",
        "calcom": "not_configured",
        "channeltalk": "not_configured"
      },
      "lighthouse": {
        "performance": <score>,
        "seo": <score>,
        "accessibility": <score>
      },
      "analytics": {
        "vercel_analytics": true,
        "vercel_speed_insights": true,
        "ga4": false,
        "pixel": false
      },
      "compliance": {
        "privacy_page": true,
        "pipa_consent": true,
        "cookie_consent": false,
        "business_info_footer": true
      },
      "pages": ["/", "/privacy", "/thank-you"],
      "tech_stack": {
        "framework": "Next.js 14",
        "styling": "Tailwind CSS",
        "hosting": "Vercel",
        "form_backend": "Web3Forms",
        "fonts": ["Pretendard", "SUIT Variable", "Noto Sans KR"]
      }
    }
    ```
  - Populate actual values from QA report and deployment

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Simple JSON file generation from existing data
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 4 (after T12)
  - **Blocks**: F1-F4
  - **Blocked By**: T12

  **References**:
  - `agentic-workflow.md:310-320` — Deploy report spec
  - `client/first-client/reports/qa_report.json` (from T11) — Lighthouse scores

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: deploy_report.json is valid and complete
    Tool: Bash (jq)
    Preconditions: T12 deploy completed
    Steps:
      1. Run: cat client/first-client/reports/deploy_report.json | jq '.urls.production'
      2. Assert: contains ".vercel.app"
      3. Run: cat client/first-client/reports/deploy_report.json | jq '.lighthouse.performance'
      4. Assert: >= 0.85
    Expected Result: Report contains real production URL and passing scores
    Failure Indicators: Missing fields, placeholder values
    Evidence: .sisyphus/evidence/task-T13-deploy-report.txt
  ```

  **Commit**: YES
  - Message: `docs(report): generate final deploy report for first-client`
  - Files: `client/first-client/reports/deploy_report.json`

---

## Final Verification Wave (MANDATORY — after ALL implementation tasks)

> 4 review agents run in PARALLEL. ALL must APPROVE. Rejection → fix → re-run.

- [ ] F1. **Plan Compliance Audit** — `oracle`
  Read the plan end-to-end. For each "Must Have": verify implementation exists (read file, curl endpoint, run command). For each "Must NOT Have": search codebase for forbidden patterns — reject with file:line if found. Check evidence files exist in .sisyphus/evidence/. Compare deliverables against plan.
  Output: `Must Have [N/N] | Must NOT Have [N/N] | Tasks [N/N] | VERDICT: APPROVE/REJECT`

- [ ] F2. **Code Quality Review** — `unspecified-high`
  Run `bun run build` + check for: `as any`/`@ts-ignore`, empty catches, console.log in prod, commented-out code, unused imports. Check AI slop: excessive comments, over-abstraction, generic variable names (data/result/item/temp). Verify each section is self-contained (no shared component directory).
  Output: `Build [PASS/FAIL] | Files [N clean/N issues] | VERDICT`

- [ ] F3. **Real Manual QA** — `unspecified-high` (+ `playwright` skill if needed)
  Start from clean state. Open production URL in browser. Execute EVERY QA scenario from tasks T6-T11 on the LIVE production site. Test cross-section navigation, form submission flow, mobile responsiveness (resize viewport), all CTA links. Save screenshots to `.sisyphus/evidence/final-qa/`.
  Output: `Scenarios [N/N pass] | Integration [N/N] | Edge Cases [N tested] | VERDICT`

- [ ] F4. **Scope Fidelity Check** — `deep`
  For each task: read "What to do", read actual diff (git log/diff). Verify 1:1 — everything in spec was built (no missing), nothing beyond spec was built (no creep). Check "Must NOT do" compliance. Detect cross-task contamination: Task N touching Task M's files. Flag unaccounted changes.
  Output: `Tasks [N/N compliant] | Contamination [CLEAN/N issues] | Unaccounted [CLEAN/N files] | VERDICT`

---

## Commit Strategy

| After Task | Message | Key Files | Verification |
|------------|---------|-----------|--------------|
| T0 | `fix(plan): remove kakao_chat from pricing CTA + setup GitHub remote` | page_plan.json | jq validate |
| T1 | `feat(content): generate Korean copy for 9 landing page sections` | copy.json | jq parse |
| T2+T3+T4 | `feat(content): generate SEO meta, FAQs, and schema.jsonld` | seo.json, faqs.json, schema.jsonld | jq parse |
| T5 | `feat(scaffold): initialize Next.js 14 with Tailwind, Korean fonts, theme` | package.json, next.config, layout.tsx | bun run build |
| T6 | `feat(sections): build Hero, ProofStrip, PainSolution, ServiceStack, Process` | 5 section files + page.tsx | bun run build |
| T7 | `feat(sections): build Pricing, FAQ, FinalCTA, Footer components` | 4 section files + page.tsx | bun run build |
| T8 | `feat(pages): add privacy, thank-you, 404, OG, sitemap, schema` | utility pages + config | bun run build |
| T9 | `feat(cta): wire Web3Forms form, phone/email/map CTAs with consent` | form handler + sections | bun run build |
| T10 | `fix(compliance): audit PIPA consent, 사업자정보, secret management` | compliance fixes + .env.example | bun run build |
| T11 | `chore(qa): pass Lighthouse gate + link check` | qa_report.json + fixes | lighthouse |
| T12 | `chore(deploy): push to GitHub + deploy to Vercel production` | canonical updates | curl production |
| T13 | `docs(report): generate final deploy report` | deploy_report.json | jq validate |

---

## Success Criteria

### Verification Commands
```bash
# Build passes
bun run build  # Expected: exit 0

# Dev server
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000  # Expected: 200

# Korean content
curl -s http://localhost:3000 | grep -c "옆집개발실"  # Expected: > 0

# Phone CTA
curl -s http://localhost:3000 | grep -c 'tel:010-8477-6339'  # Expected: >= 1

# Email CTA
curl -s http://localhost:3000 | grep -c 'mailto:qudtnrh@naver.com'  # Expected: >= 1

# Map link
curl -s http://localhost:3000 | grep -c 'map.naver.com'  # Expected: >= 1

# Privacy page
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/privacy  # Expected: 200

# Web3Forms
curl -s -X POST https://api.web3forms.com/submit -H "Content-Type: application/json" -d '{"access_key":"6f575653-f96c-4e6d-9d08-5aff4818b955","name":"Test","email":"test@test.com","message":"test"}' | jq '.success'  # Expected: true

# Lighthouse (after fixes)
npx lighthouse http://localhost:3000 --output=json --chrome-flags="--headless" | jq '.categories | {perf: .performance.score, seo: .seo.score, a11y: .accessibility.score}'
# Expected: perf >= 0.85, seo >= 0.90, a11y >= 0.85

# Production
curl -s -o /dev/null -w "%{http_code}" https://<project>.vercel.app  # Expected: 200
```

### Final Checklist
- [ ] All "Must Have" present
- [ ] All "Must NOT Have" absent
- [ ] Build passes
- [ ] Lighthouse thresholds met
- [ ] Production URL live
- [ ] deploy_report.json generated
- [ ] All evidence files in .sisyphus/evidence/

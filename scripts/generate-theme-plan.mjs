#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";

const rootDir = process.cwd();

const readJson = async (filePath) => {
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw);
};

const parseArgs = () => {
  const args = process.argv.slice(2);
  const parsed = { client: "" };

  for (let i = 0; i < args.length; i += 1) {
    if (args[i] === "--client" && args[i + 1]) {
      parsed.client = args[i + 1];
      i += 1;
    }
  }

  return parsed;
};

const loadUiPatterns = async (referenceRoot) => {
  const patterns = [];
  let siteDirs = [];

  try {
    siteDirs = await fs.readdir(referenceRoot, { withFileTypes: true });
  } catch {
    return patterns;
  }

  for (const entry of siteDirs) {
    if (!entry.isDirectory()) {
      continue;
    }

    const filePath = path.join(referenceRoot, entry.name, "ui_patterns.json");
    try {
      patterns.push(await readJson(filePath));
    } catch {
      continue;
    }
  }

  return patterns;
};

const buildTheme = (brief, patterns) => {
  const hosts = new Set(patterns.map((item) => item.site_key));
  const hasRefokus = hosts.has("refokus.com");
  const hasSuperwhisper = hosts.has("superwhisper.com");

  const colors = {
    primary: hasRefokus ? "#5B2EFF" : "#1E4DFF",
    accent: hasSuperwhisper ? "#FF6A00" : "#00BFA5",
    background: "#060915",
    surface: "#10172B",
    text_primary: "#F3F6FF",
    text_secondary: "#B6C0D8",
    border: "#29324A"
  };

  const typography = {
    heading_family: "Pretendard",
    body_family: "SUIT Variable",
    fallback_family: "Noto Sans KR",
    scale: {
      h1: "clamp(2.25rem, 4vw, 4rem)",
      h2: "clamp(1.75rem, 3vw, 3rem)",
      h3: "clamp(1.25rem, 2vw, 2rem)",
      body: "1rem",
      small: "0.875rem"
    }
  };

  const theme = {
    generated_at: new Date().toISOString(),
    client_id: brief.client_id || "first-client",
    tone: brief.brand_tone || "전문",
    personality: {
      mood: "high-contrast modern",
      energy: "high",
      target: "소상공인/스타트업 의사결정자",
      style_notes: [
        "네온 포인트 컬러를 과용하지 않고 핵심 CTA에 집중",
        "섹션 간 대비를 크게 두어 스크롤 집중도 강화",
        "모바일에서 터치 타겟 44px 이상 유지"
      ]
    },
    colors,
    typography,
    spacing: {
      base_unit: 4,
      section_gap_desktop: 112,
      section_gap_mobile: 72,
      radius: 14
    },
    motion: {
      page_intro: "fade-up-stagger",
      cta_hover: "lift-and-glow",
      duration_fast_ms: 180,
      duration_base_ms: 320,
      duration_slow_ms: 560
    },
    reference_signals: patterns.map((item) => ({
      source_url: item.source_url,
      visual_direction: item.visual_direction,
      interaction_focus: item.interaction_focus
    }))
  };

  return theme;
};

const buildTokensCss = (theme) => {
  const c = theme.colors;

  return [
    ":root {",
    `  --color-primary: ${c.primary};`,
    `  --color-accent: ${c.accent};`,
    `  --color-bg: ${c.background};`,
    `  --color-surface: ${c.surface};`,
    `  --color-text-primary: ${c.text_primary};`,
    `  --color-text-secondary: ${c.text_secondary};`,
    `  --color-border: ${c.border};`,
    "  --radius-base: 14px;",
    "  --space-unit: 4px;",
    "  --section-gap-desktop: 112px;",
    "  --section-gap-mobile: 72px;",
    "}",
    "",
    "body {",
    "  background: radial-gradient(120% 120% at 10% 0%, #111b36 0%, var(--color-bg) 55%, #03050c 100%);",
    "  color: var(--color-text-primary);",
    "  font-family: 'SUIT Variable', 'Noto Sans KR', system-ui, sans-serif;",
    "}",
    "",
    "h1, h2, h3, h4 {",
    "  font-family: 'Pretendard', 'Noto Sans KR', system-ui, sans-serif;",
    "  letter-spacing: -0.02em;",
    "}"
  ].join("\n");
};

const buildPagePlan = (brief) => {
  const primaryCta = brief.form_backend === "web3forms" ? "form_submit" : "consultation";

  return {
    generated_at: new Date().toISOString(),
    client_id: brief.client_id || "first-client",
    objective: "상담 전환 중심 원페이지",
    sections: [
      {
        id: "hero",
        order: 1,
        block_type: "hero_with_dual_cta",
        goal: "3초 내 가치 제안 전달",
        required_inputs: ["offer_summary", "target_audience", "primary_keyword"],
        cta: [primaryCta, "phone_call"]
      },
      {
        id: "proof_strip",
        order: 2,
        block_type: "trust_logo_and_metrics",
        goal: "신뢰 확보",
        required_inputs: ["proof_assets"],
        cta: []
      },
      {
        id: "pain_solution",
        order: 3,
        block_type: "problem_solution_cards",
        goal: "타겟 문제-해결 연결",
        required_inputs: ["target_audience", "offer_summary"],
        cta: ["form_submit"]
      },
      {
        id: "service_stack",
        order: 4,
        block_type: "service_feature_grid",
        goal: "서비스 범위 명확화",
        required_inputs: ["product_type"],
        cta: []
      },
      {
        id: "process",
        order: 5,
        block_type: "timeline_process",
        goal: "진행 방식 설명으로 불안 완화",
        required_inputs: ["offer_summary"],
        cta: []
      },
      {
        id: "pricing",
        order: 6,
        block_type: "pricing_teaser",
        goal: "문의 전 가격 기대치 형성",
        required_inputs: ["pricing"],
        cta: ["form_submit", "kakao_chat"]
      },
      {
        id: "faq",
        order: 7,
        block_type: "accordion_faq",
        goal: "구매 저항 해소",
        required_inputs: ["seo.primary_keyword"],
        cta: []
      },
      {
        id: "final_cta",
        order: 8,
        block_type: "cta_banner",
        goal: "최종 전환 유도",
        required_inputs: ["business_phone", "business_email", "store_address"],
        cta: ["form_submit", "phone_call", "map_directions"]
      },
      {
        id: "footer",
        order: 9,
        block_type: "legal_footer",
        goal: "사업자/개인정보 고지",
        required_inputs: ["business_owner_info", "privacy_fields"],
        cta: []
      }
    ]
  };
};

const buildComponentsMap = () => {
  return {
    generated_at: new Date().toISOString(),
    components: [
      { section_id: "hero", component: "AgencyHeroSection", source: "section-library/hero" },
      { section_id: "proof_strip", component: "TrustProofStrip", source: "section-library/proof" },
      { section_id: "pain_solution", component: "PainSolutionCards", source: "section-library/problem-solution" },
      { section_id: "service_stack", component: "ServiceFeatureGrid", source: "section-library/features" },
      { section_id: "process", component: "ProcessTimeline", source: "section-library/process" },
      { section_id: "pricing", component: "PricingTeaserCards", source: "section-library/pricing" },
      { section_id: "faq", component: "FaqAccordion", source: "section-library/faq" },
      { section_id: "final_cta", component: "FinalCtaBanner", source: "section-library/cta" },
      { section_id: "footer", component: "LegalFooter", source: "section-library/footer" }
    ]
  };
};

const main = async () => {
  const args = parseArgs();
  const rootBrief = await readJson(path.join(rootDir, "first-clientbrief.json"));
  const clientId = args.client || rootBrief.client_id || "first-client";

  const clientDir = path.join(rootDir, "client", clientId);
  const brief = await readJson(path.join(clientDir, "brief.json"));
  const referenceRoot = path.join(clientDir, "research", "reference");
  const patterns = await loadUiPatterns(referenceRoot);

  const theme = buildTheme(brief, patterns);
  const pagePlan = buildPagePlan(brief);
  const componentsMap = buildComponentsMap();
  const tokensCss = buildTokensCss(theme);

  await fs.mkdir(path.join(clientDir, "theme"), { recursive: true });
  await fs.mkdir(path.join(clientDir, "plan"), { recursive: true });
  await fs.mkdir(path.join(clientDir, "reports"), { recursive: true });

  await fs.writeFile(path.join(clientDir, "theme", "theme.json"), JSON.stringify(theme, null, 2) + "\n", "utf8");
  await fs.writeFile(path.join(clientDir, "theme", "tokens.css"), tokensCss + "\n", "utf8");
  await fs.writeFile(path.join(clientDir, "plan", "page_plan.json"), JSON.stringify(pagePlan, null, 2) + "\n", "utf8");
  await fs.writeFile(
    path.join(clientDir, "plan", "components_map.json"),
    JSON.stringify(componentsMap, null, 2) + "\n",
    "utf8"
  );

  const report = {
    generated_at: new Date().toISOString(),
    client_id: clientId,
    status: "completed",
    completed_steps: ["step3_brand_tokenizer", "step4_template_planning"],
    output_files: [
      `client/${clientId}/theme/theme.json`,
      `client/${clientId}/theme/tokens.css`,
      `client/${clientId}/plan/page_plan.json`,
      `client/${clientId}/plan/components_map.json`
    ]
  };

  await fs.writeFile(
    path.join(clientDir, "reports", "step3-4_report.json"),
    JSON.stringify(report, null, 2) + "\n",
    "utf8"
  );

  process.stdout.write(`Theme and plan generation completed for client: ${clientId}\n`);
};

main().catch((error) => {
  process.stderr.write(`generate-theme-plan failed: ${error.message}\n`);
  process.exitCode = 1;
});

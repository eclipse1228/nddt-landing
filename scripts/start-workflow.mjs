#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";

const rootDir = process.cwd();
const briefPath = path.join(rootDir, "first-clientbrief.json");
const captureDir = path.join(rootDir, "capture-images", "references-1");

const requiredFields = [
  "reference_urls",
  "reference_priority",
  "product_type",
  "offer_summary",
  "pricing",
  "target_audience",
  "business_phone",
  "business_email",
  "store_address",
  "form_backend",
  "business_owner_info",
  "privacy_fields",
  "seo",
  "tracking"
];

const hostnameToFolder = (url) => {
  try {
    const host = new URL(url).hostname;
    return host.replace(/^www\./, "").replace(/\./g, "-");
  } catch {
    return "unknown-site";
  }
};

const assertBrief = (brief) => {
  const missing = requiredFields.filter((field) => !(field in brief));
  if (missing.length > 0) {
    throw new Error(`Required fields missing: ${missing.join(", ")}`);
  }

  for (const field of ["offer_summary", "target_audience", "business_phone", "business_email"]) {
    const value = String(brief[field] ?? "").trim();
    if (!value) {
      throw new Error(`Field must not be empty: ${field}`);
    }
  }

  if (!Array.isArray(brief.reference_urls) || brief.reference_urls.length === 0) {
    throw new Error("reference_urls must be a non-empty array");
  }
};

const readCaptureIfExists = async (fileName) => {
  const filePath = path.join(captureDir, fileName);
  try {
    await fs.access(filePath);
    return path.relative(rootDir, filePath);
  } catch {
    return null;
  }
};

const detectPatterns = (url) => {
  if (url.includes("refokus.com")) {
    return {
      visual_direction: "Bold purple neon gradients with cinematic dark sections",
      interaction_focus: ["intro sound toggle", "menu overlays", "high-motion transitions"],
      section_hints: ["hero", "services", "case studies", "footer links"],
      notes: [
        "Hero uses strong contrast and large slogan",
        "Dynamic effects may need headed capture for full fidelity"
      ]
    };
  }

  if (url.includes("superwhisper.com")) {
    return {
      visual_direction: "Dark gradient product-marketing layout with dense feature storytelling",
      interaction_focus: ["theme switcher", "sticky nav", "interactive demo blocks"],
      section_hints: ["hero CTA", "social proof", "features", "pricing", "FAQ"],
      notes: [
        "Strong product-led messaging and multi-step demo sequence",
        "Long-form page keeps CTA repeated across sections"
      ]
    };
  }

  return {
    visual_direction: "Unknown",
    interaction_focus: [],
    section_hints: [],
    notes: []
  };
};

const getCaptureFallbacks = (host) => {
  const common = [
    {
      method: "segmented_scroll_capture",
      when_to_use: "fullPage image has large blank regions",
      summary: "Capture viewport screenshots while scrolling and stitch by y-offset"
    },
    {
      method: "network_idle_plus_warmup",
      when_to_use: "lazy assets or post-load animations are incomplete",
      summary: "Wait for network idle, then extra warm-up delay before screenshot"
    },
    {
      method: "dom_snapshot_first",
      when_to_use: "visual capture is unstable but structure is needed",
      summary: "Use accessibility/DOM snapshots as source of truth for section extraction"
    }
  ];

  if (host === "refokus.com") {
    return {
      capture_status: "degraded_headless_fullpage",
      recommended_mode: "headed_or_segmented",
      options: [
        {
          method: "headed_capture_gpu",
          when_to_use: "canvas or WebGL animation-heavy pages",
          summary: "Run headed browser with GPU to avoid blank frame layers"
        },
        {
          method: "pre_action_capture",
          when_to_use: "site has gate action like sound/menu toggle",
          summary: "Trigger interaction first, then capture full page"
        },
        ...common
      ]
    };
  }

  return {
    capture_status: "ok",
    recommended_mode: "headless_fullpage",
    options: common
  };
};

const main = async () => {
  const briefRaw = await fs.readFile(briefPath, "utf8");
  const brief = JSON.parse(briefRaw);
  assertBrief(brief);

  const clientId = brief.client_id || "first-client";
  const clientDir = path.join(rootDir, "client", clientId);
  const referenceRoot = path.join(clientDir, "research", "reference");

  await fs.mkdir(referenceRoot, { recursive: true });
  await fs.mkdir(path.join(clientDir, "theme"), { recursive: true });
  await fs.mkdir(path.join(clientDir, "plan"), { recursive: true });
  await fs.mkdir(path.join(clientDir, "content"), { recursive: true });
  await fs.mkdir(path.join(clientDir, "reports"), { recursive: true });

  await fs.writeFile(path.join(clientDir, "brief.json"), JSON.stringify(brief, null, 2) + "\n", "utf8");

  const captureMap = {
    "refokus.com": {
      fullpage: await readCaptureIfExists("refokus-fullpage-refresh.png"),
      fullpage_sound_on: await readCaptureIfExists("refokus-fullpage-sound-on.png"),
      a11y_snapshot: await readCaptureIfExists("refokus-a11y-snapshot.md"),
      console_log: await readCaptureIfExists("refokus-console.log")
    },
    "superwhisper.com": {
      fullpage: await readCaptureIfExists("superwhisper-fullpage.png"),
      a11y_snapshot: await readCaptureIfExists("superwhisper-a11y-snapshot.md"),
      console_log: await readCaptureIfExists("superwhisper-console.log")
    }
  };

  for (const url of brief.reference_urls) {
    const folder = hostnameToFolder(url);
    const siteDir = path.join(referenceRoot, folder);
    await fs.mkdir(siteDir, { recursive: true });

    const host = new URL(url).hostname.replace(/^www\./, "");
    const domSummary = {
      source_url: url,
      captured_at: new Date().toISOString(),
      hints: {
        hero: true,
        social_proof: host === "superwhisper.com",
        feature_sections: true,
        pricing: host === "superwhisper.com"
      },
      artifacts: captureMap[host] || {},
      capture_fallbacks: getCaptureFallbacks(host)
    };

    const uiPatterns = {
      source_url: url,
      site_key: host,
      ...detectPatterns(url)
    };

    await fs.writeFile(path.join(siteDir, "dom.json"), JSON.stringify(domSummary, null, 2) + "\n", "utf8");
    await fs.writeFile(path.join(siteDir, "ui_patterns.json"), JSON.stringify(uiPatterns, null, 2) + "\n", "utf8");
  }

  const kickoffReport = {
    started_at: new Date().toISOString(),
    client_id: clientId,
    status: "started",
    completed_steps: ["step1_input_validation", "step2_reference_capture_initial"],
    next_steps: ["step3_brand_tokenizer", "step4_template_planning", "step5_copy_seo_generation"]
  };

  await fs.writeFile(
    path.join(clientDir, "reports", "kickoff_report.json"),
    JSON.stringify(kickoffReport, null, 2) + "\n",
    "utf8"
  );

  process.stdout.write(`Workflow kickoff completed for client: ${clientId}\n`);
};

main().catch((error) => {
  process.stderr.write(`start-workflow failed: ${error.message}\n`);
  process.exitCode = 1;
});

#!/usr/bin/env node
import { promises as fs } from "fs";
import path from "path";
import { blocks } from "../registry/registry-blocks";

const OUTPUT_PATH = path.join(process.cwd(), "apps/nextjs/public/r/styles/new-york");

async function captureScreenshots() {
  console.log("📸 Capturing block screenshots...");
  console.log("⚠️  Note: This is a placeholder script.");
  console.log(
    "   For production, integrate with Playwright or Puppeteer for automated screenshots.",
  );

  // Ensure output directory exists
  await fs.mkdir(OUTPUT_PATH, { recursive: true });

  // Create placeholder for each block
  for (const block of blocks) {
    console.log(`📷 Block: ${block.name}`);
    console.log(`   - Light mode: ${OUTPUT_PATH}/${block.name}.png`);
    console.log(`   - Dark mode: ${OUTPUT_PATH}/${block.name}-dark.png`);
    console.log(`   📝 Visit: http://localhost:3000/view/styles/new-york/${block.name}`);
  }

  console.log("\n✨ Screenshot capture instructions:");
  console.log("1. Start your dev server: npm run dev");
  console.log("2. Visit each block's preview URL above");
  console.log("3. Take screenshots manually or use Playwright");
  console.log(`4. Save them to: ${OUTPUT_PATH}/`);
}

captureScreenshots().catch((error) => {
  console.error("❌ Capture failed:", error);
  process.exit(1);
});

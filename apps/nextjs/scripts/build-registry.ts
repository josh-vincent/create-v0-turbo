#!/usr/bin/env node
import { promises as fs, existsSync } from "fs";
import path from "path";
import { blocks } from "../registry/registry-blocks";
import { registryCategories } from "../registry/registry-categories";

const REGISTRY_PATH = path.join(process.cwd(), "apps/nextjs/registry");
const OUTPUT_PATH = path.join(process.cwd(), "apps/nextjs/public/r");

interface RegistryItem {
  name: string;
  type: string;
  files: Array<{
    path: string;
    type: string;
    content?: string;
    target?: string;
  }>;
  dependencies?: string[];
  devDependencies?: string[];
  registryDependencies?: string[];
  categories?: string[];
}

async function buildRegistry() {
  console.log("🔨 Building blocks registry...");

  // Ensure output directory exists
  await fs.mkdir(OUTPUT_PATH, { recursive: true });
  await fs.mkdir(path.join(OUTPUT_PATH, "styles"), { recursive: true });
  await fs.mkdir(path.join(OUTPUT_PATH, "styles/new-york"), { recursive: true });

  const registryItems: RegistryItem[] = [];

  // Process each block
  for (const block of blocks) {
    console.log(`📦 Processing block: ${block.name}`);

    const item: RegistryItem = {
      name: block.name,
      type: block.type,
      files: [],
      dependencies: block.dependencies,
      devDependencies: block.devDependencies,
      registryDependencies: block.registryDependencies,
      categories: block.categories,
    };

    // Read and process each file
    for (const file of block.files) {
      const filePath = path.join(REGISTRY_PATH, "new-york", file.path);

      if (!existsSync(filePath)) {
        console.warn(`⚠️  File not found: ${filePath}`);
        continue;
      }

      const content = await fs.readFile(filePath, "utf-8");

      item.files.push({
        path: file.path,
        type: file.type,
        content,
        target: file.target,
      });
    }

    registryItems.push(item);

    // Write individual block file
    const blockOutputPath = path.join(OUTPUT_PATH, "styles/new-york", `${block.name}.json`);
    await fs.writeFile(blockOutputPath, JSON.stringify(item, null, 2));
    console.log(`✅ Built: ${block.name}`);
  }

  // Write index file
  const indexPath = path.join(OUTPUT_PATH, "index.json");
  await fs.writeFile(
    indexPath,
    JSON.stringify(
      {
        blocks: registryItems.map((item) => ({
          name: item.name,
          type: item.type,
          categories: item.categories,
        })),
        categories: registryCategories,
      },
      null,
      2,
    ),
  );

  console.log(`\n✨ Registry built successfully!`);
  console.log(`📁 Output: ${OUTPUT_PATH}`);
  console.log(`📊 Total blocks: ${registryItems.length}`);
}

buildRegistry().catch((error) => {
  console.error("❌ Build failed:", error);
  process.exit(1);
});

/**
 * Init command - Initialize component configuration
 */

import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import chalk from "chalk";
import ora from "ora";
import prompts from "prompts";

interface InitOptions {
  yes?: boolean;
}

export async function init(options: InitOptions) {
  console.log(chalk.bold("\n🚀 Initialize TOCLD UI components\n"));

  let targetPath = "src/components";
  let framework: "nextjs" | "expo" | "both" = "both";

  if (!options.yes) {
    const answers = await prompts([
      {
        type: "select",
        name: "framework",
        message: "Which framework are you using?",
        choices: [
          { title: "Both (Next.js + Expo)", value: "both" },
          { title: "Next.js only", value: "nextjs" },
          { title: "Expo only", value: "expo" },
        ],
        initial: 0,
      },
      {
        type: "text",
        name: "targetPath",
        message: "Where should components be installed?",
        initial: "src/components",
      },
    ]);

    if (!answers.framework || !answers.targetPath) {
      console.log(chalk.yellow("\n⚠ Initialization cancelled"));
      process.exit(0);
    }

    targetPath = answers.targetPath;
    framework = answers.framework;
  }

  const spinner = ora("Creating configuration...").start();

  try {
    // Create components.json config
    const config = {
      $schema: "https://ui.tocld.com/schema.json",
      style: "new-york",
      rsc: framework === "nextjs" || framework === "both",
      tsx: true,
      framework,
      tailwind: {
        config: "tailwind.config.ts",
        css: "src/app/globals.css",
        baseColor: "zinc",
        cssVariables: true,
      },
      aliases: {
        components: targetPath,
        utils: "@tocld/ui",
        ui: "@tocld/ui",
        primitives: "@tocld/ui/primitives",
      },
    };

    await writeFile(resolve(process.cwd(), "components.json"), JSON.stringify(config, null, 2));

    // Ensure target directory exists
    await mkdir(resolve(process.cwd(), targetPath), { recursive: true });

    spinner.succeed(chalk.green("Configuration created successfully!"));

    console.log(chalk.dim(`\n✓ Configuration saved to ${chalk.white("components.json")}`));
    console.log(chalk.dim(`✓ Components will be installed to ${chalk.white(targetPath)}`));
    console.log(
      chalk.dim(`\n💡 Run ${chalk.white("bun tocld add button")} to add your first component\n`),
    );
  } catch (error) {
    spinner.fail(chalk.red("Failed to create configuration"));
    console.error(error);
    process.exit(1);
  }
}

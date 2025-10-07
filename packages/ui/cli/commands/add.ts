/**
 * Add command - Add components to your project
 */

import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import chalk from "chalk";
import ora from "ora";
import prompts from "prompts";
import type { RegistryEntry } from "../../registry/schema";

interface AddOptions {
  all?: boolean;
  overwrite?: boolean;
  path?: string;
}

export async function add(components: string[], options: AddOptions) {
  // Load config
  const configPath = resolve(process.cwd(), "components.json");
  if (!existsSync(configPath)) {
    console.error(chalk.red("\n❌ components.json not found. Run `bun tocld init` first.\n"));
    process.exit(1);
  }

  const config = JSON.parse(await readFile(configPath, "utf-8"));
  const targetPath = config.aliases?.components || "src/components";

  // Load registry
  const registryPath = resolve(__dirname, "../../registry/registry.json");
  const registry = JSON.parse(await readFile(registryPath, "utf-8"));

  // Determine which components to install
  let componentsToInstall = components;

  if (options.all) {
    componentsToInstall = registry.items;
  } else if (components.length === 0) {
    const { selectedComponents } = await prompts({
      type: "multiselect",
      name: "selectedComponents",
      message: "Select components to install",
      choices: registry.items.map((name: string) => ({
        title: name,
        value: name,
      })),
    });

    if (!selectedComponents || selectedComponents.length === 0) {
      console.log(chalk.yellow("\n⚠ No components selected\n"));
      process.exit(0);
    }

    componentsToInstall = selectedComponents;
  }

  // Install each component
  for (const componentName of componentsToInstall) {
    const spinner = ora(`Installing ${componentName}...`).start();

    try {
      // Load component definition
      const componentPath = resolve(__dirname, `../../registry/components/${componentName}.json`);
      const componentDef: RegistryEntry = JSON.parse(await readFile(componentPath, "utf-8"));

      // Install dependencies if needed
      if (componentDef.dependencies?.length) {
        spinner.text = `Installing dependencies for ${componentName}...`;
        // Dependencies are already in the monorepo
      }

      // Copy files
      for (const file of componentDef.files) {
        const sourcePath = resolve(__dirname, "../../", file.path);
        const targetFilePath = resolve(
          process.cwd(),
          targetPath,
          file.path.replace("src/components/", ""),
        );

        // Check if file exists
        if (existsSync(targetFilePath) && !options.overwrite) {
          spinner.warn(
            chalk.yellow(
              `${componentName}: ${file.path.split("/").pop()} already exists (use --overwrite to replace)`,
            ),
          );
          continue;
        }

        // Ensure directory exists
        await mkdir(dirname(targetFilePath), { recursive: true });

        // Copy file
        const content = await readFile(sourcePath, "utf-8");
        await writeFile(targetFilePath, content);
      }

      spinner.succeed(chalk.green(`Installed ${componentName}`));
    } catch (error) {
      spinner.fail(chalk.red(`Failed to install ${componentName}`));
      console.error(error);
    }
  }

  console.log(chalk.dim("\n✨ Done!\n"));
}

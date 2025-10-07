/**
 * List command - Show all available components
 */

import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import chalk from "chalk";
import type { Registry } from "../../registry/schema";

export async function list() {
  try {
    const registryPath = resolve(__dirname, "../../registry/registry.json");
    const registryContent = await readFile(registryPath, "utf-8");
    const registry: Registry = JSON.parse(registryContent);

    console.log(chalk.bold("\n📦 Available Components:\n"));

    for (const componentName of registry.items) {
      const componentPath = resolve(__dirname, `../../registry/components/${componentName}.json`);
      try {
        const componentContent = await readFile(componentPath, "utf-8");
        const component = JSON.parse(componentContent);

        console.log(
          `${chalk.green("●")} ${chalk.bold(component.name)}${
            component.description ? ` - ${chalk.dim(component.description)}` : ""
          }`,
        );
      } catch (error) {
        console.log(`${chalk.yellow("○")} ${chalk.bold(componentName)}`);
      }
    }

    console.log(chalk.dim(`\n💡 Use ${chalk.white("bun tocld add <component>")} to install\n`));
  } catch (error) {
    console.error(chalk.red("Failed to load registry:"), error);
    process.exit(1);
  }
}

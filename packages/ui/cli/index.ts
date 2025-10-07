#!/usr/bin/env node

/**
 * TOCLD UI CLI
 * Component registry CLI inspired by shadcn/ui
 */

import { Command } from "commander";
import { add } from "./commands/add";
import { init } from "./commands/init";
import { list } from "./commands/list";

const program = new Command();

program.name("tocld").description("Universal component CLI for Next.js and Expo").version("0.1.0");

program
  .command("add")
  .description("Add a component to your project")
  .argument("[components...]", "Components to add")
  .option("-a, --all", "Add all components")
  .option("-o, --overwrite", "Overwrite existing files")
  .option("-p, --path <path>", "Custom path for components")
  .action(add);

program
  .command("init")
  .description("Initialize component configuration")
  .option("-y, --yes", "Skip prompts and use defaults")
  .action(init);

program.command("list").description("List all available components").action(list);

program.parse();

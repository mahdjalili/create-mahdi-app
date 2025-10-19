#!/usr/bin/env node

import chalk from "chalk";
import ora from "ora";
import { runPrompts } from "./prompts";
import {
    validateProjectName,
    checkDirectoryExists,
    copyTemplate,
    updatePackageJson,
    installDependencies,
    getTemplatePath,
    getProjectPath,
    showSuccessMessage,
} from "./utils";

async function main() {
    try {
        // Parse command line arguments
        const args = process.argv.slice(2);
        const providedName = args[0];

        // Validate provided name if given
        if (providedName && !validateProjectName(providedName)) {
            console.log(
                chalk.red(
                    "Invalid project name. Project name must be lowercase, alphanumeric, and may contain hyphens and underscores."
                )
            );
            process.exit(1);
        }

        // Run interactive prompts
        const answers = await runPrompts(providedName);

        if (!answers.confirm) {
            console.log(chalk.yellow("Project creation cancelled."));
            process.exit(0);
        }

        const { projectName, template } = answers;
        const projectPath = getProjectPath(projectName);

        // Check if directory already exists
        if (checkDirectoryExists(projectPath)) {
            console.log(chalk.red(`Directory "${projectName}" already exists. Please choose a different name.`));
            process.exit(1);
        }

        // Start the creation process
        const spinner = ora("Creating project...").start();

        try {
            // Copy template
            spinner.text = "Copying template files...";
            const templatePath = getTemplatePath(template);
            await copyTemplate(templatePath, projectPath);

            // Update package.json with project name
            spinner.text = "Updating project configuration...";
            await updatePackageJson(projectPath, projectName);

            // Install dependencies
            spinner.stop();
            await installDependencies(projectPath);

            // Show success message
            showSuccessMessage(projectName, projectPath, template);
        } catch (error) {
            spinner.fail("Failed to create project");
            console.log(chalk.red(`Error: ${error instanceof Error ? error.message : error}`));
            process.exit(1);
        }
    } catch (error) {
        console.log(chalk.red(`Unexpected error: ${error instanceof Error ? error.message : error}`));
        process.exit(1);
    }
}

// Handle process termination
process.on("SIGINT", () => {
    console.log(chalk.yellow("\n\nProject creation cancelled."));
    process.exit(0);
});

process.on("SIGTERM", () => {
    console.log(chalk.yellow("\n\nProject creation cancelled."));
    process.exit(0);
});

// Run the main function
main().catch((error) => {
    console.log(chalk.red(`Fatal error: ${error instanceof Error ? error.message : error}`));
    process.exit(1);
});

import * as fs from "fs-extra";
import * as path from "path";
import { spawn } from "child_process";
import chalk from "chalk";

export interface ProjectConfig {
    name: string;
    template: string;
    targetDir: string;
}

export function validateProjectName(name: string): boolean {
    // Check if name is valid for npm package
    const npmNameRegex = /^[a-z0-9][a-z0-9\-_]*[a-z0-9]$/;
    return npmNameRegex.test(name) && name.length > 0;
}

export function checkDirectoryExists(dirPath: string): boolean {
    return fs.existsSync(dirPath);
}

export async function copyTemplate(templatePath: string, targetPath: string): Promise<void> {
    try {
        await fs.copy(templatePath, targetPath);
    } catch (error) {
        throw new Error(`Failed to copy template: ${error}`);
    }
}

export async function updatePackageJson(projectPath: string, projectName: string): Promise<void> {
    const packageJsonPath = path.join(projectPath, "package.json");

    try {
        const packageJson = await fs.readJson(packageJsonPath);
        packageJson.name = projectName;
        await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
    } catch (error) {
        throw new Error(`Failed to update package.json: ${error}`);
    }
}

export async function installDependencies(projectPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
        console.log(chalk.blue("Installing dependencies with Bun..."));

        const bun = spawn("bun", ["install"], {
            cwd: projectPath,
            stdio: "inherit",
            shell: true,
        });

        bun.on("close", (code) => {
            if (code === 0) {
                console.log(chalk.green("✓ Dependencies installed successfully"));
                resolve();
            } else {
                reject(new Error(`Bun install failed with code ${code}`));
            }
        });

        bun.on("error", (error) => {
            reject(new Error(`Failed to run bun install: ${error.message}`));
        });
    });
}

export function getTemplatePath(template: string): string {
    // In development, templates are in src/templates
    // In production (compiled), templates are copied to dist/templates
    const templateDir = path.join(__dirname, "templates", template);

    // Check if the template exists in the expected location
    if (fs.existsSync(templateDir)) {
        return templateDir;
    }

    // Fallback: look in src/templates (for development)
    const devTemplateDir = path.join(__dirname, "..", "src", "templates", template);
    if (fs.existsSync(devTemplateDir)) {
        return devTemplateDir;
    }

    throw new Error(`Template "${template}" not found`);
}

export function getProjectPath(projectName: string, cwd: string = process.cwd()): string {
    return path.join(cwd, projectName);
}

export function showSuccessMessage(projectName: string, projectPath: string): void {
    console.log(chalk.green("\n✓ Project created successfully!"));
    console.log(chalk.cyan("\nNext steps:"));
    console.log(chalk.white(`  cd ${projectName}`));
    console.log(chalk.white("  bun dev"));
    console.log(chalk.gray("\nHappy coding! 🚀"));
}

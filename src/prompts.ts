import prompts from "prompts";
import chalk from "chalk";
import { validateProjectName } from "./utils";

export interface PromptAnswers {
    projectName: string;
    template: string;
    confirm: boolean;
}

export async function getProjectName(): Promise<string> {
    const response = await prompts({
        type: "text",
        name: "projectName",
        message: "What is your project name?",
        validate: (value: string) => {
            if (!value.trim()) {
                return "Project name is required";
            }
            if (!validateProjectName(value)) {
                return "Project name must be lowercase, alphanumeric, and may contain hyphens and underscores";
            }
            return true;
        },
    });

    if (!response.projectName) {
        console.log(chalk.red("Project creation cancelled."));
        process.exit(0);
    }

    return response.projectName;
}

export async function selectTemplate(): Promise<string> {
    const response = await prompts({
        type: "select",
        name: "template",
        message: "Choose a template:",
        choices: [
            {
                title: "Frontend - Next.js",
                description: "Next.js with React, Material-UI, React Query, Formik, Yup, nuqs, Zustand, Axios",
                value: "frontend",
            },
        ],
        initial: 0,
    });

    if (!response.template) {
        console.log(chalk.red("Template selection cancelled."));
        process.exit(0);
    }

    return response.template;
}

export async function confirmCreation(projectName: string, template: string): Promise<boolean> {
    const response = await prompts({
        type: "confirm",
        name: "confirm",
        message: `Create project "${projectName}" with ${template} template?`,
        initial: true,
    });

    return response.confirm;
}

export async function runPrompts(providedName?: string): Promise<PromptAnswers> {
    console.log(chalk.cyan("Welcome to create-mahdi-app! 🚀"));
    console.log(chalk.gray("This will create a new Next.js project with your preferred tech stack.\n"));

    const projectName = providedName || (await getProjectName());
    const template = await selectTemplate();
    const confirm = await confirmCreation(projectName, template);

    return {
        projectName,
        template,
        confirm,
    };
}

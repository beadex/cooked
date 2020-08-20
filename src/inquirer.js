#!/usr/bin/env node

const path = require("path");
const inquirer = require("inquirer");
const fs = require("fs");
const CURR_DIR = process.cwd();
const chalk = require("chalk");
const shell = require("shelljs");
const { render } = require("./templates");
const yargs = require("yargs");

const CHOICES = fs.readdirSync(path.join(__dirname, "../templates"));
const QUESTIONS = [
    {
        name: "template",
        type: "list",
        message: "What project template would you like to generate?",
        choices: CHOICES,
        when: () => !yargs.argv["template"],
    },
    {
        name: "name",
        type: "input",
        message: "Project name:",
        when: () => !yargs.argv["name"],
        validate: (input) => {
            if (/^([A-Za-z\-\_\d])+$/.test(input)) return true;
            else return "Project name may only include letters, numbers, underscores and hashes.";
        },
    },
    {
        name: "description",
        type: "input",
        message: "Description:",
        when: () => !yargs.argv["description"],
    },
    {
        name: "author",
        type: "input",
        message: "Author:",
        when: () => !yargs.argv["author"],
    },
];

inquirer.prompt(QUESTIONS).then((answers) => {
    answers = Object.assign({}, answers, yargs.argv);
    const projectChoice = answers["template"];
    const projectName = answers["name"];
    const projectDescription = answers["description"];
    const projectAuthor = answers["author"];
    const templatePath = path.join(__dirname, "../templates", projectChoice);
    const tartgetPath = path.join(CURR_DIR, projectName);
    const templateConfig = getTemplateConfig(templatePath);
    const options = {
        projectName,
        templateName: projectChoice,
        templatePath,
        tartgetPath,
        config: templateConfig,
    };
    if (!createProject(tartgetPath)) {
        return;
    }
    console.log(chalk.blue("Generating project template..."));
    createDirectoryContents(templatePath, projectName, projectDescription, projectAuthor, templateConfig);
    console.log(chalk.green("Done."));
    if (!postProcess(options)) {
        return;
    }
    showMessage(options);
});
function showMessage(options) {
    console.log("");
    console.log(chalk.green("Done."));
    console.log(chalk.green(`Go into the project: cd ${options.projectName}`));
    const message = options.config.postMessage;
    if (message) {
        console.log("");
        console.log(chalk.yellow(message));
        console.log("");
    }
}
function getTemplateConfig(templatePath) {
    const configPath = path.join(templatePath, ".template.json");
    if (!fs.existsSync(configPath)) return {};
    const templateConfigContent = fs.readFileSync(configPath);
    if (templateConfigContent) {
        return JSON.parse(templateConfigContent.toString());
    }
    return {};
}
function createProject(projectPath) {
    if (fs.existsSync(projectPath)) {
        console.log(chalk.red(`Folder ${projectPath} exists. Delete or use another name.`));
        return false;
    }
    fs.mkdirSync(projectPath);
    return true;
}
function postProcess(options) {
    if (isNode(options)) {
        return postProcessNode(options);
    }
    return true;
}
function isNode(options) {
    return fs.existsSync(path.join(options.templatePath, "package.json"));
}
function postProcessNode(options) {
    console.log(chalk.blue("Installing dependencies..."));
    shell.cd(options.tartgetPath);
    let cmd = "";
    if (shell.which("yarn")) {
        cmd = "yarn";
    } else if (shell.which("npm")) {
        cmd = "npm install";
    }
    if (cmd) {
        const result = shell.exec(cmd);
        if (result.code !== 0) {
            return false;
        }
    } else {
        console.log(chalk.red("No yarn or npm found. Cannot run installation."));
    }
    return true;
}
const SKIP_FILES = ["node_modules", ".template.json"];
function createDirectoryContents(templatePath, projectName, projectDescription, projectAuthor, config) {
    const filesToCreate = fs.readdirSync(templatePath);
    filesToCreate.forEach((file) => {
        const origFilePath = path.join(templatePath, file);
        // get stats about the current file
        const stats = fs.statSync(origFilePath);
        if (SKIP_FILES.indexOf(file) > -1) return;
        if (stats.isFile()) {
            let contents = fs.readFileSync(origFilePath, "utf8");
            contents = render(contents, { projectName, projectDescription, projectAuthor });
            const writePath = path.join(CURR_DIR, projectName, file);
            fs.writeFileSync(writePath, contents, "utf8");
        } else if (stats.isDirectory()) {
            fs.mkdirSync(path.join(CURR_DIR, projectName, file));
            // recursive call
            createDirectoryContents(path.join(templatePath, file), path.join(projectName, file), config);
        }
    });
}

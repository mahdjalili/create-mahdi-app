#!/usr/bin/env node

const { spawn } = require("child_process");
const path = require("path");

// Get the path to the compiled JavaScript file
const distPath = path.join(__dirname, "..", "dist", "index.js");

// Spawn the compiled TypeScript file
const child = spawn("node", [distPath, ...process.argv.slice(2)], {
    stdio: "inherit",
    cwd: process.cwd(),
});

child.on("close", (code) => {
    process.exit(code);
});

child.on("error", (err) => {
    console.error("Error running create-mahdi-app:", err);
    process.exit(1);
});

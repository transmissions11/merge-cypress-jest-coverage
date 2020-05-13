#!/usr/bin/env node

const { execSync } = require("child_process");
const chalk = require("chalk");

function runCommand(command, log = true) {
  const output = execSync(command).toString();

  if (log) {
    console.log(output);
  }
}

console.log(chalk.cyan("Merging reports from Cypress & Jest...."));

try {
  // Make a reports directory
  runCommand("mkdir reports", false);
} catch {
  console.log(chalk.yellow("reports/ already exists!"));
}

try {
  // Make .nyc_output directory
  runCommand("mkdir .nyc_output", false);
} catch {
  console.log(chalk.yellow(".nyc_output/ already exists!"));
}

// Copy coverage reports
runCommand("cp cypress-coverage/coverage-final.json reports/from-cypress.json");
runCommand("cp jest-coverage/coverage-final.json reports/from-jest.json");

// Merge the reports folder's json
runCommand("npx nyc merge reports");

// Move merged coverage.json to .nyc_output
runCommand("mv coverage.json .nyc_output/out.json");

// Create lcov report and output to coverage directory
runCommand(
  "npx nyc report --reporter lcov --reporter text --report-dir coverage"
);

console.log();

console.log(
  chalk.green.bold("Merged your Cypress & Jest reports successfully!")
);

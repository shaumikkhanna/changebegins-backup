#!/usr/bin/env node

const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

function usage() {
	process.stderr.write(`Usage:
  node tools/logical-generate-prompt-bundle.js [--context non-engineering] [--out prompts.json] [--spec llm-ready-logical-template-contracts.md] [--no-rejections] [--rejections generated_questions/rejections]

Builds one JSON object where each key is a logical template ID and each value is
the compact generation prompt for exactly 1 question.

Examples:
  node tools/logical-generate-prompt-bundle.js --out /tmp/logical-prompts.json
  node tools/logical-generate-prompt-bundle.js --context engineering --no-rejections
`);
}

function parseArgs(argv) {
	const args = { _: [] };
	for (let i = 0; i < argv.length; i += 1) {
		const token = argv[i];
		if (!token.startsWith("--")) {
			args._.push(token);
			continue;
		}

		const key = token.slice(2);
		const next = argv[i + 1];
		if (!next || next.startsWith("--")) {
			args[key] = true;
			continue;
		}

		args[key] = next;
		i += 1;
	}
	return args;
}

function runNode(scriptPath, scriptArgs) {
	const result = spawnSync(process.execPath, [scriptPath, ...scriptArgs], {
		encoding: "utf8",
	});

	if (result.status !== 0) {
		const message = result.stderr || result.stdout || "Unknown command failure";
		throw new Error(message.trim());
	}

	return result.stdout;
}

function listTemplateIds(harnessPath, args) {
	const listArgs = ["list"];
	if (args.spec) {
		listArgs.push("--spec", args.spec);
	}

	const output = runNode(harnessPath, listArgs);
	const templates = JSON.parse(output);
	return templates.map((template) => template.templateId);
}

function buildPromptForTemplate(generatorPath, templateId, args) {
	const generatorArgs = [
		templateId,
		"--count",
		"1",
		"--context",
		args.context || "non-engineering",
	];

	if (args.spec) {
		generatorArgs.push("--spec", args.spec);
	}
	if (args["no-rejections"]) {
		generatorArgs.push("--no-rejections");
	}
	if (args.rejections) {
		generatorArgs.push("--rejections", args.rejections);
	}

	return runNode(generatorPath, generatorArgs);
}

function writeOrPrint(value, outPath) {
	const serialized = `${JSON.stringify(value, null, 2)}\n`;
	if (outPath) {
		fs.writeFileSync(path.resolve(outPath), serialized);
		return;
	}
	process.stdout.write(serialized);
}

function main() {
	const args = parseArgs(process.argv.slice(2));
	if (args.help || args._.length > 0) {
		usage();
		process.exit(args.help ? 0 : 1);
	}

	const harnessPath = path.join(__dirname, "logical-template-harness.js");
	const generatorPath = path.join(__dirname, "logical-generate-prompt.js");
	const templateIds = listTemplateIds(harnessPath, args);
	const promptsByTemplateId = {};

	for (const templateId of templateIds) {
		promptsByTemplateId[templateId] = buildPromptForTemplate(
			generatorPath,
			templateId,
			args,
		);
	}

	writeOrPrint(promptsByTemplateId, args.out);
}

try {
	main();
} catch (error) {
	process.stderr.write(`${error.message}\n`);
	process.exit(1);
}

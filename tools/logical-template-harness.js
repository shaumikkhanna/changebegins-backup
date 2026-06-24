#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const CONTRACT_FILENAME = "llm-ready-logical-template-contracts.md";
const DEFAULT_SPEC = path.resolve(process.cwd(), CONTRACT_FILENAME);

function usage() {
	console.log(`Usage:
  node tools/logical-template-harness.js list [--spec ${CONTRACT_FILENAME}]
  node tools/logical-template-harness.js contract TEMPLATE_ID [--spec ${CONTRACT_FILENAME}]
  node tools/logical-template-harness.js build TEMPLATE_ID [--count 1] [--context non-engineering] [--format json|chatgpt|chatgpt-generate|chatgpt-validate] [--spec ${CONTRACT_FILENAME}] [--out prompt.json]

Examples:
  node tools/logical-template-harness.js list
  node tools/logical-template-harness.js contract LOG_OR_L3_028
  node tools/logical-template-harness.js build LOG_OR_L3_028 --count 3 --context non-engineering --out /tmp/logical-prompt.json
  node tools/logical-template-harness.js build LOG_OR_L3_028 --count 3 --format chatgpt-generate --out /tmp/logical-generate-prompt.txt
  node tools/logical-template-harness.js build LOG_OR_L3_028 --format chatgpt-validate --out /tmp/logical-validate-prompt.txt`);
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

function readSpec(specPath) {
	const resolved = path.resolve(specPath || DEFAULT_SPEC);
	if (!fs.existsSync(resolved)) {
		throw new Error(`Spec file not found: ${resolved}`);
	}
	return {
		path: resolved,
		text: fs.readFileSync(resolved, "utf8"),
	};
}

function findSection(text, startPattern, endPattern) {
	const start = text.search(startPattern);
	if (start === -1) {
		throw new Error(`Could not find section start: ${startPattern}`);
	}

	const tail = text.slice(start);
	const end = tail.slice(1).search(endPattern);
	if (end === -1) {
		return tail.trim();
	}

	return tail.slice(0, end + 1).trim();
}

function removeSection(text, startHeading, nextHeadingPattern) {
	const escapedHeading = startHeading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	const sectionPattern = new RegExp(
		`\\n### ${escapedHeading}\\n[\\s\\S]*?(?=\\n### ${nextHeadingPattern}|\\n---|$)`,
	);
	return text.replace(sectionPattern, "").trim();
}

function findTemplate(text, templateId) {
	const escapedId = templateId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	const templateHeader = new RegExp(`^## ${escapedId}: .*$`, "m");
	const headerMatch = text.match(templateHeader);
	if (!headerMatch || headerMatch.index === undefined) {
		throw new Error(`Template not found: ${templateId}`);
	}

	const templateStart = headerMatch.index;
	const afterHeader = text.slice(templateStart + headerMatch[0].length);
	const nextTemplateOrDomain = afterHeader.search(
		/\n(?:## LOG_[A-Z]+_L\d+_\d+: |# Domain [A-Z]:|## Final Self-Check)/,
	);
	const templateEnd =
		nextTemplateOrDomain === -1
			? text.length
			: templateStart + headerMatch[0].length + nextTemplateOrDomain + 1;
	const block = text.slice(templateStart, templateEnd).trim();

	const domainStart = text.slice(0, templateStart).lastIndexOf("\n# Domain ");
	if (domainStart === -1) {
		throw new Error(`Could not locate domain for template: ${templateId}`);
	}

	const domainHeaderStart = domainStart + 1;
	const domainHeaderEnd = text.indexOf("\n", domainHeaderStart);
	const domainHeader = text.slice(domainHeaderStart, domainHeaderEnd).trim();
	const firstTemplateInDomain = text
		.slice(domainHeaderStart, templateStart)
		.search(/\n## LOG_[A-Z]+_L\d+_\d+: /);
	const domainRulesEnd =
		firstTemplateInDomain === -1
			? templateStart
			: domainHeaderStart + firstTemplateInDomain + 1;
	const domainRules = text.slice(domainHeaderStart, domainRulesEnd).trim();

	const title = headerMatch[0].replace(/^## /, "");
	const difficulty = templateId.split("_")[2] || "";
	return {
		templateId,
		title,
		difficulty,
		domainHeader,
		domainName: domainHeader.replace(/^# Domain [A-Z]:\s*/, ""),
		domainRules,
		templateBlock: block,
	};
}

function listTemplates(text) {
	const matches = [...text.matchAll(/^## (LOG_[A-Z]+_L\d+_\d+): (.+)$/gm)];
	return matches.map((match) => {
		const templateId = match[1];
		const title = match[2];
		const difficulty = templateId.split("_")[2] || "";
		const before = text.slice(0, match.index);
		const domainStart = before.lastIndexOf("\n# Domain ");
		const domainLine =
			domainStart === -1
				? ""
				: text.slice(
						domainStart + 1,
						text.indexOf("\n", domainStart + 1),
					);
		return {
			templateId,
			difficulty,
			title,
			domain: domainLine.replace(/^# Domain [A-Z]:\s*/, ""),
		};
	});
}

function buildFocusedContract(spec, templateId) {
	const globalRules = removeSection(
		findSection(
			spec.text,
			/^## Global Generation Rules/m,
			/\n# Domain [A-Z]:/,
		),
		"Required Output Format",
		".+",
	);
	const finalSelfCheck = findSection(
		spec.text,
		/^## Final Self-Check Before Returning Any Generated Question/m,
		/$(?![\s\S])/,
	);
	const template = findTemplate(spec.text, templateId);

	return {
		specPath: spec.path,
		template,
		contract: [
			"# Focused Logical Generation Contract",
			"",
			globalRules,
			"",
			template.domainRules,
			"",
			template.templateBlock,
			"",
			finalSelfCheck,
		].join("\n"),
	};
}

function buildGenerationPrompt(focused, options) {
	const count = Number.parseInt(options.count || "1", 10);
	if (!Number.isInteger(count) || count < 1 || count > 20) {
		throw new Error("--count must be an integer between 1 and 20");
	}

	const context = options.context || "non-engineering";
	const { template } = focused;

	const systemPrompt = `You are a psychometric item writer for ChangeBegins aptitude assessments.

Your job is to generate logical reasoning questions that mimic the current ChangeBegins item pipeline while obeying the upgraded LLM-ready logical template contract.

ABSOLUTE RULES:
1. Output ONLY valid JSON. No markdown, no commentary, no code fences.
2. Generate exactly ${count} item(s).
3. Use the selected template exactly: ${template.templateId}.
4. Solve each question yourself before writing the final item.
5. Each item must have exactly ONE correct answer.
6. Use only information stated in the question. No external knowledge.
7. Wrong options must be diagnostic distractors, not random wrong answers.
8. Preserve the template difficulty, reasoning operators, answer mode, forbidden patterns, and validator expectations from the focused contract.
9. Do not increase difficulty by adding more entities, noisy wording, or harder arithmetic unless the selected contract requires it.
10. Return old ChangeBegins-compatible item fields, with the richer upgraded-contract fields inside metadata.`;

	const userPrompt = `Generate ${count} logical reasoning item(s).

PIPELINE COMPATIBILITY TARGET:
- The visible output must be usable like the older ChangeBegins generated items.
- Use "questionText", "options", "correctAnswer", "explanation", "tags", "estimatedTime", and "templateId".
- Put upgraded-template audit details in "metadata" so they are available for review without breaking the old shape.

SELECTED TEMPLATE:
- templateId: ${template.templateId}
- templateTitle: ${template.title}
- domain: ${template.domainName}
- difficultyLevel: ${template.difficulty}
- context: ${context}

OUTPUT SHAPE:
{
  "templateId": "${template.templateId}",
  "domain": "logical",
  "context": "${context}",
  "questionsGenerated": ${count},
  "questions": [
    {
      "questionIndex": 1,
      "seed": <current UTC unix timestamp in milliseconds>,
      "parameters": {
        "surface_context": "<brief description of varied names/items/scenario>",
        "template_variant": "<brief description of allowed variation used>"
      },
      "questionText": "<full logical reasoning question text>",
      "options": {
        "A": "<option text>",
        "B": "<option text>",
        "C": "<option text>",
        "D": "<option text>"
      },
      "correctAnswer": "<A|B|C|D>",
      "explanation": "<clear solution derived only from the question>",
      "tags": ["Logical Reasoning"],
      "estimatedTime": <60|90|120|150>,
      "templateId": "${template.templateId}",
      "metadata": {
        "source_contract": "${CONTRACT_FILENAME}",
        "difficulty_level": "${template.difficulty}",
        "reasoning_operators": [],
        "answer_mode": "",
        "correct_answer": "<answer text, not just option letter>",
        "option_rationales": {
          "A": "<why correct or what mistake this represents>",
          "B": "<why correct or what mistake this represents>",
          "C": "<why correct or what mistake this represents>",
          "D": "<why correct or what mistake this represents>"
        },
        "validation_notes": {
          "unique_answer": true,
          "no_external_knowledge": true,
          "difficulty_source": "<explain which template operators/constraints create difficulty>",
          "contract_obeyed": true
        }
      }
    }
  ]
}

FOCUSED CONTRACT:
${focused.contract}

Before output, silently reject and rewrite any item that fails the focused contract or has more than one defensible answer.`;

	const judgePrompt = `You are validating ChangeBegins logical reasoning items generated from an upgraded focused template contract.

Return ONLY valid JSON with this shape:
{
  "templateId": "${template.templateId}",
  "items_checked": <number>,
  "passed": <number>,
  "failed": <number>,
  "results": [
    {
      "questionIndex": 1,
      "pass": true,
      "issues": [],
      "regeneration_instruction": ""
    }
  ]
}

Check each item for:
1. selected template obeyed: ${template.templateId}
2. exactly one correct answer
3. answer and explanation follow only from stated information
4. difficulty comes from the focused contract, not noise
5. wrong options are meaningful and distinct distractors
6. metadata.reasoning_operators and metadata.answer_mode match the contract
7. no forbidden pattern from the contract appears

Do not fail an item only because of recoverable serialization issues such as smart quotes around strings. Assume those can be repaired before final import. Mention them only if they prevent you from understanding the item well enough to judge the reasoning.

FOCUSED CONTRACT:
${focused.contract}`;

	return {
		templateId: template.templateId,
		templateTitle: template.title,
		domain: template.domainName,
		difficultyLevel: template.difficulty,
		context,
		count,
		specPath: focused.specPath,
		systemPrompt,
		userPrompt,
		judgePrompt,
	};
}

function formatForChatGpt(promptBundle) {
	return [
		"# ChatGPT Manual Test Prompt",
		"",
		"Use this file to test generated ChangeBegins logical questions in the ChatGPT UI.",
		"",
		"============================================================",
		"SYSTEM PROMPT",
		"============================================================",
		promptBundle.systemPrompt,
		"",
		"============================================================",
		"USER PROMPT",
		"============================================================",
		promptBundle.userPrompt,
		"",
		"============================================================",
		"VALIDATION REQUEST",
		"============================================================",
		"",
		"JUDGE PROMPT:",
		promptBundle.judgePrompt,
		"",
		"GENERATED JSON:",
		"<PASTE GENERATED JSON HERE>",
		"",
	].join("\n");
}

function formatGenerationForChatGpt(promptBundle) {
	return [
		"# ChatGPT Generation Prompt",
		"",
		"Paste this into ChatGPT to generate temporary ChangeBegins-style logical questions.",
		"",
		"============================================================",
		"SYSTEM PROMPT",
		"============================================================",
		promptBundle.systemPrompt,
		"",
		"============================================================",
		"USER PROMPT",
		"============================================================",
		promptBundle.userPrompt,
		"",
	].join("\n");
}

function formatValidationForChatGpt(promptBundle) {
	return [
		"# ChatGPT Validation Prompt",
		"",
		"Paste this into ChatGPT after it generates question JSON.",
		"Replace <PASTE GENERATED JSON HERE> with the generated JSON before sending.",
		"",
		"============================================================",
		"VALIDATION REQUEST",
		"============================================================",
		"Now validate the generated JSON using the judge prompt below.",
		"",
		"JUDGE PROMPT:",
		promptBundle.judgePrompt,
		"",
		"GENERATED JSON:",
		"<PASTE GENERATED JSON HERE>",
		"",
	].join("\n");
}

function writeOrPrint(value, outPath) {
	const serialized =
		typeof value === "string"
			? value + "\n"
			: JSON.stringify(value, null, 2) + "\n";
	if (outPath) {
		fs.writeFileSync(path.resolve(outPath), serialized);
		return;
	}
	process.stdout.write(serialized);
}

function main() {
	const args = parseArgs(process.argv.slice(2));
	const command = args._[0];
	const templateId = args._[1];

	if (!command || args.help) {
		usage();
		return;
	}

	const spec = readSpec(args.spec);

	if (command === "list") {
		writeOrPrint(listTemplates(spec.text), args.out);
		return;
	}

	if (!templateId) {
		throw new Error(`Missing TEMPLATE_ID for command: ${command}`);
	}

	const focused = buildFocusedContract(spec, templateId);

	if (command === "contract") {
		writeOrPrint(focused.contract, args.out);
		return;
	}

	if (command === "build") {
		const promptBundle = buildGenerationPrompt(focused, args);
		const format = args.format || "json";
		if (format === "json") {
			writeOrPrint(promptBundle, args.out);
			return;
		}
		if (format === "chatgpt") {
			writeOrPrint(formatForChatGpt(promptBundle), args.out);
			return;
		}
		if (format === "chatgpt-generate") {
			writeOrPrint(formatGenerationForChatGpt(promptBundle), args.out);
			return;
		}
		if (format === "chatgpt-validate") {
			writeOrPrint(formatValidationForChatGpt(promptBundle), args.out);
			return;
		}
		throw new Error(
			`Unknown format: ${format}. Use json, chatgpt, chatgpt-generate, or chatgpt-validate.`,
		);
	}

	throw new Error(`Unknown command: ${command}`);
}

try {
	main();
} catch (error) {
	console.error(error.message);
	process.exit(1);
}

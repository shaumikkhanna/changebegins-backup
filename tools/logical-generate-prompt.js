#!/usr/bin/env node

const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const DEFAULT_REJECTIONS_DIR = path.resolve(
	process.cwd(),
	"generated_questions",
	"rejections",
);

function usage() {
	process.stderr.write(`Usage:
  node tools/logical-generate-prompt.js TEMPLATE_ID [--count 3] [--context non-engineering] [--full] [--validation] [--no-rejections] [--rejections generated_questions/rejections] [--spec llm-ready-logical-template-contracts.md]

Examples:
  node tools/logical-generate-prompt.js LOG_OR_L3_028
  node tools/logical-generate-prompt.js LOG_OR_L3_028 --full
  node tools/logical-generate-prompt.js LOG_OR_L3_028 --validation
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

function extractFocusedContract(userPrompt) {
	const marker = "\nFOCUSED CONTRACT:\n";
	const markerIndex = userPrompt.indexOf(marker);
	if (markerIndex === -1) {
		throw new Error("Could not find focused contract in harness output.");
	}
	return userPrompt.slice(markerIndex + marker.length).trim();
}

function compactFocusedContract(contract) {
	return contract
		.replace(/\n### The LLM Must Preserve[\s\S]*?(?=\n### The LLM Must Not Do)/, "\n")
		.replace(
			/\n### Option and Distractor Design Rules[\s\S]*?(?=\n---\n\n# Domain )/,
			"\n### Distractor Rules\n\nUse exactly one correct option and three plausible, distinct diagnostic distractors. All four option texts must be distinct after trimming whitespace, normalizing case, and normalizing equivalent notation. Never repeat the same answer value, relation, object, or completion under two labels; if two options normalize to the same answer, regenerate the options before returning. Avoid `all of the above`, `none of the above`, `cannot say`, and `data insufficient` unless this template explicitly permits them.\n\n",
		)
		.replace(/\n## Domain Purpose[\s\S]*?(?=\n## )/, "\n")
		.replace(/\n## Domain Operators[\s\S]*?(?=\n## )/, "\n")
		.replace(/\n### Example Skeleton[\s\S]*?(?=\n---|\n## Final|$)/, "\n")
		.replace(/\n---\n\n## Final Self-Check[\s\S]*$/m, "")
		.replace(/\n{3,}/g, "\n\n")
			.trim();
}

function compactValidationContract(contract) {
	return contract
		.replace(/\n### The LLM May Vary[\s\S]*?(?=\n### The LLM Must Not Do)/, "\n")
		.replace(/\n## Domain Purpose[\s\S]*?(?=\n## )/, "\n")
		.replace(/\n### Example Skeleton[\s\S]*?(?=\n---|\n## Final|$)/, "\n")
		.replace(/\n---\n\n## Final Self-Check[\s\S]*$/m, "")
		.replace(/\n{3,}/g, "\n\n")
		.trim();
}

function extractJudgeContract(judgePrompt) {
	const marker = "\nFOCUSED CONTRACT:\n";
	const markerIndex = judgePrompt.indexOf(marker);
	if (markerIndex === -1) {
		throw new Error("Could not find focused contract in judge prompt.");
	}
	return {
		prefix: judgePrompt.slice(0, markerIndex).trim(),
		contract: judgePrompt.slice(markerIndex + marker.length).trim(),
	};
}

function readRejectionNotes(templateId, args) {
	if (args["no-rejections"]) {
		return "";
	}

	const rejectionDir = path.resolve(args.rejections || DEFAULT_REJECTIONS_DIR);
	const notePath = path.join(rejectionDir, `${templateId}.md`);
	if (!fs.existsSync(notePath)) {
		return "";
	}

	const notes = fs.readFileSync(notePath, "utf8").trim();
	if (!notes) {
		return "";
	}

	return `\n\nKNOWN FAILURES TO AVOID:\n${notes}`;
}

function buildCompactGenerationPrompt(promptBundle, args) {
	const count = promptBundle.count;
	const context = promptBundle.context;
	const templateId = promptBundle.templateId;
	const contract = compactFocusedContract(extractFocusedContract(promptBundle.userPrompt));
	const rejectionNotes = readRejectionNotes(templateId, args);

	const systemPrompt = `You are a ChangeBegins aptitude item writer. Output only parseable JSON using plain ASCII double quotes, never smart quotes. Generate exactly ${count} logical reasoning item(s) for ${templateId}. Each item must have exactly one correct answer, use no external knowledge, and use plausible diagnostic distractors.`;

	const userPrompt = `Generate ${count} item(s).

Template: ${templateId}
Title: ${promptBundle.templateTitle}
Domain: ${promptBundle.domain}
Difficulty: ${promptBundle.difficultyLevel}
Context: ${context}

SEED USE RULE:
The calling workflow may inject a seed before this prompt or provide it in the seed field. Use the provided seed as a deterministic source for allowed variation such as names, labels, surface context, option order, constraint order, and template variants. Do not mention the seed in the question text. Echo the exact provided seed in the output JSON seed field. If no seed is provided, use the current UTC unix timestamp in milliseconds as the seed.

Return parseable JSON matching this shape. Replace all placeholders with real JSON values:
{
  "templateId": "${templateId}",
  "domain": "logical",
  "context": "${context}",
  "questionsGenerated": ${count},
  "questions": [
    {
      "questionIndex": 1,
      "seed": <current UTC unix timestamp in milliseconds>,
      "parameters": {"surface_context": "", "template_variant": ""},
      "questionText": "",
      "options": {"A": "", "B": "", "C": "", "D": ""},
      "correctAnswer": "A|B|C|D",
      "explanation": "",
      "tags": ["Logical Reasoning"],
      "estimatedTime": 60|90|120|150,
      "templateId": "${templateId}",
      "metadata": {
        "source_contract": "llm-ready-logical-template-contracts.md",
        "difficulty_level": "${promptBundle.difficultyLevel}",
        "reasoning_operators": [],
        "answer_mode": "",
        "correct_answer": "",
        "option_rationales": {"A": "", "B": "", "C": "", "D": ""},
        "validation_notes": {"unique_answer": true, "no_external_knowledge": true, "difficulty_source": "", "contract_obeyed": true}
      }
    }
  ]
}${rejectionNotes}

FOCUSED CONTRACT:
${contract}`;

	return `${systemPrompt}\n\n${userPrompt}\n`;
}

function buildCompactValidationPrompt(promptBundle) {
	const { prefix, contract } = extractJudgeContract(promptBundle.judgePrompt);
	return `${prefix}

FOCUSED CONTRACT:
${compactValidationContract(contract)}

GENERATED JSON:
<PASTE GENERATED JSON HERE>
`;
}

function main() {
	const args = parseArgs(process.argv.slice(2));
	const templateId = args._[0];

	if (!templateId || args.help) {
		usage();
		process.exit(templateId ? 0 : 1);
	}

	if (args.out) {
		throw new Error("This simple tool only writes to stdout; remove --out.");
	}

	const harnessPath = path.join(__dirname, "logical-template-harness.js");
	const harnessArgs = [
		"build",
		templateId,
		"--format",
		"json",
		"--count",
		args.count || "3",
		"--context",
		args.context || "non-engineering",
	];

	if (args.spec) {
		harnessArgs.push("--spec", args.spec);
	}

	const result = spawnSync(process.execPath, [harnessPath, ...harnessArgs], {
		encoding: "utf8",
	});

	if (result.status !== 0) {
		process.stderr.write(result.stderr || result.stdout);
		process.exit(result.status || 1);
	}

	const promptBundle = JSON.parse(result.stdout);
	if (args.validation) {
		if (args.full) {
			process.stdout.write(
				`${promptBundle.judgePrompt}\n\nGENERATED JSON:\n<PASTE GENERATED JSON HERE>\n`,
			);
			return;
		}
		process.stdout.write(buildCompactValidationPrompt(promptBundle));
		return;
	}

	if (!args.full) {
		process.stdout.write(buildCompactGenerationPrompt(promptBundle, args));
		return;
	}

	process.stdout.write(`${promptBundle.systemPrompt}\n\n${promptBundle.userPrompt}\n`);
}

try {
	main();
} catch (error) {
	process.stderr.write(`${error.message}\n`);
	process.exit(1);
}

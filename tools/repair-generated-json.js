#!/usr/bin/env node

let input = "";

process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => {
	input += chunk;
});

process.stdin.on("end", () => {
	try {
		const repaired = input
			.replace(/[“”]/g, '"')
			.replace(/[‘’]/g, "'")
			.trim();
		const parsed = JSON.parse(repaired);
		process.stdout.write(`${JSON.stringify(parsed, null, 2)}\n`);
	} catch (error) {
		process.stderr.write(`Could not repair into valid JSON: ${error.message}\n`);
		process.exit(1);
	}
});

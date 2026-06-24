# Template Rejection Notes

Add one Markdown file per template:

```text
generated_questions/rejections/LOG_OR_L3_028.md
```

`tools/logical-generate-prompt.js` automatically appends the matching file to the compact generation prompt as `KNOWN FAILURES TO AVOID`.

Keep notes short and reusable. Prefer failure patterns over long full examples.

Example:

```md
- Do not ask for an exact position unless the constraints force a unique position.
- Bad pattern: option key says B, but explanation and metadata identify C as correct.
- Bad pattern: odd-one-out set where all four options satisfy the hidden rule.
```


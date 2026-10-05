# Contributing

Open an issue or pull request with a link to an official governing-body document,
the affected organisation and age band, and the proposed correction. Include the
document title, edition or effective season, page or section, retrieval date and
a short supporting quote. Club reposts, blogs and unsourced summaries are not
substitutes for an official source; an authored document on an official partner's
platform is acceptable when its provenance is recorded.

Edit `data/rules.json`. Preserve the governing body's wording for age bands and
distinguish mandatory policies from recommendations. Use `null` for values not
stated in the source. Explain competing options, ranges and ambiguous extracts in
`notes` and `periods.note`; include corroboration in `additional_sources`. Keep
quotes short and retain their attribution. Never infer a rule from another body.

The schema describes one record. Every property is required except
`match_length_minutes_range`, which is required for a `range` record and otherwise
omitted (or null). Record the chosen scalar option and explain alternatives in
the notes. Update the README's relevant summary table and caveats with any change.

With Node.js 22 or later, run (no dependency installation needed):

```sh
npm run validate
npm run build
npm test
```

On Windows with PowerShell script restrictions, use `npm.cmd` in place of `npm`.
Commit the regenerated CSV along with the JSON. If you extend the schema, update
the dependency-free validator to support any new keywords and test the changed
behavior. The validator deliberately rejects unsupported schema keywords.

Data and documentation contributions use CC BY 4.0; scripts, tests, schema and
build configuration use MIT. Existing official-source excerpts retain their
original attribution and rights. See `LICENSE` and `LICENSE-CODE`.

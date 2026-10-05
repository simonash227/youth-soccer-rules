# Youth soccer rules

Youth soccer match formats and playing-time rules, with sources.

A snapshot of 42 records from eight governing bodies, retrieved **2026-10-05**.
Use it to compare match formats, calculate available player-minutes, or build
coaching tools. The records distinguish mandatory rules, recommendations and
unknown values. Local competition rules and later editions may differ.

## Get the data

- [JSON](data/rules.json): canonical array, preserving every supplied research value.
- [CSV](data/rules.csv): spreadsheet-friendly flattened export.
- [Record schema](schema/rules.schema.json): JSON Schema draft 2020-12 for **one
  record**, not the entire array. When validating elsewhere, wrap it as an array's
  `items` schema.

The scripts require Node.js 22 or later and have no dependencies. No install step
is needed:

```sh
npm run validate
npm run build
npm test
```

On Windows with PowerShell script restrictions, use `npm.cmd`. You can also run
`node scripts/validate.mjs` and `node scripts/build-csv.mjs` directly, from any
working directory. To validate a proposed dataset:

```sh
node scripts/validate.mjs path/to/rules.json
```

Validation checks every record against the schema, rejects an empty dataset and
duplicate organisation/country/age-band entries, checks ordered duration ranges,
and checks period totals when all scalar values are known. It checks structure
and consistency; it does not verify whether the cited rules are still current.

## Reading the fields

`players_on_field` includes the goalkeeper and may represent one permitted option
or a maximum; read `format` and `notes` together. `match_length_basis` distinguishes
`fixed`, `maximum`, `range` and `unspecified`. A range uses
`match_length_minutes_range: [minimum, maximum]` with a null scalar duration.
`periods.note` retains alternative halves/quarters, breaks and daily caps.
`ball_size` may be a number or a string for multiple choices. Null means the value
was not established or a single value would hide an ambiguity; it never means
false, zero, or permission. `notes` explains these cases.

The CSV includes all fields. `periods.count`, `periods.length_minutes` and
`periods.note` are separate columns. Scalar arrays are joined with ` | `.
`additional_sources` becomes two parallel joined columns,
`additional_sources.url` and `additional_sources.title`, in original source order.
Null/missing values and empty arrays become empty cells; booleans remain `true`
and `false`. Output is UTF-8 without a BOM, uses CRLF row endings, and quotes
commas, double quotes and embedded newlines. Array joining is a convenience view,
not a reversible encoding if source text itself contains ` | `; use JSON for
lossless processing.

## Summary by organisation

Each age-group link opens its primary source. Times below are total playing
minutes; maxima are not compulsory durations. Consult the record notes for
alternative periods, daily limits, format choices and exceptions.

### U.S. Soccer (Player Development Initiatives)

| Age group | Format | Match length | Minimum playing time policy |
| --- | --- | --- | --- |
| [U6, U7, U8](https://www.usyouthsoccer.org/wp-content/uploads/sites/160/2023/09/Player-Development-Initiatives-2017.pdf) | 4v4 | Maximum 40 min (4 x 10) | Philosophy (best practice, not mandated): everyone should participate a minimum of 50% of the time. |
| [U9, U10](https://www.usyouthsoccer.org/wp-content/uploads/sites/160/2023/09/Player-Development-Initiatives-2017.pdf) | 7v7 | 50 min (2 x 25) | Philosophy (best practice, not mandated): every player should play a minimum of 50% of the time in each game. |
| [U11](https://www.usyouthsoccer.org/wp-content/uploads/sites/160/2023/09/Player-Development-Initiatives-2017.pdf) | 9v9 | 60 min (2 x 30) | Philosophy (best practice, not mandated): every player should play a minimum of 50% of the time in each game. |
| [U12](https://www.usyouthsoccer.org/wp-content/uploads/sites/160/2023/09/Player-Development-Initiatives-2017.pdf) | 9v9 | 60 min (2 x 30) | Philosophy (best practice, not mandated): every player should play a minimum of 50% of the time in each game. |

### AYSO (American Youth Soccer Organization)

| Age group | Format | Match length | Minimum playing time policy |
| --- | --- | --- | --- |
| [6U](https://aysovolunteers.org/wp-content/uploads/2024/04/AYSO-Reference-Book-2024-0420.pdf) | 4v4 | Maximum 20 min (2 x 10) | Everyone Plays: all eligible team members in attendance must play at least half of the match, excluding overtime. Late arrivals: arriving in 1st quarter must play 2 of remaining 3 quarters; arriving in 2nd/3rd quarter must play at least 1 quarter. Regions may adopt the optional 'three-quarter rule' (no player plays an entire game unless all others play at least three quarters). |
| [8U](https://aysovolunteers.org/wp-content/uploads/2024/04/AYSO-Reference-Book-2024-0420.pdf) | 4v4 (Regions may opt for 5v5, no goalkeeper) | Maximum 40 min (2 x 20) | Everyone Plays: all eligible team members in attendance must play at least half of the match, excluding overtime; optional regional three-quarter rule. |
| [10U](https://aysovolunteers.org/wp-content/uploads/2024/04/AYSO-Reference-Book-2024-0420.pdf) | 7v7 | Maximum 50 min (2 x 25) | Everyone Plays: all eligible team members in attendance must play at least half of the match, excluding overtime; optional regional three-quarter rule. |
| [12U](https://aysovolunteers.org/wp-content/uploads/2024/04/AYSO-Reference-Book-2024-0420.pdf) | 9v9 | Maximum 60 min (2 x 30) | Everyone Plays: all eligible team members in attendance must play at least half of the match, excluding overtime; optional regional three-quarter rule. |
| [14U](https://aysovolunteers.org/wp-content/uploads/2024/04/AYSO-Reference-Book-2024-0420.pdf) | 11v11 | Maximum 70 min (2 x 35) | Everyone Plays: all eligible team members in attendance must play at least half of the match, excluding overtime. Under free substitution, a late arrival before 17.5 min must play 50% (35 min); arriving between 17.5 and 52.5 min must play 25% (17.5 min). |
| [16U](https://aysovolunteers.org/wp-content/uploads/2024/04/AYSO-Reference-Book-2024-0420.pdf) | 11v11 | Maximum 80 min (2 x 40) | Everyone Plays: all eligible team members in attendance must play at least half of the match, excluding overtime. |
| [19U](https://aysovolunteers.org/wp-content/uploads/2024/04/AYSO-Reference-Book-2024-0420.pdf) | 11v11 | Maximum 90 min (2 x 45) | Everyone Plays: all eligible team members in attendance must play at least half of the match, excluding overtime. |

### US Youth Soccer (USYSA)

| Age group | Format | Match length | Minimum playing time policy |
| --- | --- | --- | --- |
| [6 years of age and under (U6)](https://www.usyouthsoccer.org/wp-content/uploads/sites/160/2025/12/Policy-on-Players-and-Playing-Rules-_APP-12.05.2025.pdf) | Not more than 4 per side (3 strongly recommended) | 24 min (4 x 6) | No national minimum for all play. The policy's definition of a 'recreational league' requires that 'each player must play at least one-half of each game except for reasons of injury, illness, or discipline' (Rule 101 Sec. 3(16)(D)). |
| [8 years of age and under (U8)](https://www.usyouthsoccer.org/wp-content/uploads/sites/160/2025/12/Policy-on-Players-and-Playing-Rules-_APP-12.05.2025.pdf) | Not more than 5 per side (4 strongly recommended) | 48 min (4 x 12) | Recreational-league definition only: each player must play at least one-half of each game except for injury, illness or discipline. |
| [10 years of age and under (U10)](https://www.usyouthsoccer.org/wp-content/uploads/sites/160/2025/12/Policy-on-Players-and-Playing-Rules-_APP-12.05.2025.pdf) | Not more than 7 per side (6 strongly recommended) | 50 min (2 x 25) | Recreational-league definition only: each player must play at least one-half of each game except for injury, illness or discipline. |
| [11 years of age and under (U11)](https://www.usyouthsoccer.org/wp-content/uploads/sites/160/2025/12/Policy-on-Players-and-Playing-Rules-_APP-12.05.2025.pdf) | Not more than 11 per side (8 strongly recommended) | 60 min (2 x 30) | Recreational-league definition only: each player must play at least one-half of each game except for injury, illness or discipline. |
| [12 years of age and under (U12)](https://www.usyouthsoccer.org/wp-content/uploads/sites/160/2025/12/Policy-on-Players-and-Playing-Rules-_APP-12.05.2025.pdf) | Not more than 11 per side (8 strongly recommended) | 60 min (2 x 30) | Recreational-league definition only: each player must play at least one-half of each game except for injury, illness or discipline. |
| [13 and 14 years of age and under (U13, U14)](https://www.usyouthsoccer.org/wp-content/uploads/sites/160/2025/12/Policy-on-Players-and-Playing-Rules-_APP-12.05.2025.pdf) | 11v11 (FIFA Laws of the Game; no player-count modification stated) | 70 min (2 x 35) | Recreational-league definition only: each player must play at least one-half of each game except for injury, illness or discipline. |
| [15 and 16 years of age and under (U15, U16)](https://www.usyouthsoccer.org/wp-content/uploads/sites/160/2025/12/Policy-on-Players-and-Playing-Rules-_APP-12.05.2025.pdf) | 11v11 | 80 min (2 x 40) | Recreational-league definition only: each player must play at least one-half of each game except for injury, illness or discipline. |
| [17, 18 and 19 years of age and under (U17, U18, U19)](https://www.usyouthsoccer.org/wp-content/uploads/sites/160/2025/12/Policy-on-Players-and-Playing-Rules-_APP-12.05.2025.pdf) | 11v11 | 90 min (2 x 45) | Recreational-league definition only: each player must play at least one-half of each game except for injury, illness or discipline. |

### The Football Association (The FA)

| Age group | Format | Match length | Minimum playing time policy |
| --- | --- | --- | --- |
| [Under 7 and Under 8](https://www.thefa.com/-/media/files/thefaportal/governance-docs/rules-of-the-association/2025-26/30---standard-code-of-rules-for-mini-soccer-and-youth-football-competitions.ashx) | 5v5 (maximum permitted format) | Maximum 40 min (2 x 20) | Not mandated. Mini-Soccer and Youth Futsal Handbook best practice: all team members should receive equal playing time where possible, with a recommendation of at least 50% per player per game. |
| [Under 9 and Under 10](https://www.thefa.com/-/media/files/thefaportal/governance-docs/rules-of-the-association/2025-26/30---standard-code-of-rules-for-mini-soccer-and-youth-football-competitions.ashx) | 7v7 (maximum permitted format) | Maximum 50 min (2 x 25) | Not mandated. Handbook best practice: equal playing time where possible, at least 50% per player per game. |
| [Under 11](https://www.thefa.com/-/media/files/thefaportal/governance-docs/rules-of-the-association/2025-26/30---standard-code-of-rules-for-mini-soccer-and-youth-football-competitions.ashx) | 9v9 (maximum permitted format) | Maximum 60 min (2 x 30) | None mandated in SCORY for Youth Football. |
| [Under 12](https://www.thefa.com/-/media/files/thefaportal/governance-docs/rules-of-the-association/2025-26/30---standard-code-of-rules-for-mini-soccer-and-youth-football-competitions.ashx) | 9v9 (maximum permitted format) | Maximum 60 min (2 x 30) | None mandated in SCORY for Youth Football. |
| [Under 13 and Under 14](https://www.thefa.com/-/media/files/thefaportal/governance-docs/rules-of-the-association/2025-26/30---standard-code-of-rules-for-mini-soccer-and-youth-football-competitions.ashx) | 11v11 | Maximum 70 min (2 x 35) | None mandated in SCORY for Youth Football. |
| [Under 15 and Under 16](https://www.thefa.com/-/media/files/thefaportal/governance-docs/rules-of-the-association/2025-26/30---standard-code-of-rules-for-mini-soccer-and-youth-football-competitions.ashx) | 11v11 | Maximum 80 min (2 x 40) | None mandated in SCORY for Youth Football. |
| [Under 17 and Under 18](https://www.thefa.com/-/media/files/thefaportal/governance-docs/rules-of-the-association/2025-26/30---standard-code-of-rules-for-mini-soccer-and-youth-football-competitions.ashx) | 11v11 | Maximum 90 min (2 x 45) | None mandated in SCORY for Youth Football. |

### Football Australia (Coles MiniRoos Club Football)

| Age group | Format | Match length | Minimum playing time policy |
| --- | --- | --- | --- |
| [Under 6 & 7](https://playfootball.com.au/sites/default/files/2025-10/FA0708_MiniRoos_Doc_Update_2.pdf) | 4v4 | 40 min (2 x 20) | Equal playing time should be a priority ensuring all players regardless of age, gender and/or ability get to take the field (stated as a priority, not a quantified minimum). |
| [Under 8 & 9](https://playfootball.com.au/sites/default/files/2025-10/FA0708_MiniRoos_Doc_Update_2.pdf) | 7v7 | 40 min (2 x 20) | Equal playing time should be a priority (all age groups U6-U11). |
| [Under 10 & 11](https://playfootball.com.au/sites/default/files/2025-10/FA0708_MiniRoos_Doc_Update_2.pdf) | 9v9 | 50 min (2 x 25) | Equal playing time should be a priority (all age groups U6-U11). |

### Canada Soccer (Grassroots Standards)

| Age group | Format | Match length | Minimum playing time policy |
| --- | --- | --- | --- |
| [U6-U7 (Fundamentals)](https://canadasoccer.com/wp-content/uploads/resources/grassroots/2024-CS-GrassrootsStandards-EN.pdf) | 3v3 | Maximum 30 min (2 x 15) | Fair Playing Time for All Players; coaches should target a minimum of 50% playing time for each player. Exception: at U7, where the match-day roster allows more players, players may not reach 50% but should play as close to equal time as possible. |
| [U8-U9 (Fundamentals)](https://canadasoccer.com/wp-content/uploads/resources/grassroots/2024-CS-GrassrootsStandards-EN.pdf) | 4v4 (no GK) or 5v5 (with GK) | Maximum 40 min (2 x 20) | Fair Playing Time for All Players; coaches should target a minimum of 50% playing time for each player. Grassroots players should not play less than 50% of a match. |
| [U10-U11 (Learn to Train)](https://canadasoccer.com/wp-content/uploads/resources/grassroots/2024-CS-GrassrootsStandards-EN.pdf) | 7v7 | Maximum 50 min (2 x 25) | Fair Playing Time; target minimum 50% playing time for each player; grassroots players should not play less than 50% of a match. |
| [U12-U13 (Learn to Train)](https://canadasoccer.com/wp-content/uploads/resources/grassroots/2024-CS-GrassrootsStandards-EN.pdf) | 9v9 | U12: maximum 70 min; U13: maximum 80 min | Fair Playing Time; target minimum 50% playing time for each player up to U13. |

### New Zealand Football (Whole of Football 2.0)

| Age group | Format | Match length | Minimum playing time policy |
| --- | --- | --- | --- |
| [First Kicks (4-7 years)](https://www.sporty.co.nz/asset/downloadasset?id=4ac7afbf-9cf6-43ba-bc2f-873eaf40eec6) | 3v3 | 16-36 min; 2-3 x 8-12 minute games | Not stated in the cited document |
| [Fun Football (U8-U9 years)](https://www.sporty.co.nz/asset/downloadasset?id=24b7b378-d731-4676-a1a4-7ce312114e1b) | 5v5 | 45 min (3 x 15) | Not stated in the cited document |
| [Mini Football (U10-U11 years)](https://www.sporty.co.nz/asset/downloadasset?id=5efff680-4b0d-4f3d-bc97-534bf0f6c45a) | 7v7 | 40-50 min; 2 x 20-25 minute halves or games | Not stated in the cited document |
| [Mini Football (12-13 years)](https://www.sporty.co.nz/asset/downloadasset?id=78100ccc-3706-4d8f-9738-c41379fb7a0c) | 9v9 | 50-60 min; 2 x 25-30 minute halves or games | Not stated in the cited document |
| [Youth Football (14-15 years)](https://www.sporty.co.nz/asset/downloadasset?id=7398750f-db89-4da4-ab14-d5aa73cd755f) | 11v11 or 9v9 | 60-80 min; 2 x 30-40 minute halves | Not stated in the cited document |
| [Youth & Senior Football (16+ years)](https://www.sporty.co.nz/asset/downloadasset?id=aa9685bf-1a08-4c74-9dd4-819738c76184) | 11v11 | 70-90 min; 2 x 35-45 minute halves | Not stated in the cited document |

### Football Association of Ireland (FAI)

| Age group | Format | Match length | Minimum playing time policy |
| --- | --- | --- | --- |
| [5-7 years old ('Me and My Ball')](https://www.fai.ie/download_file/3adea439-07e3-4b8e-bc13-eb30952e4ca6/1814/) | 2v2 to 5v5 (illustrative) | Not established | Not stated in the cited document |
| [8-11 years old ('Me and My Skills')](https://www.fai.ie/download_file/3adea439-07e3-4b8e-bc13-eb30952e4ca6/1814/) | 5v5 to 7v7 (illustrative) | Not established | Not stated in the cited document |
| [12-14 years old ('Me and My Team Mates')](https://www.fai.ie/download_file/3adea439-07e3-4b8e-bc13-eb30952e4ca6/1814/) | 9v9 to 11v11 (illustrative) | Not established | Not stated in the cited document |

## How values were sourced

The supplied research used official documents only: governing-body publications
on their own websites or documents they authored and made available through
another official body or their publishing platform. Sources were retrieved
**2026-10-05**. Each record contains the source title, URL and a supporting
verbatim quote/excerpt; corroborating links are retained in `additional_sources`.
The quote is supporting evidence, not necessarily evidence for every field.
Policy fields are paraphrases, and their mandatory or advisory scope is retained.

This release reformats the supplied JSON without changing its values. It does not
represent a fresh review of every source. The original research downloaded PDFs
and extracted text with `pdfplumber`; excerpts may differ in whitespace or line
breaks from the rendered PDF and sometimes join spans with ellipses. Rotated-table
readings, hosting exceptions and ambiguous values are disclosed below and in the
records. Unknown values remain null.

## Known gaps and ambiguities

The following two subsections reproduce the research README's caveats verbatim.

### Gaps

- **FAI**: no current official document on fai.ie gives duration, ball size, heading, substitution or playing-time rules by age. The 2015 *Player Development Plan* (U8/U9 5v5, U10/U11 7v7, U12 9v9) is only hosted on club websites, so it was deliberately excluded.
- **Heading**: Football Australia, Canada Soccer and NZ Football documents do not mention heading at all; set to `null` rather than assumed.
- **US Youth Soccer**: the policy refers to "Development Player Program - Modified Playing Rules" for U10/U8/U6 game length; that document was not found, so Rule 303 Sec. 1 figures are used. USYS has no U9 age group.
- **U.S. Soccer**: the PDI PDF is U.S. Soccer-authored but was only located on usyouthsoccer.org; ussoccer.com carries the narrative article, not the PDF.
- **The FA**: SCORY bracketed values (e.g. number of repeat substitutes, half-time length) are set by each sanctioned competition; the dataset records the permitted range. "Future Fit" format changes announced for 2026-27 are not reflected.
- **FA Mini-Soccer Handbook** copy used is the County FA-hosted version on thefa.com (West Riding FA); content is The FA's.
- **NZ Football** sheets are hosted on sporty.co.nz (NZF's platform) and reached via the official Resources page.

### Values that were ambiguous

1. **AYSO 6U/8U match length.** National Rules & Regulations Art. I.B.1 and the Chapter 8 "4V4 Standards of Play" say two halves of max 10 min (6U) / 20 min (8U). The U.S. Soccer PDI chart reproduced in the same Reference Book shows 4 x 10. The AYSO-specific text is recorded (20 / 40 min), flagged in `notes`.
2. **AYSO 12U heading.** Banned for "11U and below (12U and below for programs without single age divisions)". In standard two-year 12U divisions heading is banned; in single-age 12U divisions it is not. Recorded verbatim.
3. **US Youth Soccer U11/U12 players per side.** Table reads "No more than 11, 8 strongly recommended"; the policy never says "9v9". `players_on_field` records the cap (11) with a note.
4. **U.S. Soccer build-out line position.** The article says "14-yards in front of each goal"; the PDF says "equidistant between the penalty area line and halfway line". Both quoted.
5. **Football Australia U10-11 offside.** The document states "no offside" for U6-7 and U8-9 but is silent for U10-11.
6. **Canada U8-U9 goalkeeper.** Clubs may run 4v4 (no GK) or 5v5 (with GK); `goalkeeper` is `null`, `players_on_field` reflects 5v5. For U6-U7 3v3 the GK column is blank in the standard.
7. **FA ball sizes for U11-U18.** The SCORY Rule 18(C) table is a rotated page whose extracted text is mirrored; readings (U11-U14 size 4, U15-U18 size 5) were cross-checked against the FA Youth Heading Guidance chart, which agrees.
8. **NZ Football ranges.** Game time is given as ranges (e.g. "2 x 20-25 minute halves or games"); stored as `match_length_minutes_range`.
9. **FAI 12-14 format.** Chart text extracted as garbled characters; "9v9 to 11v11" is the reconstruction and is flagged.

## Corrections

Open an issue or pull request with an **official source link**, the relevant age
band, and the document's edition/page. See [CONTRIBUTING.md](CONTRIBUTING.md) for
how to update the records, summary and generated CSV. Later guidance should be
identified by its effective season rather than silently applied to older rules.

## How to cite

> Pitch Time (2026). *Youth soccer match formats and playing-time rules, with
> sources*. Dataset retrieved 2026-10-05. CC BY 4.0.
> https://github.com/simonash227/youth-soccer-rules

The repository address above is the intended publication address. Until it is
published, cite the local snapshot and its commit hash. Include the commit hash
(or release identifier), your access date and any changes you made. Cite the
record's official source separately when relying on a particular rule. Retain
source attribution and link to the license when redistributing the data.

## Licenses

Data (`data/`) and accompanying documentation are licensed under
[CC BY 4.0](LICENSE). Scripts, tests, schema and build configuration are licensed
under [MIT](LICENSE-CODE). Official-source excerpts remain attributed to their
original authors; the dataset license grants only the rights held by its
maintainer. The governing bodies do not endorse this dataset.

## Maintained by

[Pitch Time](https://pitchtime.app). Pitch Time is a youth soccer coaching app that automatically generates fair playing time lineups.
[Playing-time calculator](https://pitchtime.app/playing-time-calculator) · [AI tools](https://pitchtime.app/ai).

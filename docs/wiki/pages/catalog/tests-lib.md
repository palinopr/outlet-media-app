# Tests / Lib

Generated from the current working tree on 2026-04-10 21:37:00.

- Files: 4
- File kinds: test file (4)

Each entry below documents the file path, system ownership, construction style, imports/exports when available, cross-links to tests and routes, and a concise contents summary.

## `__tests__/lib/api-schemas.test.ts`
- Status: tracked-clean
- System: tests
- Group: Tests / Lib
- Ownership: library test suite
- Type: test file
- Construction: test specification
- Lines: 297
- Bytes: 10275
- Imports (internal): src/lib/api-schemas.ts
- Imports (packages): vitest
- Depends on groups: src/lib
- Defines: validBase, result
- Tests / describe labels: IngestPayloadSchema, accepts a valid meta payload, accepts a valid ticketmaster_one payload, rejects missing secret, rejects empty secret, rejects invalid source enum, rejects missing data.scraped_at, accepts tm_demographics source, … (+4 more)
- Contents summary: tests/describes: IngestPayloadSchema; accepts a valid meta payload; accepts a valid ticketmaster_one payload; internal imports: 1; package imports: 1

## `__tests__/lib/client-slug.test.ts`
- Status: tracked-clean
- System: tests
- Group: Tests / Lib
- Ownership: library test suite
- Type: test file
- Construction: test specification
- Lines: 32
- Bytes: 1065
- Imports (internal): src/lib/client-slug.ts
- Depends on groups: src/lib
- Tests / describe labels: guessClientSlug, maps arjona to zamora, maps alofoke to zamora, maps camila to zamora, maps kybba, maps beamina, maps happy paws with space, maps happy_paws with underscore, … (+2 more)
- Contents summary: tests/describes: guessClientSlug; maps arjona to zamora; maps alofoke to zamora; internal imports: 1

## `__tests__/lib/contact-form.test.ts`
- Status: tracked-clean
- System: tests
- Group: Tests / Lib
- Ownership: library test suite
- Type: test file
- Construction: test specification
- Lines: 49
- Bytes: 1207
- Imports (internal): src/lib/api-schemas.ts
- Imports (packages): vitest
- Depends on groups: src/lib
- Defines: result
- Tests / describe labels: ContactFormSchema, accepts valid submission, rejects missing email, rejects invalid email, rejects empty name, rejects empty message
- Contents summary: tests/describes: ContactFormSchema; accepts valid submission; rejects missing email; internal imports: 1; package imports: 1

## `__tests__/lib/formatters.test.ts`
- Status: tracked-clean
- System: tests
- Group: Tests / Lib
- Ownership: library test suite
- Type: test file
- Construction: test specification
- Lines: 131
- Bytes: 3941
- Imports (internal): src/lib/formatters.tsx
- Imports (packages): vitest
- Depends on groups: src/lib
- Defines: result
- Tests / describe labels: centsToUsd, converts cents to dollars, handles zero, returns null for null input, handles fractional cents, fmtUsd, returns -- for null, formats small amounts, … (+4 more)
- Contents summary: tests/describes: centsToUsd; converts cents to dollars; handles zero; internal imports: 1; package imports: 1

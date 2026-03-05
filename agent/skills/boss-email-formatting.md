# Email Formatting Rules

Date: 2026-03-05

Jaime wants ALL emails sent with proper spacing and line breaks:

```
Hi [Name],

[Body text paragraph]

Thank you,
Jaime
```

- Always have a blank line after "Hi [Name],"
- Always have a blank line before "Thank you," / sign-off
- Keep it short and direct — don't over-explain
- When passing body to gmail-sender.mjs, use actual \n newlines:
  `"Hi Jason,\n\nThank you for reaching out...\n\nThank you,\nJaime"`
- Jaime's style: casual, brief, polite. "Hi" not "Dear". "Thank you" not "Best regards".

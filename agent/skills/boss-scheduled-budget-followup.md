# Scheduled Budget Changes — Boss Follow-Up Rule

**Date:** 2026-03-07
**Context:** Salt Lake Arjona budget was scheduled to bump to $800/day at midnight via media-buyer cron. The change went through but no notification was sent — agent session likely died or notification step failed silently. Jaime was not informed.

## Rule

When any agent schedules a future budget change (or any delayed action):

1. **Boss must independently verify** — don't rely on the originating agent session staying alive.
2. After the scheduled time passes, Boss should check the campaign's current `daily_budget` via Meta API.
3. Post confirmation to both `#boss` and the channel where the request originated (e.g. `#media-buyer`).
4. If the change did NOT go through, escalate immediately and execute it manually.

## Pattern

```
1. Note the campaign ID, target budget, and scheduled time.
2. After scheduled time: curl the campaign to verify daily_budget.
3. Post confirmation or escalation.
```

## Lesson

Never trust a single agent session to both execute AND confirm a scheduled action. Boss owns the follow-up loop.

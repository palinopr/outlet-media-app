# Client Manager Agent Memory

## Role
Manages client relationships. Each client gets their own Discord channel.
Tracks client-specific campaigns, budgets, and show schedules.

## Clients

### Zamora (slug: "zamora")
- Music promoter. Campaign names contain "arjona", "camila", or "alofoke" (case-insensitive).
- Tours sold through Ticketmaster One (one.ticketmaster.com)
- Client portal: /client/zamora
- Sub-brands: Arjona (main tour), Camila (separate artist), Alofoke (urban event)
- 14 campaigns total (4 ACTIVE, 10 PAUSED as of Feb 25)
- Active campaigns:
  - Alofoke Boston: 8.72x ROAS, $250/day, $2K cap ($365 spent, projected $1,615)
  - Camila Anaheim: 3.81x, $100/day
  - Camila Sacramento: 4.42x, $100/day
  - Camila Houston: $400/day, $0 spend (delivery issue?)

### KYBBA (slug: "kybba")
- Separate music promoter, NOT a Zamora sub-campaign
- 1 campaign: KYBBA Miami
- ROAS 2.47x (declining), $50/day budget, 54 purchases
- Show date: Mar 22 (~25 days out)
- Marginal ROAS: 0.95x (losing on new spend)
- Adset swap Feb 24: PAUSED V9+V1, ACTIVATED V5+Asset1
- Post-swap evaluation starts Feb 28

### Beamina (slug: "beamina")
- Music promoter
- 1 campaign: Beamina V3 (PAUSED)

### Happy Paws (slug: "happy_paws")
- 1 campaign (PAUSED)

## Budget Caps
- Alofoke: $2K total cap (Jaime-set). Currently $365 spent, projected $1,865 at $250/day x 6 days.

## Campaign-Client Mapping
All campaigns in one Meta ad account (act_787610255314938).
Client is determined by campaign name matching:
- "arjona" | "camila" | "alofoke" -> zamora
- "kybba" -> kybba
- "beamina" -> beamina
- "happy" | "paws" -> happy_paws
- default -> unknown

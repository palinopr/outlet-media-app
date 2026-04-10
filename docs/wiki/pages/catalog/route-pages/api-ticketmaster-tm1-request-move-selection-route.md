# /api/ticketmaster/tm1/request-move-selection

Generated from the current working tree on 2026-04-10 16:52:39.

- Route file: `src/app/api/ticketmaster/tm1/request-move-selection/route.ts`
- Type: Next.js route handler
- Ownership: web API route surface
- Methods: POST
- Auth signals: none
- Behavior signals: none
- Direct internal imports: src/lib/api-helpers.ts, src/lib/ticketmaster/tm1-client.ts
- Feature modules touched: none
- Shared libs/runtime touched: src/lib/api-helpers.ts, src/lib/ticketmaster/tm1-client.ts
- Database objects touched: none
- Direct tests: src/app/api/ticketmaster/tm1/request-move-selection/route.test.ts
- All linked tests: src/app/api/ticketmaster/tm1/request-move-selection/route.test.ts
- Contents summary: Next.js route handler for `/api/ticketmaster/tm1/request-move-selection`; route handlers: POST; exports: POST; internal imports: 2; package imports: 2

## Stack by group
- src/lib: src/lib/api-helpers.ts
- src/lib / ticketmaster: src/lib/ticketmaster/tm1-client.ts

## API behavior
- Request signals: reads JSON body, reads headers, reads query/search params
- Response signals: uses NextResponse.json, uses Response.json, explicit statuses: 400
- Validation symbols: StringIdSchema, PlaceSelectionSchema, RowSelectionSchema, ReservedSectionSelectionSchema, PartialGaSelectionSchema, FullGaSelectionSchema, BackendSelectionSchema, AllocationTargetSchema, ResolutionStatusSchema, BodySchema, … (+1 more)

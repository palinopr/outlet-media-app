module.exports = [
"[project]/src/instrumentation.ts [instrumentation] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Next.js instrumentation hook -- runs once when the server starts.
// https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
__turbopack_context__.s([
    "register",
    ()=>register
]);
async function register() {
    // Validate environment variables on startup
    await __turbopack_context__.A("[project]/src/lib/env.ts [instrumentation] (ecmascript, async loader)");
}
}),
];

//# sourceMappingURL=src_instrumentation_ts_18ea1a8f._.js.map
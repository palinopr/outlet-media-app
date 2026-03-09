module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/package.json (json)", ((__turbopack_context__) => {

__turbopack_context__.v({"name":"outlet-media-app","version":"0.1.0","private":true,"scripts":{"dev":"next dev","build":"next build","start":"next start","lint":"eslint","tm1:crawl":"node agent/scripts/tm1-crawl-capabilities.mjs","tm1:map":"node agent/scripts/tm1-map-source-maps.mjs","type-check":"tsc --noEmit","test":"vitest run","test:watch":"vitest"},"dependencies":{"@ariakit/react":"^0.4.22","@clerk/nextjs":"^6.37.5","@hello-pangea/dnd":"^18.0.1","@platejs/autoformat":"^52.0.11","@platejs/basic-nodes":"^52.0.11","@platejs/code-block":"^52.0.11","@platejs/combobox":"^52.0.15","@platejs/dnd":"^52.0.11","@platejs/indent":"^52.0.11","@platejs/link":"^52.0.11","@platejs/list":"^52.0.11","@platejs/markdown":"^52.3.1","@platejs/media":"^52.0.11","@platejs/mention":"^52.0.15","@platejs/selection":"^52.0.16","@platejs/slash-command":"^52.0.15","@platejs/table":"^52.0.11","@platejs/toggle":"^52.0.11","@radix-ui/react-switch":"^1.2.6","@supabase/supabase-js":"^2.96.0","@tanstack/react-table":"^8.21.3","class-variance-authority":"^0.7.1","clsx":"^2.1.1","cmdk":"^1.1.1","framer-motion":"^12.34.5","lucide-react":"^0.574.0","next":"16.1.6","nuqs":"^2.8.9","platejs":"^52.3.2","radix-ui":"^1.4.3","react":"^19.2.3","react-dom":"^19.2.3","recharts":"^3.7.0","resend":"^6.9.3","sonner":"^2.0.7","tailwind-merge":"^3.4.1","zod":"^4.3.6"},"devDependencies":{"@tailwindcss/postcss":"^4","@testing-library/jest-dom":"^6.9.1","@testing-library/react":"^16.3.2","@types/node":"^20","@types/react":"^19","@types/react-dom":"^19","@vitejs/plugin-react":"^5.1.4","eslint":"^9","eslint-config-next":"16.1.6","jsdom":"^28.1.0","shadcn":"^3.8.5","tailwindcss":"^4","tw-animate-css":"^1.4.0","typescript":"^5","vitest":"^4.0.18"}});}),
"[project]/src/app/api/health/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$package$2e$json__$28$json$29$__ = __turbopack_context__.i("[project]/package.json (json)");
;
;
async function GET() {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        status: "ok",
        timestamp: new Date().toISOString(),
        version: __TURBOPACK__imported__module__$5b$project$5d2f$package$2e$json__$28$json$29$__["default"].version
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0469ae0f._.js.map
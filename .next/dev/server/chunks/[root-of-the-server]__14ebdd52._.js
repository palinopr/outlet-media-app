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
"[externals]/node:crypto [external] (node:crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:crypto", () => require("node:crypto"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}),
"[project]/src/lib/api-helpers.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "adminGuard",
    ()=>adminGuard,
    "apiError",
    ()=>apiError,
    "authGuard",
    ()=>authGuard,
    "parseJsonBody",
    ()=>parseJsonBody,
    "secretGuard",
    ()=>secretGuard,
    "validateRequest",
    ()=>validateRequest
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$app$2d$router$2f$server$2f$auth$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@clerk/nextjs/dist/esm/app-router/server/auth.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$app$2d$router$2f$server$2f$currentUser$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@clerk/nextjs/dist/esm/app-router/server/currentUser.js [app-route] (ecmascript)");
;
;
function apiError(message, status = 500) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        error: message
    }, {
        status
    });
}
async function authGuard() {
    const { userId } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$app$2d$router$2f$server$2f$auth$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["auth"])();
    if (!userId) {
        return {
            userId: null,
            error: apiError("Unauthenticated", 401)
        };
    }
    return {
        userId,
        error: null
    };
}
function secretGuard(secret) {
    if (!process.env.INGEST_SECRET || secret !== process.env.INGEST_SECRET) {
        return apiError("Unauthorized", 401);
    }
    return null;
}
async function adminGuard() {
    const { error } = await authGuard();
    if (error) return error;
    const caller = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$app$2d$router$2f$server$2f$currentUser$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["currentUser"])();
    const meta = caller?.publicMetadata ?? {};
    const role = typeof meta === "object" && meta !== null && "role" in meta && typeof meta.role === "string" ? meta.role : undefined;
    if (role !== "admin") {
        return apiError("Forbidden", 403);
    }
    return null;
}
async function parseJsonBody(request) {
    try {
        return await request.json();
    } catch  {
        return apiError("Malformed JSON body", 400);
    }
}
async function validateRequest(request, schema) {
    const raw = await parseJsonBody(request);
    if (raw instanceof Response) return {
        data: null,
        error: raw
    };
    const parsed = schema.safeParse(raw);
    if (!parsed.success) {
        return {
            data: null,
            error: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Invalid payload",
                details: parsed.error.flatten().fieldErrors
            }, {
                status: 400
            })
        };
    }
    return {
        data: parsed.data,
        error: null
    };
}
}),
"[project]/src/lib/cloud-import.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Cloud storage import helpers for Dropbox and Google Drive shared links.
 *
 * Dropbox: requires DROPBOX_ACCESS_TOKEN env var
 * Google Drive: tries multiple methods silently (OAuth -> API key -> direct URL)
 *   so the user never sees an error unless all methods fail.
 */ __turbopack_context__.s([
    "detectProvider",
    ()=>detectProvider,
    "downloadCloudFile",
    ()=>downloadCloudFile,
    "downloadDropboxFile",
    ()=>downloadDropboxFile,
    "downloadGDriveFile",
    ()=>downloadGDriveFile,
    "listCloudFolder",
    ()=>listCloudFolder,
    "mediaTypeFromMime",
    ()=>mediaTypeFromMime
]);
function detectProvider(url) {
    if (/dropbox\.com\/(sh|scl|s)\//.test(url)) return "dropbox";
    if (/drive\.google\.com\/(drive\/folders|file\/d)\//.test(url)) return "gdrive";
    return null;
}
// ─── Dropbox ─────────────────────────────────────────────────────────────────
async function listDropboxFolder(folderUrl) {
    const token = process.env.DROPBOX_ACCESS_TOKEN;
    if (!token) {
        throw new Error("DROPBOX_ACCESS_TOKEN not configured. Add it to .env.local to enable Dropbox imports.");
    }
    const res = await fetch("https://api.dropboxapi.com/2/files/list_folder", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            path: "",
            shared_link: {
                url: folderUrl
            },
            include_media_info: true,
            limit: 200
        })
    });
    if (!res.ok) {
        const errBody = await res.text();
        throw new Error(`Dropbox API error (${res.status}): ${errBody}`);
    }
    const data = await res.json();
    const entries = data.entries ?? [];
    const mediaFiles = entries.filter((e)=>{
        if (e[".tag"] !== "file") return false;
        const ext = e.name.split(".").pop()?.toLowerCase() ?? "";
        return [
            "jpg",
            "jpeg",
            "png",
            "webp",
            "gif",
            "mp4",
            "mov",
            "avi",
            "mkv"
        ].includes(ext);
    });
    return mediaFiles.map((f)=>({
            name: f.name,
            downloadUrl: f.path_lower,
            size: f.size,
            mimeType: guessMimeType(f.name)
        }));
}
async function downloadDropboxFile(folderUrl, filePath) {
    const token = process.env.DROPBOX_ACCESS_TOKEN;
    if (!token) throw new Error("DROPBOX_ACCESS_TOKEN not configured");
    const res = await fetch("https://content.dropboxapi.com/2/sharing/get_shared_link_file", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Dropbox-API-Arg": JSON.stringify({
                url: folderUrl,
                path: filePath
            })
        }
    });
    if (!res.ok) {
        throw new Error(`Dropbox download failed (${res.status}): ${await res.text()}`);
    }
    const buffer = Buffer.from(await res.arrayBuffer());
    const mimeType = res.headers.get("content-type") ?? guessMimeType(filePath);
    return {
        buffer,
        mimeType
    };
}
// ─── Google Drive (multi-method fallback) ────────────────────────────────────
let cachedAccessToken = null;
/** Which method succeeded for listing -- downloads should use the same one. */ let lastGDriveMethod = null;
async function getGDriveAccessToken() {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const refreshToken = process.env.GOOGLE_DRIVE_REFRESH_TOKEN ?? process.env.GOOGLE_REFRESH_TOKEN;
    if (!clientId || !clientSecret || !refreshToken) return null;
    if (cachedAccessToken && Date.now() < cachedAccessToken.expiresAt) {
        return cachedAccessToken.token;
    }
    const res = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
            client_id: clientId,
            client_secret: clientSecret,
            refresh_token: refreshToken,
            grant_type: "refresh_token"
        })
    });
    if (!res.ok) {
        cachedAccessToken = null;
        return null;
    }
    const data = await res.json();
    cachedAccessToken = {
        token: data.access_token,
        expiresAt: Date.now() + (data.expires_in - 60) * 1000
    };
    return data.access_token;
}
function extractGDriveFolderId(url) {
    const match = url.match(/\/folders\/([a-zA-Z0-9_-]+)/);
    return match?.[1] ?? null;
}
function parseGDriveFiles(data) {
    const files = data.files ?? [];
    return files.filter((f)=>f.mimeType.startsWith("image/") || f.mimeType.startsWith("video/")).map((f)=>({
            name: f.name,
            downloadUrl: f.id,
            size: parseInt(f.size || "0", 10),
            mimeType: f.mimeType
        }));
}
/** Try listing with OAuth access token */ async function listGDriveOAuth(folderId) {
    const accessToken = await getGDriveAccessToken();
    if (!accessToken) return null;
    const query = encodeURIComponent(`'${folderId}' in parents and trashed = false`);
    const fields = encodeURIComponent("files(id,name,size,mimeType)");
    const res = await fetch(`https://www.googleapis.com/drive/v3/files?q=${query}&fields=${fields}&pageSize=200&includeItemsFromAllDrives=true&supportsAllDrives=true`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });
    if (!res.ok) return null;
    lastGDriveMethod = "oauth";
    return parseGDriveFiles(await res.json());
}
/** Try listing with API key (works for publicly shared folders) */ async function listGDriveApiKey(folderId) {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) return null;
    const query = encodeURIComponent(`'${folderId}' in parents and trashed = false`);
    const fields = encodeURIComponent("files(id,name,size,mimeType)");
    const res = await fetch(`https://www.googleapis.com/drive/v3/files?q=${query}&fields=${fields}&pageSize=200&key=${apiKey}&includeItemsFromAllDrives=true&supportsAllDrives=true`);
    if (!res.ok) return null;
    lastGDriveMethod = "apikey";
    return parseGDriveFiles(await res.json());
}
async function listGDriveFolder(folderUrl) {
    const folderId = extractGDriveFolderId(folderUrl);
    if (!folderId) throw new Error("Could not extract folder ID from Google Drive URL");
    // Try OAuth first (full access), then API key (public folders only)
    const errors = [];
    const oauthResult = await listGDriveOAuth(folderId);
    if (oauthResult !== null) return oauthResult;
    errors.push("OAuth failed or not configured");
    const apiKeyResult = await listGDriveApiKey(folderId);
    if (apiKeyResult !== null) return apiKeyResult;
    errors.push("API key failed or not configured");
    throw new Error(`Google Drive: all access methods failed for this folder. Tried: ${errors.join(", ")}`);
}
async function downloadGDriveFile(fileId) {
    // Try OAuth first
    const accessToken = await getGDriveAccessToken();
    if (accessToken) {
        const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&supportsAllDrives=true`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        if (res.ok) {
            const buffer = Buffer.from(await res.arrayBuffer());
            const mimeType = res.headers.get("content-type") ?? "application/octet-stream";
            return {
                buffer,
                mimeType
            };
        }
    }
    // Fall back to API key
    const apiKey = process.env.GOOGLE_API_KEY;
    if (apiKey) {
        const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=${apiKey}&supportsAllDrives=true`);
        if (res.ok) {
            const buffer = Buffer.from(await res.arrayBuffer());
            const mimeType = res.headers.get("content-type") ?? "application/octet-stream";
            return {
                buffer,
                mimeType
            };
        }
    }
    throw new Error(`Google Drive download failed: all methods exhausted for file ${fileId}`);
}
async function listCloudFolder(url) {
    const provider = detectProvider(url);
    if (!provider) throw new Error("Unsupported URL. Paste a Dropbox or Google Drive shared folder link.");
    const files = provider === "dropbox" ? await listDropboxFolder(url) : await listGDriveFolder(url);
    return {
        provider,
        files
    };
}
async function downloadCloudFile(provider, folderUrl, fileRef) {
    if (provider === "dropbox") {
        return downloadDropboxFile(folderUrl, fileRef);
    }
    return downloadGDriveFile(fileRef);
}
// ─── Helpers ─────────────────────────────────────────────────────────────────
function guessMimeType(filename) {
    const ext = filename.split(".").pop()?.toLowerCase() ?? "";
    const map = {
        jpg: "image/jpeg",
        jpeg: "image/jpeg",
        png: "image/png",
        webp: "image/webp",
        gif: "image/gif",
        mp4: "video/mp4",
        mov: "video/quicktime",
        avi: "video/x-msvideo",
        mkv: "video/x-matroska"
    };
    return map[ext] ?? "application/octet-stream";
}
function mediaTypeFromMime(mime) {
    return mime.startsWith("video/") ? "video" : "image";
}
}),
"[project]/src/lib/client-slug.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "guessClientSlug",
    ()=>guessClientSlug
]);
const CLIENT_RULES = [
    {
        keywords: [
            "arjona",
            "alofoke",
            "camila"
        ],
        slug: "zamora"
    },
    {
        keywords: [
            "kybba"
        ],
        slug: "kybba"
    },
    {
        keywords: [
            "beamina"
        ],
        slug: "beamina"
    },
    {
        keywords: [
            "happy paws",
            "happy_paws"
        ],
        slug: "happy_paws"
    }
];
function guessClientSlug(campaignName) {
    const lower = campaignName.toLowerCase();
    for (const rule of CLIENT_RULES){
        if (rule.keywords.some((kw)=>lower.includes(kw))) {
            return rule.slug;
        }
    }
    return "unknown";
}
}),
"[project]/src/lib/supabase.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createClerkSupabaseClient",
    ()=>createClerkSupabaseClient,
    "supabaseAdmin",
    ()=>supabaseAdmin
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$app$2d$router$2f$server$2f$auth$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@clerk/nextjs/dist/esm/app-router/server/auth.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/index.mjs [app-route] (ecmascript) <locals>");
;
;
const url = ("TURBOPACK compile-time value", "https://dbznwsnteogovicllean.supabase.co");
const anonKey = ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRiem53c250ZW9nb3ZpY2xsZWFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3MDc3NzMsImV4cCI6MjA4NTI4Mzc3M30._6liw2kfW9MCwVrpq5QCGSodjzqAE2H7zDCwwx5CK2Y");
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
const supabaseAdmin = url && serviceKey ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(url, serviceKey) : null;
async function createClerkSupabaseClient() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        const { userId } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$app$2d$router$2f$server$2f$auth$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["auth"])();
        if (!userId) return null;
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(url, anonKey, {
            accessToken: async ()=>{
                const { getToken } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$app$2d$router$2f$server$2f$auth$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["auth"])();
                return getToken();
            },
            auth: {
                autoRefreshToken: false,
                detectSessionInUrl: false,
                persistSession: false
            }
        });
    } catch  {
        return null;
    }
}
}),
"[project]/src/lib/campaign-client-assignment.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "applyEffectiveCampaignClientSlugs",
    ()=>applyEffectiveCampaignClientSlugs,
    "campaignBelongsToClientSlug",
    ()=>campaignBelongsToClientSlug,
    "getCampaignClientOverrideMap",
    ()=>getCampaignClientOverrideMap,
    "getEffectiveCampaignClientSlug",
    ()=>getEffectiveCampaignClientSlug,
    "getEffectiveCampaignRowById",
    ()=>getEffectiveCampaignRowById,
    "listEffectiveCampaignIdsForClientSlug",
    ()=>listEffectiveCampaignIdsForClientSlug,
    "listEffectiveCampaignRowsForClientSlug",
    ()=>listEffectiveCampaignRowsForClientSlug,
    "resolveEffectiveCampaignClientSlug",
    ()=>resolveEffectiveCampaignClientSlug
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$client$2d$slug$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/client-slug.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase.ts [app-route] (ecmascript)");
;
;
function normalizeGuessedClientSlug(value) {
    return value === "unknown" ? null : value;
}
async function getCampaignClientOverrideMap(campaignIds) {
    const overrides = new Map();
    if (!__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"]) return overrides;
    const uniqueCampaignIds = campaignIds ? [
        ...new Set(Array.from(campaignIds).filter((value)=>Boolean(value)))
    ] : [];
    let query = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"].from("campaign_client_overrides").select("campaign_id, client_slug");
    if (uniqueCampaignIds.length > 0) {
        query = query.in("campaign_id", uniqueCampaignIds);
    }
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    for (const row of data ?? []){
        if (row.client_slug) {
            overrides.set(row.campaign_id, row.client_slug);
        }
    }
    return overrides;
}
function resolveEffectiveCampaignClientSlug(row, overrides) {
    const override = overrides.get(row.campaign_id);
    if (override) return override;
    if (row.client_slug) return row.client_slug;
    return row.name ? normalizeGuessedClientSlug((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$client$2d$slug$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["guessClientSlug"])(row.name)) : null;
}
async function applyEffectiveCampaignClientSlugs(rows) {
    if (rows.length === 0) return rows;
    const overrides = await getCampaignClientOverrideMap(rows.map((row)=>row.campaign_id));
    return rows.map((row)=>({
            ...row,
            client_slug: resolveEffectiveCampaignClientSlug(row, overrides)
        }));
}
async function getEffectiveCampaignRowById(campaignId, select) {
    if (!__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"]) return null;
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"].from("meta_campaigns").select(select).eq("campaign_id", campaignId).maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) return null;
    const [row] = await applyEffectiveCampaignClientSlugs([
        data
    ]);
    return row ?? null;
}
async function getEffectiveCampaignClientSlug(campaignId) {
    const row = await getEffectiveCampaignRowById(campaignId, "campaign_id, client_slug, name");
    return row?.client_slug ?? null;
}
async function listEffectiveCampaignRowsForClientSlug(select, clientSlug) {
    if (!__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"]) return [];
    const [baseRowsRes, overrideRowsRes] = await Promise.all([
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"].from("meta_campaigns").select(select).eq("client_slug", clientSlug).limit(250),
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"].from("campaign_client_overrides").select("campaign_id").eq("client_slug", clientSlug).limit(250)
    ]);
    if (baseRowsRes.error) throw new Error(baseRowsRes.error.message);
    if (overrideRowsRes.error) throw new Error(overrideRowsRes.error.message);
    const baseRows = baseRowsRes.data ?? [];
    const existingIds = new Set(baseRows.map((row)=>row.campaign_id));
    const overrideCampaignIds = (overrideRowsRes.data ?? []).map((row)=>row.campaign_id).filter((value)=>Boolean(value)).filter((value)=>!existingIds.has(value));
    let extraRows = [];
    if (overrideCampaignIds.length > 0) {
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"].from("meta_campaigns").select(select).in("campaign_id", overrideCampaignIds);
        if (error) throw new Error(error.message);
        extraRows = data ?? [];
    }
    const combinedRows = [
        ...baseRows,
        ...extraRows
    ];
    const effectiveRows = await applyEffectiveCampaignClientSlugs(combinedRows);
    return effectiveRows.filter((row)=>row.client_slug === clientSlug);
}
async function listEffectiveCampaignIdsForClientSlug(clientSlug) {
    const rows = await listEffectiveCampaignRowsForClientSlug("campaign_id, client_slug, name", clientSlug);
    return rows.map((row)=>row.campaign_id);
}
async function campaignBelongsToClientSlug(campaignId, clientSlug) {
    const row = await getEffectiveCampaignRowById(campaignId, "campaign_id, client_slug, name");
    return row?.client_slug === clientSlug;
}
}),
"[project]/src/lib/asset-classifier.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "classifyAsset",
    ()=>classifyAsset,
    "readImageDimensions",
    ()=>readImageDimensions
]);
/**
 * Auto-classifies imported assets by analyzing filename patterns,
 * image dimensions, and matching against the client's events/campaigns.
 *
 * Placement rules (from Meta ad creative conventions):
 *   1:1   (1080x1080)  -> post
 *   4:5   (1080x1350)  -> post
 *   9:16  (1080x1920)  -> story
 *   1.91:1 (1200x630)  -> feed (link ad)
 *   16:9  (1920x1080)  -> feed
 *   video with "reel"  -> story
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$campaign$2d$client$2d$assignment$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/campaign-client-assignment.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase.ts [app-route] (ecmascript)");
;
;
// ─── Dimension reading (no external deps) ────────────────────────────────────
function readPngDimensions(buf) {
    // PNG signature: 137 80 78 71 13 10 26 10, then IHDR chunk at byte 16
    if (buf.length < 24) return null;
    if (buf[0] !== 0x89 || buf[1] !== 0x50 || buf[2] !== 0x4e || buf[3] !== 0x47) return null;
    return {
        w: buf.readUInt32BE(16),
        h: buf.readUInt32BE(20)
    };
}
function readJpegDimensions(buf) {
    if (buf.length < 4 || buf[0] !== 0xff || buf[1] !== 0xd8) return null;
    let offset = 2;
    while(offset < buf.length - 8){
        if (buf[offset] !== 0xff) break;
        const marker = buf[offset + 1];
        // SOF markers: C0-C3, C5-C7, C9-CB, CD-CF
        if (marker >= 0xc0 && marker <= 0xc3 || marker >= 0xc5 && marker <= 0xc7 || marker >= 0xc9 && marker <= 0xcb || marker >= 0xcd && marker <= 0xcf) {
            const h = buf.readUInt16BE(offset + 5);
            const w = buf.readUInt16BE(offset + 7);
            return {
                w,
                h
            };
        }
        const len = buf.readUInt16BE(offset + 2);
        offset += 2 + len;
    }
    return null;
}
function readGifDimensions(buf) {
    // GIF87a / GIF89a: width at bytes 6-7, height at bytes 8-9 (little-endian)
    if (buf.length < 10) return null;
    const sig = buf.toString("ascii", 0, 6);
    if (sig !== "GIF87a" && sig !== "GIF89a") return null;
    return {
        w: buf.readUInt16LE(6),
        h: buf.readUInt16LE(8)
    };
}
function readWebpDimensions(buf) {
    if (buf.length < 30) return null;
    const riff = buf.toString("ascii", 0, 4);
    const webp = buf.toString("ascii", 8, 12);
    if (riff !== "RIFF" || webp !== "WEBP") return null;
    const chunk = buf.toString("ascii", 12, 16);
    if (chunk === "VP8 " && buf.length >= 30) {
        return {
            w: buf.readUInt16LE(26) & 0x3fff,
            h: buf.readUInt16LE(28) & 0x3fff
        };
    }
    if (chunk === "VP8L" && buf.length >= 25) {
        const bits = buf.readUInt32LE(21);
        return {
            w: (bits & 0x3fff) + 1,
            h: (bits >> 14 & 0x3fff) + 1
        };
    }
    return null;
}
function readImageDimensions(buf, mimeType) {
    if (mimeType === "image/png") return readPngDimensions(buf);
    if (mimeType === "image/gif") return readGifDimensions(buf);
    if (mimeType === "image/jpeg") return readJpegDimensions(buf);
    if (mimeType === "image/webp") return readWebpDimensions(buf);
    return null;
}
// ─── Filename parsing ────────────────────────────────────────────────────────
const DIM_RE = /(\d{3,4})\s*x\s*(\d{3,4})/i;
const PLACEMENT_KEYWORDS = {
    post: "post",
    feed: "feed",
    story: "story",
    reel: "story",
    reels: "story",
    stories: "story",
    igs: "story"
};
function parseFilenameHints(fileName) {
    const dimMatch = fileName.match(DIM_RE);
    const dimW = dimMatch ? parseInt(dimMatch[1], 10) : null;
    const dimH = dimMatch ? parseInt(dimMatch[2], 10) : null;
    const lower = fileName.toLowerCase();
    let placementHint = null;
    for (const [kw, placement] of Object.entries(PLACEMENT_KEYWORDS)){
        if (lower.includes(kw)) {
            placementHint = placement;
            break;
        }
    }
    // Extract meaningful name tokens (strip extension, dimensions, common filler)
    const base = fileName.replace(/\.[^.]+$/, "");
    const cleaned = base.replace(DIM_RE, "").replace(/px/gi, "").replace(/[_\-()]/g, " ").replace(/\s+/g, " ").trim();
    const nameTokens = cleaned.split(" ").filter((t)=>t.length > 1 && !/^\d+$/.test(t));
    return {
        dimW,
        dimH,
        placementHint,
        nameTokens
    };
}
// ─── Placement from aspect ratio ─────────────────────────────────────────────
function placementFromRatio(w, h) {
    const ratio = w / h;
    if (ratio >= 0.95 && ratio <= 1.05) return "post"; // 1:1
    if (ratio >= 0.75 && ratio <= 0.85) return "post"; // 4:5
    if (ratio >= 0.5 && ratio <= 0.6) return "story"; // 9:16
    if (ratio >= 1.8) return "feed"; // 1.91:1 or 16:9
    if (ratio < 0.7) return "story"; // tall = story
    return "post"; // default square-ish = post
}
async function getCampaignCandidates(clientSlug) {
    const campaigns = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$campaign$2d$client$2d$assignment$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["listEffectiveCampaignRowsForClientSlug"])("campaign_id, client_slug, name", clientSlug);
    return campaigns.filter((campaign)=>typeof campaign.name === "string" && campaign.name.trim().length > 0).map((campaign)=>({
            id: campaign.campaign_id,
            name: campaign.name
        }));
}
async function getEventCandidates(clientSlug) {
    if (!__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"]) return [];
    const { data: events } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"].from("tm_events").select("name").eq("client_slug", clientSlug);
    return (events ?? []).map((event)=>({
            id: null,
            name: event.name
        }));
}
function matchCandidate(nameTokens, candidates) {
    if (candidates.length === 0 || nameTokens.length === 0) return null;
    const joined = nameTokens.join(" ").toLowerCase();
    let bestMatch = null;
    let bestScore = 0;
    for (const c of candidates){
        const words = c.name.toLowerCase().split(/\s+/);
        let hits = 0;
        for (const w of words){
            if (w.length > 2 && joined.includes(w.toLowerCase())) hits++;
        }
        const score = hits / words.length;
        if (hits >= 2 && score > bestScore) {
            bestScore = score;
            bestMatch = c;
        }
    }
    return bestMatch;
}
// ─── Folder name formatting ──────────────────────────────────────────────────
function titleCase(s) {
    return s.toLowerCase().split(" ").map((w)=>w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}
const PLACEMENT_FOLDER = {
    post: "Post",
    story: "Story",
    feed: "Feed",
    both: "General"
};
async function classifyAsset(fileName, buffer, mimeType, clientSlug) {
    const isVideo = mimeType.startsWith("video/");
    const { dimW, dimH, placementHint, nameTokens } = parseFilenameHints(fileName);
    // 1. Get actual dimensions (images only)
    let width = null;
    let height = null;
    if (!isVideo) {
        const dims = readImageDimensions(buffer, mimeType);
        if (dims) {
            width = dims.w;
            height = dims.h;
        } else if (dimW && dimH) {
            width = dimW;
            height = dimH;
        }
    } else if (dimW && dimH) {
        width = dimW;
        height = dimH;
    }
    // 2. Determine placement
    let placement;
    if (placementHint) {
        placement = placementHint;
    } else if (width && height) {
        placement = placementFromRatio(width, height);
    } else if (isVideo) {
        // Videos without dimension info -- check filename for "reel" etc
        const lower = fileName.toLowerCase();
        placement = lower.includes("reel") || lower.includes("story") ? "story" : "both";
    } else {
        placement = "both";
    }
    // 3. Match against campaigns first, then events for foldering context
    const [campaignCandidates, eventCandidates] = await Promise.all([
        getCampaignCandidates(clientSlug),
        getEventCandidates(clientSlug)
    ]);
    const campaignMatch = matchCandidate(nameTokens, campaignCandidates);
    const eventMatch = campaignMatch ? null : matchCandidate(nameTokens, eventCandidates);
    // 4. Build folder path
    const placementFolder = PLACEMENT_FOLDER[placement];
    let folder;
    if (campaignMatch) {
        folder = `${titleCase(campaignMatch.name)}/${placementFolder}`;
    } else if (eventMatch) {
        folder = `${titleCase(eventMatch.name)}/${placementFolder}`;
    } else {
        folder = placementFolder;
    }
    // 5. Build labels
    const labels = [];
    if (placement !== "both") labels.push(placement);
    if (isVideo) labels.push("video");
    if (campaignMatch) labels.push(titleCase(campaignMatch.name));
    else if (eventMatch) labels.push(titleCase(eventMatch.name));
    if (width && height) labels.push(`${width}x${height}`);
    return {
        placement,
        folder,
        labels,
        width,
        height,
        campaignId: campaignMatch?.id ?? null,
        campaignName: campaignMatch ? titleCase(campaignMatch.name) : null
    };
}
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[project]/src/lib/asset-storage.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buildStoragePath",
    ()=>buildStoragePath,
    "insertAssetRow",
    ()=>insertAssetRow,
    "uploadToAssetStorage",
    ()=>uploadToAssetStorage
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto [external] (crypto, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cloud$2d$import$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/cloud-import.ts [app-route] (ecmascript)");
;
;
;
const BUCKET = "ad-assets";
function buildStoragePath(clientSlug, fileName) {
    const uid = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["randomUUID"])().slice(0, 8);
    const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
    return `${clientSlug}/${uid}_${safeName}`;
}
async function uploadToAssetStorage(clientSlug, fileName, buffer, contentType) {
    if (!__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"]) throw new Error("DB not configured");
    const storagePath = buildStoragePath(clientSlug, fileName);
    const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"].storage.from(BUCKET).upload(storagePath, buffer, {
        contentType,
        upsert: false
    });
    if (error) throw new Error(`Storage upload failed: ${error.message}`);
    const { data } = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"].storage.from(BUCKET).getPublicUrl(storagePath);
    return {
        storagePath,
        publicUrl: data.publicUrl
    };
}
async function insertAssetRow(params) {
    if (!__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"]) throw new Error("DB not configured");
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"].from("ad_assets").insert({
        client_slug: params.clientSlug,
        file_name: params.fileName,
        storage_path: params.storagePath,
        public_url: params.publicUrl,
        media_type: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cloud$2d$import$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["mediaTypeFromMime"])(params.mimeType),
        uploaded_by: params.uploadedBy,
        source_url: params.sourceUrl,
        status: "new",
        ...params.placement && {
            placement: params.placement
        },
        ...params.folder && {
            folder: params.folder
        },
        ...params.labels?.length && {
            labels: params.labels
        },
        ...params.width != null && {
            width: params.width
        },
        ...params.height != null && {
            height: params.height
        }
    }).select().single();
    if (error) throw new Error(error.message);
    return data;
}
}),
"[project]/src/lib/member-access.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getMemberAccessForSlug",
    ()=>getMemberAccessForSlug,
    "getMemberships",
    ()=>getMemberships,
    "getScopeFilter",
    ()=>getScopeFilter
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase.ts [app-route] (ecmascript)");
;
;
async function getMemberships(clerkUserId) {
    if (!__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"]) return [];
    const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"].from("client_members").select("id, client_id, role, scope, clients(slug, name)").eq("clerk_user_id", clerkUserId);
    if (!data?.length) return [];
    return data.map((row)=>{
        const client = row.clients;
        return {
            memberId: row.id,
            clientId: row.client_id,
            clientSlug: client.slug,
            clientName: client.name,
            role: row.role,
            scope: row.scope
        };
    });
}
const getMemberAccessForSlug = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cache"])(async function getMemberAccessForSlug(clerkUserId, slug) {
    if (!__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"]) return null;
    // Look up client by slug first
    const { data: client } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"].from("clients").select("id, slug, name").eq("slug", slug).single();
    if (!client) return null;
    // Find the membership for this user + client
    const { data: row } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"].from("client_members").select("id, client_id, role, scope").eq("clerk_user_id", clerkUserId).eq("client_id", client.id).single();
    if (!row) return null;
    const access = {
        memberId: row.id,
        clientId: row.client_id,
        clientSlug: client.slug,
        clientName: client.name,
        role: row.role,
        scope: row.scope,
        allowedCampaignIds: null,
        allowedEventIds: null
    };
    if (access.scope === "assigned") {
        const [campaignsRes, eventsRes] = await Promise.all([
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"].from("client_member_campaigns").select("campaign_id").eq("member_id", access.memberId),
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"].from("client_member_events").select("event_id").eq("member_id", access.memberId)
        ]);
        access.allowedCampaignIds = (campaignsRes.data ?? []).map((r)=>r.campaign_id);
        access.allowedEventIds = (eventsRes.data ?? []).map((r)=>r.event_id);
    }
    return access;
});
async function getScopeFilter(userId, slug, isAdmin) {
    if (!userId || isAdmin) return undefined;
    const access = await getMemberAccessForSlug(userId, slug);
    if (access?.scope !== "assigned") return undefined;
    return {
        allowedCampaignIds: access.allowedCampaignIds,
        allowedEventIds: access.allowedEventIds
    };
}
}),
"[project]/src/features/assets/server.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ALLOWED_ASSET_TYPES",
    ()=>ALLOWED_ASSET_TYPES,
    "MAX_ASSET_FILE_SIZE",
    ()=>MAX_ASSET_FILE_SIZE,
    "assetMatchesScopedCampaigns",
    ()=>assetMatchesScopedCampaigns,
    "canAccessClientAssets",
    ()=>canAccessClientAssets,
    "deleteAssetById",
    ()=>deleteAssetById,
    "getAssetClientSlug",
    ()=>getAssetClientSlug,
    "getAssetOperatingData",
    ()=>getAssetOperatingData,
    "getAssetRecordById",
    ()=>getAssetRecordById,
    "getClientAssetScope",
    ()=>getClientAssetScope,
    "importAssetsFromFolder",
    ()=>importAssetsFromFolder,
    "listAssetLibrary",
    ()=>listAssetLibrary,
    "listAssets",
    ()=>listAssets,
    "listCampaignAssets",
    ()=>listCampaignAssets,
    "listVisibleAssetIdsForScope",
    ()=>listVisibleAssetIdsForScope,
    "updateAsset",
    ()=>updateAsset,
    "uploadAssetFile",
    ()=>uploadAssetFile,
    "userFacingImportError",
    ()=>userFacingImportError,
    "validateAssetFile",
    ()=>validateAssetFile
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$app$2d$router$2f$server$2f$currentUser$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@clerk/nextjs/dist/esm/app-router/server/currentUser.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cloud$2d$import$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/cloud-import.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$asset$2d$classifier$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/asset-classifier.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$asset$2d$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/asset-storage.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$campaign$2d$client$2d$assignment$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/campaign-client-assignment.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$member$2d$access$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/member-access.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase.ts [app-route] (ecmascript)");
;
;
;
;
;
;
;
const CONCURRENCY = 4;
const MAX_ASSET_FILE_SIZE = 50 * 1024 * 1024;
const ALLOWED_ASSET_TYPES = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "video/mp4",
    "video/quicktime",
    "video/x-msvideo",
    "video/x-matroska"
]);
const ASSET_SELECT = "id, file_name, public_url, media_type, placement, format, folder, labels, status, created_at, width, height";
const ASSET_OPERATING_SELECT = `${ASSET_SELECT}, client_slug, source_url, uploaded_by, storage_path`;
async function canAccessClientAssets(userId, clientSlug) {
    const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$app$2d$router$2f$server$2f$currentUser$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["currentUser"])();
    const meta = user?.publicMetadata ?? {};
    if (meta.role === "admin") return true;
    return !!await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$member$2d$access$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getMemberAccessForSlug"])(userId, clientSlug);
}
async function getClientAssetScope(userId, clientSlug) {
    const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$app$2d$router$2f$server$2f$currentUser$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["currentUser"])();
    const meta = user?.publicMetadata ?? {};
    if (meta.role === "admin") return undefined;
    const access = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$member$2d$access$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getMemberAccessForSlug"])(userId, clientSlug);
    if (access?.scope !== "assigned") return undefined;
    return {
        allowedCampaignIds: access.allowedCampaignIds,
        allowedEventIds: access.allowedEventIds
    };
}
function mapAssetOperatingRecordToAssetRow(asset) {
    return {
        id: asset.id,
        file_name: asset.file_name,
        public_url: asset.public_url,
        media_type: asset.media_type,
        placement: asset.placement,
        format: asset.format,
        folder: asset.folder,
        labels: asset.labels,
        status: asset.status,
        created_at: asset.created_at,
        width: asset.width,
        height: asset.height
    };
}
function filterCampaignsForScope(campaigns, scope) {
    if (!scope?.allowedCampaignIds && !scope?.allowedEventIds) {
        return null;
    }
    const allowedCampaignIds = new Set(scope.allowedCampaignIds ?? []);
    const allowedEventIds = new Set(scope.allowedEventIds ?? []);
    if (allowedCampaignIds.size === 0 && allowedEventIds.size === 0) {
        return [];
    }
    return campaigns.filter((campaign)=>{
        if (allowedCampaignIds.has(campaign.campaignId)) return true;
        if (campaign.eventId && allowedEventIds.has(campaign.eventId)) return true;
        return false;
    });
}
function assetMatchesScopedCampaigns(asset, campaigns) {
    if (campaigns === null) return true;
    if (campaigns.length === 0) return false;
    return campaigns.some((campaign)=>assetMatchesCampaignName(asset, campaign.name));
}
async function listClientCampaignsForAssets(clientSlug) {
    const rows = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$campaign$2d$client$2d$assignment$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["listEffectiveCampaignRowsForClientSlug"])("campaign_id, client_slug, name, tm_event_id", clientSlug);
    return rows.map((row)=>({
            campaignId: row.campaign_id,
            eventId: row.tm_event_id ?? null,
            name: row.name ?? null
        }));
}
async function getAssetReadContext(clientSlug) {
    if (!__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"]) return null;
    if (!clientSlug) {
        return {
            db: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"],
            usesClerkScopedReads: false
        };
    }
    try {
        const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$app$2d$router$2f$server$2f$currentUser$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["currentUser"])();
        const meta = user?.publicMetadata ?? {};
        if (meta.role === "admin") {
            return {
                db: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"],
                usesClerkScopedReads: false
            };
        }
    } catch  {
        return {
            db: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"],
            usesClerkScopedReads: false
        };
    }
    const userScopedClient = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createClerkSupabaseClient"])();
    if (!userScopedClient) {
        return {
            db: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"],
            usesClerkScopedReads: false
        };
    }
    return {
        db: userScopedClient,
        usesClerkScopedReads: true
    };
}
async function listVisibleAssetIdsForScope(clientSlug, assetIds, scope) {
    if (!__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"]) throw new Error("DB not configured");
    if (!scope?.allowedCampaignIds && !scope?.allowedEventIds) {
        return null;
    }
    if (assetIds.length === 0) {
        return new Set();
    }
    const scopedCampaigns = filterCampaignsForScope(await listClientCampaignsForAssets(clientSlug), scope);
    if (!scopedCampaigns || scopedCampaigns.length === 0) {
        return new Set();
    }
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"].from("ad_assets").select("id, folder, labels").eq("client_slug", clientSlug).in("id", assetIds);
    if (error) throw new Error(error.message);
    return new Set((data ?? []).filter((asset)=>assetMatchesScopedCampaigns({
            folder: asset.folder ?? null,
            labels: asset.labels ?? null
        }, scopedCampaigns)).map((asset)=>String(asset.id)));
}
async function listAssets(clientSlug, scope) {
    const readContext = await getAssetReadContext(clientSlug);
    if (!readContext) throw new Error("DB not configured");
    const [assetsRes, campaigns] = await Promise.all([
        readContext.db.from("ad_assets").select(ASSET_OPERATING_SELECT).eq("client_slug", clientSlug).order("created_at", {
            ascending: false
        }),
        listClientCampaignsForAssets(clientSlug)
    ]);
    const { data, error } = assetsRes;
    if (error) throw new Error(error.message);
    const scopedCampaigns = filterCampaignsForScope(campaigns, scope);
    return (data ?? []).filter((asset)=>assetMatchesScopedCampaigns(asset, scopedCampaigns)).map((asset)=>mapAssetOperatingRecordToAssetRow(asset));
}
async function getAssetRecordById(assetId, db = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"]) {
    if (!db) throw new Error("DB not configured");
    const { data, error } = await db.from("ad_assets").select(ASSET_OPERATING_SELECT).eq("id", assetId).maybeSingle();
    if (error) throw new Error(error.message);
    return data ?? null;
}
function normalizeCampaignName(value) {
    return (value ?? "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}
function assetNameTokens(asset) {
    const tokens = new Set();
    const folderRoot = typeof asset.folder === "string" && asset.folder.length > 0 ? asset.folder.split("/")[0] : null;
    const normalizedFolder = normalizeCampaignName(folderRoot);
    if (normalizedFolder) tokens.add(normalizedFolder);
    if (Array.isArray(asset.labels)) {
        for (const label of asset.labels){
            const normalized = normalizeCampaignName(label);
            if (normalized) tokens.add(normalized);
        }
    }
    return tokens;
}
function assetMatchesCampaignName(asset, campaignName) {
    const normalizedCampaign = normalizeCampaignName(campaignName);
    if (!normalizedCampaign) return false;
    return assetNameTokens(asset).has(normalizedCampaign);
}
function toNullableNumber(value) {
    if (typeof value === "number") return value;
    if (typeof value === "string" && value.length > 0) {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : null;
    }
    return null;
}
function summarizeCampaignMatches(matches) {
    const counts = new Map();
    for (const match of matches){
        if (!match.campaignId || !match.campaignName) continue;
        const existing = counts.get(match.campaignId);
        if (existing) {
            existing.count += 1;
            continue;
        }
        counts.set(match.campaignId, {
            campaignId: match.campaignId,
            campaignName: match.campaignName,
            count: 1
        });
    }
    return Array.from(counts.values()).sort((a, b)=>b.count - a.count);
}
async function listAssetLibrary(clientSlug, limit = 72, scope) {
    const readContext = await getAssetReadContext(clientSlug);
    if (!readContext || !__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"]) throw new Error("DB not configured");
    let assetsQuery = readContext.db.from("ad_assets").select(ASSET_OPERATING_SELECT).order("created_at", {
        ascending: false
    }).limit(limit);
    if (clientSlug) {
        assetsQuery = assetsQuery.eq("client_slug", clientSlug);
    }
    const campaignsQuery = clientSlug ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$campaign$2d$client$2d$assignment$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["listEffectiveCampaignRowsForClientSlug"])("campaign_id, client_slug, name, tm_event_id", clientSlug) : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"].from("meta_campaigns").select("campaign_id, client_slug, name, tm_event_id").limit(600).then(async ({ data, error })=>{
        if (error) throw new Error(error.message);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$campaign$2d$client$2d$assignment$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["applyEffectiveCampaignClientSlugs"])(data ?? []);
    });
    const [assetsRes, campaignsRes] = await Promise.all([
        assetsQuery,
        campaignsQuery
    ]);
    if (assetsRes.error) throw new Error(assetsRes.error.message);
    const campaignsBySlug = new Map();
    for (const row of campaignsRes ?? []){
        const slug = row.client_slug;
        if (!slug) continue;
        const existing = campaignsBySlug.get(slug) ?? [];
        existing.push({
            campaignId: row.campaign_id,
            eventId: row.tm_event_id ?? null,
            name: row.name ?? null
        });
        campaignsBySlug.set(slug, existing);
    }
    const scopedCampaigns = clientSlug && scope ? filterCampaignsForScope(campaignsBySlug.get(clientSlug) ?? [], scope) : null;
    return (assetsRes.data ?? []).filter((asset)=>clientSlug ? assetMatchesScopedCampaigns(asset, scopedCampaigns) : true).map((asset)=>{
        const linkedCampaigns = (campaignsBySlug.get(asset.client_slug) ?? []).filter((campaign)=>assetMatchesCampaignName(asset, campaign.name));
        return {
            asset,
            linkedCampaignCount: linkedCampaigns.length,
            linkedCampaignNames: linkedCampaigns.map((campaign)=>campaign.name).filter((name)=>typeof name === "string" && name.length > 0).slice(0, 3)
        };
    });
}
async function getAssetOperatingData(assetId, explicitCampaignIds = [], scope, clientSlug) {
    const readContext = await getAssetReadContext(clientSlug);
    if (!readContext) throw new Error("DB not configured");
    const asset = await getAssetRecordById(assetId, readContext.db);
    if (!asset) return null;
    if (clientSlug && asset.client_slug !== clientSlug) return null;
    if (!__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"]) throw new Error("DB not configured");
    const explicitIds = new Set(explicitCampaignIds);
    const campaignRows = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$campaign$2d$client$2d$assignment$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["listEffectiveCampaignRowsForClientSlug"])("campaign_id, client_slug, name, status, spend, roas, impressions, clicks, tm_event_id", asset.client_slug);
    const campaigns = campaignRows.map((row)=>({
            campaignId: row.campaign_id,
            clicks: toNullableNumber(row.clicks),
            eventId: row.tm_event_id ?? null,
            impressions: toNullableNumber(row.impressions),
            name: row.name ?? null,
            roas: toNullableNumber(row.roas),
            spend: toNullableNumber(row.spend),
            status: row.status ?? "unknown"
        }));
    const scopedCampaigns = filterCampaignsForScope(campaigns.map((campaign)=>({
            campaignId: campaign.campaignId,
            eventId: campaign.eventId,
            name: campaign.name
        })), scope);
    if (!assetMatchesScopedCampaigns(asset, scopedCampaigns)) {
        return null;
    }
    const linkedCampaigns = campaigns.filter((row)=>{
        if (scopedCampaigns && !scopedCampaigns.some((campaign)=>campaign.campaignId === row.campaignId)) {
            return false;
        }
        return explicitIds.has(row.campaignId) || assetMatchesCampaignName(asset, row.name);
    }).map((row)=>({
            campaignId: row.campaignId,
            name: row.name ?? row.campaignId,
            status: row.status,
            spend: row.spend,
            roas: row.roas,
            impressions: row.impressions,
            clicks: row.clicks
        })).sort((a, b)=>a.name.localeCompare(b.name));
    return {
        asset,
        linkedCampaigns
    };
}
async function listCampaignAssets(clientSlug, campaignName, limit = 8) {
    const readContext = await getAssetReadContext(clientSlug);
    if (!readContext) throw new Error("DB not configured");
    const normalizedCampaign = normalizeCampaignName(campaignName);
    if (!normalizedCampaign) return [];
    const { data, error } = await readContext.db.from("ad_assets").select(ASSET_SELECT).eq("client_slug", clientSlug).order("created_at", {
        ascending: false
    }).limit(Math.max(limit * 6, 48));
    if (error) throw new Error(error.message);
    return (data ?? []).filter((row)=>{
        const folderRoot = normalizeCampaignName(typeof row.folder === "string" ? row.folder.split("/")[0] : null);
        const labels = Array.isArray(row.labels) ? row.labels.map((label)=>normalizeCampaignName(label)) : [];
        return folderRoot === normalizedCampaign || labels.includes(normalizedCampaign);
    }).slice(0, limit);
}
function validateAssetFile(file) {
    if (file.size > MAX_ASSET_FILE_SIZE) {
        return "File too large. Max 50 MB.";
    }
    if (!ALLOWED_ASSET_TYPES.has(file.type)) {
        return `Unsupported file type: ${file.type}`;
    }
    return null;
}
async function uploadAssetFile({ file, clientSlug, uploadedBy, classify = false }) {
    if (!__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"]) throw new Error("DB not configured");
    const validationError = validateAssetFile(file);
    if (validationError) throw new Error(validationError);
    const buffer = Buffer.from(await file.arrayBuffer());
    const classification = classify ? await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$asset$2d$classifier$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["classifyAsset"])(file.name, buffer, file.type, clientSlug) : null;
    const { storagePath, publicUrl } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$asset$2d$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["uploadToAssetStorage"])(clientSlug, file.name, buffer, file.type);
    try {
        const asset = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$asset$2d$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["insertAssetRow"])({
            clientSlug,
            fileName: file.name,
            storagePath,
            publicUrl,
            mimeType: file.type,
            uploadedBy,
            placement: classification?.placement,
            folder: classification?.folder,
            labels: classification?.labels,
            width: classification?.width,
            height: classification?.height
        });
        return {
            asset,
            campaignId: classification?.campaignId ?? null,
            campaignName: classification?.campaignName ?? null
        };
    } catch (error) {
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"].storage.from("ad-assets").remove([
            storagePath
        ]);
        throw error;
    }
}
function userFacingImportError(raw) {
    if (/all access methods failed/i.test(raw) || /all methods exhausted/i.test(raw)) {
        return "We couldn't access this folder right now. Our team has been notified and is working on it.";
    }
    if (/not configured/i.test(raw)) {
        return "We couldn't access this folder right now. Our team has been notified and is working on it.";
    }
    if (/Could not extract folder ID/i.test(raw)) {
        return "This doesn't look like a valid folder link. Paste the full URL from your browser.";
    }
    return "Something went wrong importing this folder. Our team has been notified.";
}
async function processInBatches(items, concurrency, fn) {
    const successes = [];
    const errors = [];
    for(let index = 0; index < items.length; index += concurrency){
        const batch = items.slice(index, index + concurrency);
        const results = await Promise.allSettled(batch.map(fn));
        for (const result of results){
            if (result.status === "fulfilled") {
                successes.push(result.value);
            } else {
                errors.push(result.reason instanceof Error ? result.reason.message : String(result.reason));
            }
        }
    }
    return {
        successes,
        errors
    };
}
async function importCloudFile(file, provider, folderUrl, clientSlug, uploadedBy, classify) {
    if (!__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"]) throw new Error("DB not configured");
    const sourceKey = `${provider}:${file.downloadUrl}`;
    const { buffer, mimeType } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cloud$2d$import$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["downloadCloudFile"])(provider, folderUrl, file.downloadUrl);
    const classification = classify ? await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$asset$2d$classifier$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["classifyAsset"])(file.name, buffer, mimeType, clientSlug) : null;
    const { storagePath, publicUrl } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$asset$2d$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["uploadToAssetStorage"])(clientSlug, file.name, buffer, mimeType);
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$asset$2d$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["insertAssetRow"])({
            clientSlug,
            fileName: file.name,
            storagePath,
            publicUrl,
            mimeType,
            uploadedBy,
            sourceUrl: sourceKey,
            placement: classification?.placement,
            folder: classification?.folder,
            labels: classification?.labels,
            width: classification?.width,
            height: classification?.height
        });
    } catch (error) {
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"].storage.from("ad-assets").remove([
            storagePath
        ]);
        throw error;
    }
    return {
        fileName: file.name,
        campaignId: classification?.campaignId ?? null,
        campaignName: classification?.campaignName ?? null
    };
}
async function importAssetsFromFolder({ folderUrl, clientSlug, uploadedBy, classify = false, onListError, onImportComplete }) {
    if (!__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"]) throw new Error("DB not configured");
    const provider = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cloud$2d$import$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["detectProvider"])(folderUrl);
    if (!provider) {
        throw new Error("Unsupported URL. Paste a Dropbox or Google Drive shared folder link.");
    }
    let listing;
    try {
        listing = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cloud$2d$import$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["listCloudFolder"])(folderUrl);
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to list folder";
        await onListError?.(message, provider);
        throw new Error(message);
    }
    if (listing.files.length === 0) {
        return {
            campaignMatches: [],
            imported: 0,
            skipped: 0,
            total: 0,
            message: "No media files found in folder."
        };
    }
    const incomingKeys = listing.files.map((file)=>`${provider}:${file.downloadUrl}`);
    const { data: existing } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"].from("ad_assets").select("source_url").eq("client_slug", clientSlug).in("source_url", incomingKeys);
    const existingUrls = new Set((existing ?? []).map((row)=>row.source_url));
    const toImport = listing.files.filter((file)=>!existingUrls.has(`${provider}:${file.downloadUrl}`));
    const skipped = listing.files.length - toImport.length;
    const { successes, errors } = await processInBatches(toImport, CONCURRENCY, (file)=>importCloudFile(file, provider, folderUrl, clientSlug, uploadedBy, classify));
    const imported = successes.length;
    const campaignMatches = summarizeCampaignMatches(successes);
    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"].from("asset_sources").upsert({
        client_slug: clientSlug,
        provider,
        folder_url: folderUrl,
        last_synced_at: new Date().toISOString(),
        file_count: imported + skipped
    }, {
        onConflict: "client_slug,folder_url"
    });
    if (imported > 0) {
        await onImportComplete?.(imported);
    }
    return {
        campaignMatches,
        imported,
        skipped,
        total: listing.files.length,
        errors: errors.length > 0 ? errors : undefined
    };
}
async function updateAsset(assetId, body) {
    if (!__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"]) throw new Error("DB not configured");
    const allowed = [
        "labels",
        "placement",
        "format",
        "status",
        "used_in_campaigns"
    ];
    const updates = {};
    for (const key of allowed){
        if (key in body) updates[key] = body[key];
    }
    if (Object.keys(updates).length === 0) {
        throw new Error("No valid fields to update");
    }
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"].from("ad_assets").update(updates).eq("id", assetId).select().single();
    if (error) throw new Error(error.message);
    if (!data) throw new Error("Asset not found");
    return data;
}
async function getAssetClientSlug(assetId) {
    if (!__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"]) throw new Error("DB not configured");
    const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"].from("ad_assets").select("client_slug").eq("id", assetId).single();
    return data?.client_slug ?? null;
}
async function deleteAssetById(assetId) {
    if (!__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"]) throw new Error("DB not configured");
    const { data: asset } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"].from("ad_assets").select("client_slug, file_name, storage_path").eq("id", assetId).single();
    if (!asset) throw new Error("Asset not found");
    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"].storage.from("ad-assets").remove([
        asset.storage_path
    ]);
    const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"].from("ad_assets").delete().eq("id", assetId);
    if (error) throw new Error(error.message);
    return {
        clientSlug: asset.client_slug,
        fileName: asset.file_name,
        id: assetId
    };
}
}),
"[project]/src/features/system-events/server.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "filterSystemEventsByClientScope",
    ()=>filterSystemEventsByClientScope,
    "filterSystemEventsByScope",
    ()=>filterSystemEventsByScope,
    "getCurrentActor",
    ()=>getCurrentActor,
    "isCrmSystemEvent",
    ()=>isCrmSystemEvent,
    "listAssetSystemEvents",
    ()=>listAssetSystemEvents,
    "listCampaignSystemEvents",
    ()=>listCampaignSystemEvents,
    "listCrmSystemEvents",
    ()=>listCrmSystemEvents,
    "listEventSystemEvents",
    ()=>listEventSystemEvents,
    "listSystemEvents",
    ()=>listSystemEvents,
    "logSystemEvent",
    ()=>logSystemEvent,
    "matchesCrmContactSystemEvent",
    ()=>matchesCrmContactSystemEvent,
    "summarizeChangedFields",
    ()=>summarizeChangedFields
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$app$2d$router$2f$server$2f$currentUser$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@clerk/nextjs/dist/esm/app-router/server/currentUser.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$assets$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/assets/server.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase.ts [app-route] (ecmascript)");
;
;
;
const LEGACY_SYSTEM_EVENT_SELECT = "id, created_at, event_name, visibility, actor_type, actor_id, actor_name, client_slug, summary, detail, entity_type, entity_id, page_id, task_id, metadata";
const SYSTEM_EVENT_SELECT = `${LEGACY_SYSTEM_EVENT_SELECT}, event_version, occurred_at, source, correlation_id, causation_id, idempotency_key`;
function eventMatchesCampaign(event, campaignId) {
    if (event.entityType === "campaign" && event.entityId === campaignId) return true;
    return event.metadata.campaignId === campaignId;
}
function systemEventCampaignId(event) {
    if (event.entityType === "campaign" && event.entityId) return event.entityId;
    return typeof event.metadata.campaignId === "string" ? event.metadata.campaignId : null;
}
function eventMatchesAsset(event, assetId) {
    if (event.entityType === "asset" && event.entityId === assetId) return true;
    return event.metadata.assetId === assetId;
}
function eventMatchesEvent(event, eventId) {
    if (event.entityType === "event" && event.entityId === eventId) return true;
    return event.metadata.eventId === eventId;
}
function systemEventEventId(event) {
    if (event.entityType === "event" && event.entityId) return event.entityId;
    return typeof event.metadata.eventId === "string" ? event.metadata.eventId : null;
}
function systemEventAssetId(event) {
    if (event.entityType === "asset" && event.entityId) return event.entityId;
    return typeof event.metadata.assetId === "string" ? event.metadata.assetId : null;
}
function normalizeScopeSet(values) {
    if (values == null) return null;
    return values instanceof Set ? values : new Set(values);
}
function metadataString(metadata, key) {
    const value = metadata?.[key];
    return typeof value === "string" && value.length > 0 ? value : null;
}
function normalizeOccurredAt(value) {
    if (value == null) return new Date().toISOString();
    return value instanceof Date ? value.toISOString() : value;
}
function agentTaskEventId(input, metadata) {
    if (input.eventName !== "agent_action_requested") return null;
    if (input.entityType === "agent_task" && input.entityId) return input.entityId;
    return input.taskId ?? metadataString(metadata, "taskId");
}
function resolveEventSource(input, metadata) {
    return input.source ?? metadataString(metadata, "source") ?? "app";
}
function resolveCorrelationId(input, metadata) {
    return input.correlationId ?? metadataString(metadata, "correlationId") ?? agentTaskEventId(input, metadata);
}
function resolveCausationId(input, metadata) {
    return input.causationId ?? metadataString(metadata, "causationId");
}
function resolveIdempotencyKey(input, metadata) {
    const explicit = input.idempotencyKey ?? metadataString(metadata, "idempotencyKey");
    if (explicit) return explicit;
    const agentTaskId = agentTaskEventId(input, metadata);
    return agentTaskId ? `${input.eventName}:${agentTaskId}` : null;
}
function isEnvelopeSchemaError(error) {
    if (!error) return false;
    const text = `${error.message ?? ""} ${error.details ?? ""}`;
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return [
        "event_version",
        "occurred_at",
        "source",
        "correlation_id",
        "causation_id",
        "idempotency_key"
    ].some((field)=>text.includes(field));
}
function isSystemEventIdempotencyConflict(error) {
    if (!error) return false;
    return error.code === "23505" && (error.message?.includes("idx_system_events_source_idempotency_key") ?? false);
}
function mapSystemEventRow(row) {
    return {
        id: row.id,
        createdAt: row.created_at,
        occurredAt: row.occurred_at ?? row.created_at,
        eventName: row.event_name,
        eventVersion: row.event_version ?? 1,
        visibility: row.visibility,
        actorType: row.actor_type,
        actorId: row.actor_id ?? null,
        actorName: row.actor_name ?? null,
        clientSlug: row.client_slug ?? null,
        source: row.source ?? "app",
        summary: row.summary,
        detail: row.detail ?? null,
        entityType: row.entity_type ?? null,
        entityId: row.entity_id ?? null,
        pageId: row.page_id ?? null,
        taskId: row.task_id ?? null,
        correlationId: row.correlation_id ?? null,
        causationId: row.causation_id ?? null,
        idempotencyKey: row.idempotency_key ?? null,
        metadata: row.metadata ?? {}
    };
}
function buildSystemEventsQuery(db, selectClause, options) {
    let query = db.from("system_events").select(selectClause).order("created_at", {
        ascending: false
    }).limit(options.limit ?? 12);
    if (options.clientSlug) {
        query = query.eq("client_slug", options.clientSlug);
    }
    if (options.entityType) {
        query = query.eq("entity_type", options.entityType);
    }
    if (options.entityId) {
        query = query.eq("entity_id", options.entityId);
    }
    if (options.audience && options.audience !== "all") {
        query = query.eq("visibility", options.audience);
    }
    return query;
}
async function getSystemEventsReadClient(options) {
    if (!__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"]) return null;
    if (!options.clientSlug) return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"];
    try {
        const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$app$2d$router$2f$server$2f$currentUser$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["currentUser"])();
        const role = user?.publicMetadata?.role;
        if (role === "admin") {
            return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"];
        }
    } catch  {
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"];
    }
    return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createClerkSupabaseClient"])() ?? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"];
}
function isCrmSystemEvent(event) {
    return event.entityType === "crm_contact" || event.entityType === "crm_comment" || event.entityType === "crm_follow_up_item" || event.metadata.crmContactId != null;
}
function matchesCrmContactSystemEvent(event, contactId) {
    if (event.entityType === "crm_contact" && event.entityId === contactId) return true;
    return event.metadata.crmContactId === contactId;
}
function filterSystemEventsByScope(events, scope) {
    const campaignIds = normalizeScopeSet(scope?.allowedCampaignIds ?? null);
    const eventIds = normalizeScopeSet(scope?.allowedEventIds ?? null);
    const assetIds = normalizeScopeSet(scope?.allowedAssetIds ?? null);
    if (!campaignIds && !eventIds && !assetIds) return events;
    return events.filter((event)=>{
        const campaignId = systemEventCampaignId(event);
        const eventId = systemEventEventId(event);
        const assetId = systemEventAssetId(event);
        if (!campaignId && !eventId && !assetId) return true;
        if (campaignId && campaignIds?.has(campaignId)) return true;
        if (eventId && eventIds?.has(eventId)) return true;
        if (assetId && assetIds?.has(assetId)) return true;
        return false;
    });
}
async function filterSystemEventsByClientScope(clientSlug, events, scope) {
    const assetIds = events.map((event)=>systemEventAssetId(event)).filter((assetId)=>assetId != null);
    const allowedAssetIds = scope && (scope.allowedCampaignIds != null || scope.allowedEventIds != null) ? await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$assets$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["listVisibleAssetIdsForScope"])(clientSlug, assetIds, {
        allowedCampaignIds: scope.allowedCampaignIds ?? null,
        allowedEventIds: scope.allowedEventIds ?? null
    }) : null;
    return filterSystemEventsByScope(events, {
        allowedCampaignIds: scope?.allowedCampaignIds ?? null,
        allowedEventIds: scope?.allowedEventIds ?? null,
        allowedAssetIds
    });
}
function toActorName(user) {
    if (!user) return null;
    if (user.fullName) return user.fullName;
    const name = [
        user.firstName,
        user.lastName
    ].filter(Boolean).join(" ").trim();
    if (name) return name;
    return user.emailAddresses[0]?.emailAddress ?? user.username ?? null;
}
async function resolveActor(input) {
    if (input.actorName && (input.actorId || input.actorType)) {
        return {
            actorId: input.actorId ?? null,
            actorName: input.actorName,
            actorType: input.actorType ?? "user"
        };
    }
    const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$app$2d$router$2f$server$2f$currentUser$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["currentUser"])();
    return {
        actorId: input.actorId ?? user?.id ?? null,
        actorName: input.actorName ?? toActorName(user),
        actorType: input.actorType ?? "user"
    };
}
async function getCurrentActor(input = {}) {
    return resolveActor(input);
}
async function logSystemEvent(input) {
    if (!__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"]) return;
    const actor = await resolveActor(input);
    const metadata = input.metadata ?? {};
    const row = {
        event_name: input.eventName,
        event_version: input.eventVersion ?? 1,
        occurred_at: normalizeOccurredAt(input.occurredAt),
        visibility: input.visibility ?? "shared",
        actor_type: actor.actorType,
        actor_id: actor.actorId,
        actor_name: actor.actorName,
        client_slug: input.clientSlug ?? null,
        source: resolveEventSource(input, metadata),
        summary: input.summary,
        detail: input.detail ?? null,
        entity_type: input.entityType ?? null,
        entity_id: input.entityId ?? null,
        page_id: input.pageId ?? null,
        task_id: input.taskId ?? null,
        correlation_id: resolveCorrelationId(input, metadata),
        causation_id: resolveCausationId(input, metadata),
        idempotency_key: resolveIdempotencyKey(input, metadata),
        metadata
    };
    let { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"].from("system_events").insert(row);
    if (isSystemEventIdempotencyConflict(error)) {
        return;
    }
    if (isEnvelopeSchemaError(error)) {
        const legacyRow = {
            event_name: row.event_name,
            visibility: row.visibility,
            actor_type: row.actor_type,
            actor_id: row.actor_id,
            actor_name: row.actor_name,
            client_slug: row.client_slug,
            summary: row.summary,
            detail: row.detail,
            entity_type: row.entity_type,
            entity_id: row.entity_id,
            page_id: row.page_id,
            task_id: row.task_id,
            metadata: row.metadata
        };
        const legacyInsert = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"].from("system_events").insert(legacyRow);
        error = legacyInsert.error;
    }
    if (error) {
        console.error("[system-events] Failed to write event:", error.message);
    }
}
async function listSystemEvents(options = {}) {
    const eventReadDb = await getSystemEventsReadClient(options);
    if (!eventReadDb) return [];
    let { data, error } = await buildSystemEventsQuery(eventReadDb, SYSTEM_EVENT_SELECT, options);
    if (isEnvelopeSchemaError(error)) {
        const legacyResult = await buildSystemEventsQuery(eventReadDb, LEGACY_SYSTEM_EVENT_SELECT, options);
        data = legacyResult.data;
        error = legacyResult.error;
    }
    if (error) {
        console.error("[system-events] Failed to list events:", error.message);
        return [];
    }
    return (data ?? []).map((row)=>mapSystemEventRow(row));
}
async function listCampaignSystemEvents(options) {
    const events = await listSystemEvents({
        audience: options.audience,
        clientSlug: options.clientSlug,
        limit: Math.max((options.limit ?? 8) * 6, 24)
    });
    return events.filter((event)=>eventMatchesCampaign(event, options.campaignId)).slice(0, options.limit ?? 8);
}
async function listCrmSystemEvents(options = {}) {
    const events = await listSystemEvents({
        audience: options.audience,
        clientSlug: options.clientSlug,
        limit: Math.max((options.limit ?? 8) * 6, 24)
    });
    return events.filter((event)=>{
        if (!isCrmSystemEvent(event)) return false;
        if (!options.contactId) return true;
        return matchesCrmContactSystemEvent(event, options.contactId);
    }).slice(0, options.limit ?? 8);
}
async function listAssetSystemEvents(options) {
    const events = await listSystemEvents({
        audience: options.audience,
        clientSlug: options.clientSlug,
        limit: Math.max((options.limit ?? 8) * 6, 24)
    });
    return events.filter((event)=>eventMatchesAsset(event, options.assetId)).slice(0, options.limit ?? 8);
}
async function listEventSystemEvents(options) {
    const events = await listSystemEvents({
        audience: options.audience,
        clientSlug: options.clientSlug,
        limit: Math.max((options.limit ?? 8) * 6, 24)
    });
    return events.filter((event)=>eventMatchesEvent(event, options.eventId)).slice(0, options.limit ?? 8);
}
function summarizeChangedFields(fields) {
    if (fields.length === 0) return null;
    if (fields.length === 1) return `Changed ${fields[0]}.`;
    if (fields.length === 2) return `Changed ${fields[0]} and ${fields[1]}.`;
    return `Changed ${fields.slice(0, -1).join(", ")}, and ${fields.at(-1)}.`;
}
}),
"[project]/config/whatsapp-client-routing.json (json)", ((__turbopack_context__) => {

__turbopack_context__.v([{"clientSlug":"zamora","discordChannel":"zamora","agentKey":"customer-whatsapp-agent","threadPrefix":"Zamora"},{"clientSlug":"kybba","discordChannel":"kybba","agentKey":"customer-whatsapp-agent","threadPrefix":"KYBBA"},{"clientSlug":"don_omar","discordChannel":"don-omar-tickets","agentKey":"customer-whatsapp-agent","threadPrefix":"Don Omar"},{"clientSlug":"don_omar_bcn","discordChannel":"don-omar-tickets","agentKey":"customer-whatsapp-agent","threadPrefix":"Don Omar BCN"}]);}),
"[project]/src/features/whatsapp/server.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "WHATSAPP_GRAPH_API_VERSION",
    ()=>WHATSAPP_GRAPH_API_VERSION,
    "buildWhatsAppMessagePreview",
    ()=>buildWhatsAppMessagePreview,
    "extractWhatsAppWebhookBatches",
    ()=>extractWhatsAppWebhookBatches,
    "ingestTwilioWebhook",
    ()=>ingestTwilioWebhook,
    "ingestWhatsAppWebhook",
    ()=>ingestWhatsAppWebhook,
    "normalizeWaId",
    ()=>normalizeWaId,
    "parseTwilioWebhookPayload",
    ()=>parseTwilioWebhookPayload,
    "sendWhatsAppTextMessage",
    ()=>sendWhatsAppTextMessage,
    "shouldAutoAcknowledgeWhatsAppInbound",
    ()=>shouldAutoAcknowledgeWhatsAppInbound,
    "verifyTwilioWebhookSignature",
    ()=>verifyTwilioWebhookSignature,
    "verifyWhatsAppWebhookSignature",
    ()=>verifyWhatsAppWebhookSignature
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:crypto [external] (node:crypto, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$system$2d$events$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/system-events/server.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$config$2f$whatsapp$2d$client$2d$routing$2e$json__$28$json$29$__ = __turbopack_context__.i("[project]/config/whatsapp-client-routing.json (json)");
;
;
;
;
const WHATSAPP_GRAPH_API_VERSION = process.env.WHATSAPP_CLOUD_API_VERSION ?? "v23.0";
const WHATSAPP_AGENT_KEY = "customer-whatsapp-agent";
const WHATSAPP_SYSTEM_ACTORS = {
    "meta-cloud": {
        actorId: "whatsapp-cloud",
        actorName: "WhatsApp Cloud API",
        actorType: "system"
    },
    twilio: {
        actorId: "whatsapp-twilio",
        actorName: "Twilio WhatsApp",
        actorType: "system"
    }
};
const ROUTES_BY_CLIENT_SLUG = new Map(__TURBOPACK__imported__module__$5b$project$5d2f$config$2f$whatsapp$2d$client$2d$routing$2e$json__$28$json$29$__["default"].map((route)=>[
        route.clientSlug,
        route
    ]));
function normalizeDigits(value) {
    if (!value) return null;
    const digits = value.replace(/\D/g, "");
    return digits.length > 0 ? digits : null;
}
function parseMetadataRecord(value) {
    return value && typeof value === "object" ? value : {};
}
function parseConversationAccessStatus(metadata) {
    const access = parseMetadataRecord(parseMetadataRecord(metadata).access);
    return typeof access.status === "string" ? access.status : null;
}
function parseConversationChatKind(metadata) {
    const chat = parseMetadataRecord(parseMetadataRecord(metadata).chat);
    return typeof chat.kind === "string" ? chat.kind : null;
}
function isOwnerNumber(waId) {
    const normalized = normalizeDigits(waId);
    if (!normalized) return false;
    const configured = (process.env.WHATSAPP_OWNER_NUMBERS ?? "").split(",").map((value)=>normalizeDigits(value)).filter((value)=>Boolean(value));
    return configured.includes(normalized);
}
function parseOwnerControlText(text) {
    const trimmed = text?.trim();
    if (!trimmed) return null;
    const match = trimmed.match(/^(?:!|\/)(boss|whatsapp)\b[:\s-]*(.*)$/i);
    if (!match) return null;
    const command = match[2]?.trim();
    return command && command.length > 0 ? command : null;
}
function autoAckCooldownMs() {
    const raw = Number(process.env.WHATSAPP_AUTO_ACK_COOLDOWN_SECONDS ?? "45");
    const seconds = Number.isFinite(raw) && raw > 0 ? raw : 45;
    return seconds * 1000;
}
function autoAckDelayMs() {
    const raw = Number(process.env.WHATSAPP_AUTO_ACK_DELAY_MS ?? "1500");
    return Number.isFinite(raw) && raw >= 0 ? raw : 1500;
}
function shouldUseTwilioTypingIndicator() {
    return process.env.TWILIO_WHATSAPP_TYPING_INDICATOR === "true";
}
function shouldAutoAcknowledgeWhatsAppInbound(input) {
    if (input.mode !== "live") return false;
    if ((input.accessStatus ?? "pending") !== "approved") return false;
    if ((input.chatKind ?? "direct") !== "direct") return false;
    if (isOwnerNumber(input.waId) && parseOwnerControlText(input.textBody)) {
        return false;
    }
    if (input.lastOutboundMessageAt) {
        const lastOutbound = new Date(input.lastOutboundMessageAt).getTime();
        if (Number.isFinite(lastOutbound) && Date.now() - lastOutbound < autoAckCooldownMs()) {
            return false;
        }
    }
    return true;
}
function buildAutomaticAckText() {
    const configured = process.env.WHATSAPP_AUTO_ACK_TEXT?.trim();
    return configured && configured.length > 0 ? configured : "Got it. Working on it now.";
}
function normalizeWaId(value) {
    return normalizeDigits(value);
}
function toIsoTimestamp(value) {
    if (!value) return null;
    const numeric = Number(value);
    if (!Number.isFinite(numeric) || numeric <= 0) return null;
    return new Date(numeric * 1000).toISOString();
}
function safeEqual(left, right) {
    const leftBuffer = Buffer.from(left);
    const rightBuffer = Buffer.from(right);
    if (leftBuffer.length !== rightBuffer.length) return false;
    return (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["timingSafeEqual"])(leftBuffer, rightBuffer);
}
function normalizeE164(value) {
    const digits = normalizeDigits(value);
    return digits ? `+${digits}` : null;
}
function normalizeWhatsAppAddress(value) {
    if (!value) return null;
    const trimmed = value.trim();
    if (trimmed.startsWith("whatsapp:")) {
        return normalizeE164(trimmed.slice("whatsapp:".length));
    }
    return normalizeE164(trimmed);
}
function toWhatsAppAddress(value) {
    const e164 = normalizeWhatsAppAddress(value);
    if (!e164) {
        throw new Error("WhatsApp phone number is missing or invalid.");
    }
    return `whatsapp:${e164}`;
}
function transportMetadata(input) {
    return {
        ...input.metadata ?? {},
        transport: input.transport ?? "meta-cloud"
    };
}
function getAccountTransport(account) {
    const transport = account.metadata?.transport;
    return transport === "twilio" ? "twilio" : "meta-cloud";
}
function getSystemActor(transport) {
    return WHATSAPP_SYSTEM_ACTORS[transport];
}
function buildTwilioValidationUrl(requestUrl) {
    const publicBase = ("TURBOPACK compile-time value", "https://fe88-2600-1702-4fb0-b050-bcfe-1303-100a-5539.ngrok-free.app");
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const url = new URL(requestUrl);
    return new URL(`${url.pathname}${url.search}`, publicBase).toString();
}
function buildTwilioSignaturePayload(url, params) {
    const entries = [
        ...params.entries()
    ].sort(([leftKey], [rightKey])=>leftKey.localeCompare(rightKey));
    return entries.reduce((payload, [key, value])=>payload + key + value, url);
}
function firstJoinedRow(value) {
    if (Array.isArray(value)) {
        const row = value[0];
        return row && typeof row === "object" ? row : {};
    }
    return value && typeof value === "object" ? value : {};
}
function verifyWhatsAppWebhookSignature(body, signatureHeader) {
    const secret = process.env.WHATSAPP_APP_SECRET;
    if (!secret) return true;
    if (!signatureHeader) return false;
    const expected = `sha256=${(0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["createHmac"])("sha256", secret).update(body).digest("hex")}`;
    return safeEqual(expected, signatureHeader);
}
function verifyTwilioWebhookSignature(requestUrl, params, signatureHeader) {
    if (process.env.TWILIO_VALIDATE_SIGNATURE === "false") {
        return true;
    }
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    if (!authToken) return true;
    if (!signatureHeader) return false;
    const payload = buildTwilioSignaturePayload(buildTwilioValidationUrl(requestUrl), params);
    const expected = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["createHmac"])("sha1", authToken).update(payload).digest("base64");
    return safeEqual(expected, signatureHeader);
}
function getTextFromMessage(message) {
    if (typeof message.text?.body === "string" && message.text.body.trim().length > 0) {
        return message.text.body.trim();
    }
    return null;
}
function buildWhatsAppMessagePreview(message) {
    const directText = getTextFromMessage(message);
    if (directText) return directText;
    switch(message.type){
        case "image":
            return message.image?.caption?.trim() || "[image]";
        case "video":
            return message.video?.caption?.trim() || "[video]";
        case "document":
            return message.document?.caption?.trim() || message.document?.filename?.trim() || "[document]";
        case "sticker":
            return "[sticker]";
        case "audio":
            return "[audio]";
        case "location":
            {
                const name = message.location?.name?.trim();
                const address = message.location?.address?.trim();
                if (name && address) return `[location] ${name} - ${address}`;
                if (name) return `[location] ${name}`;
                if (address) return `[location] ${address}`;
                return "[location]";
            }
        case "interactive":
            {
                const title = message.interactive?.button_reply?.title?.trim() || message.interactive?.list_reply?.title?.trim();
                return title ? `[interactive] ${title}` : "[interactive]";
            }
        default:
            return `[${message.type ?? "message"}]`;
    }
}
function objectFromSearchParams(params) {
    const values = {};
    for (const [key, value] of params.entries()){
        values[key] = value;
    }
    return values;
}
function parseTwilioMediaCount(value) {
    if (!value) return 0;
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}
function parseTwilioWebhookPayload(params) {
    const raw = objectFromSearchParams(params);
    return {
        accountSid: raw.AccountSid ?? null,
        body: raw.Body?.trim() || null,
        from: raw.From ?? null,
        mediaCount: parseTwilioMediaCount(raw.NumMedia),
        messageSid: raw.MessageSid ?? raw.SmsMessageSid ?? null,
        messageStatus: raw.MessageStatus ?? raw.SmsStatus ?? null,
        profileName: raw.ProfileName?.trim() || null,
        raw,
        to: raw.To ?? null,
        waId: raw.WaId ?? null
    };
}
function buildTwilioMessagePreview(payload) {
    if (payload.body) return payload.body;
    if ((payload.mediaCount ?? 0) > 0) {
        return payload.mediaCount === 1 ? "[media]" : `[media x${payload.mediaCount}]`;
    }
    return "[message]";
}
function isTwilioInboundMessage(payload) {
    return Boolean(payload.messageSid && payload.from && payload.to && (payload.waId || payload.profileName || payload.messageStatus === "received"));
}
function extractWhatsAppWebhookBatches(payload) {
    if (payload.object !== "whatsapp_business_account") {
        return [];
    }
    const batches = [];
    for (const entry of payload.entry ?? []){
        for (const change of entry.changes ?? []){
            if (change.field !== "messages" || !change.value?.metadata?.phone_number_id) continue;
            const contacts = new Map();
            for (const contact of change.value.contacts ?? []){
                const waId = normalizeWaId(contact.wa_id);
                if (waId) contacts.set(waId, contact);
            }
            batches.push({
                contacts,
                displayPhoneNumber: change.value.metadata.display_phone_number ?? null,
                messages: change.value.messages ?? [],
                phoneNumberId: change.value.metadata.phone_number_id,
                statuses: change.value.statuses ?? [],
                wabaId: entry.id ?? null
            });
        }
    }
    return batches;
}
function channelForClientSlug(clientSlug) {
    if (!clientSlug) return null;
    return ROUTES_BY_CLIENT_SLUG.get(clientSlug)?.discordChannel ?? null;
}
async function guessClientSlugFromCrm(waId) {
    if (!__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"]) return null;
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"].from("crm_contacts").select("client_slug, phone").not("phone", "is", null);
    if (error) {
        console.error("[whatsapp] CRM phone lookup failed:", error.message);
        return null;
    }
    const normalizedWaId = normalizeWaId(waId);
    if (!normalizedWaId) return null;
    for (const row of data ?? []){
        const phone = normalizeDigits(row.phone ?? null);
        if (phone && phone === normalizedWaId) {
            return row.client_slug ?? null;
        }
    }
    return null;
}
async function ensureAccount(input) {
    if (!__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"]) {
        throw new Error("Database not configured. Set SUPABASE_SERVICE_ROLE_KEY.");
    }
    const { data: existing, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"].from("whatsapp_accounts").select("id, business_display_name, default_agent_key, default_client_slug, default_discord_channel, display_phone_number, metadata, mode, phone_number_id, waba_id").eq("phone_number_id", input.phoneNumberId).maybeSingle();
    if (error) {
        throw new Error(`[whatsapp] account lookup failed: ${error.message}`);
    }
    if (existing) {
        const updates = {};
        const currentMetadata = existing.metadata ?? {};
        if (input.wabaId && existing.waba_id !== input.wabaId) {
            updates.waba_id = input.wabaId;
        }
        if (input.displayPhoneNumber && existing.display_phone_number !== input.displayPhoneNumber) {
            updates.display_phone_number = input.displayPhoneNumber;
        }
        if (input.businessDisplayName && existing.business_display_name !== input.businessDisplayName) {
            updates.business_display_name = input.businessDisplayName;
        }
        const desiredMetadata = {
            ...currentMetadata,
            ...transportMetadata(input)
        };
        if (JSON.stringify(currentMetadata) !== JSON.stringify(desiredMetadata)) {
            updates.metadata = desiredMetadata;
        }
        if (Object.keys(updates).length > 0) {
            const { error: updateError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"].from("whatsapp_accounts").update(updates).eq("id", existing.id);
            if (updateError) {
                console.error("[whatsapp] account update failed:", updateError.message);
            }
        }
        return {
            ...existing,
            ...updates
        };
    }
    const insertPayload = {
        business_display_name: input.businessDisplayName ?? input.displayPhoneNumber ?? input.phoneNumberId,
        display_phone_number: input.displayPhoneNumber,
        metadata: transportMetadata(input),
        phone_number_id: input.phoneNumberId,
        waba_id: input.wabaId
    };
    const { data: inserted, error: insertError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"].from("whatsapp_accounts").insert(insertPayload).select("id, business_display_name, default_agent_key, default_client_slug, default_discord_channel, display_phone_number, metadata, mode, phone_number_id, waba_id").single();
    if (insertError || !inserted) {
        throw new Error(`[whatsapp] account insert failed: ${insertError?.message ?? "unknown error"}`);
    }
    return inserted;
}
async function ensureContact(waId, profileNameInput) {
    if (!__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"]) {
        throw new Error("Database not configured. Set SUPABASE_SERVICE_ROLE_KEY.");
    }
    const { data: existing, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"].from("whatsapp_contacts").select("client_slug, id, profile_name, wa_id").eq("wa_id", waId).maybeSingle();
    if (error) {
        throw new Error(`[whatsapp] contact lookup failed: ${error.message}`);
    }
    const profileName = profileNameInput?.trim() || null;
    if (existing) {
        const updates = {};
        if (profileName && existing.profile_name !== profileName) {
            updates.profile_name = profileName;
        }
        if (!existing.client_slug) {
            const crmClientSlug = await guessClientSlugFromCrm(waId);
            if (crmClientSlug) {
                updates.client_slug = crmClientSlug;
            }
        }
        if (Object.keys(updates).length > 0) {
            const { error: updateError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"].from("whatsapp_contacts").update(updates).eq("id", existing.id);
            if (updateError) {
                console.error("[whatsapp] contact update failed:", updateError.message);
            }
            return {
                ...existing,
                ...updates
            };
        }
        return existing;
    }
    const clientSlug = await guessClientSlugFromCrm(waId);
    const { data: inserted, error: insertError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"].from("whatsapp_contacts").insert({
        client_slug: clientSlug,
        phone_number: waId,
        profile_name: profileName,
        wa_id: waId
    }).select("client_slug, id, profile_name, wa_id").single();
    if (insertError || !inserted) {
        throw new Error(`[whatsapp] contact insert failed: ${insertError?.message ?? "unknown error"}`);
    }
    return inserted;
}
async function ensureConversation(account, contact) {
    if (!__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"]) {
        throw new Error("Database not configured. Set SUPABASE_SERVICE_ROLE_KEY.");
    }
    const { data: existing, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"].from("whatsapp_conversations").select("agent_key, client_slug, discord_channel_name, discord_thread_id, id, last_outbound_message_at, metadata, mode, status").eq("account_id", account.id).eq("contact_id", contact.id).maybeSingle();
    if (error) {
        throw new Error(`[whatsapp] conversation lookup failed: ${error.message}`);
    }
    const derivedClientSlug = existing?.client_slug ?? contact.client_slug ?? account.default_client_slug ?? null;
    const derivedRoute = derivedClientSlug ? ROUTES_BY_CLIENT_SLUG.get(derivedClientSlug) : null;
    const derivedChannel = existing?.discord_channel_name ?? account.default_discord_channel ?? derivedRoute?.discordChannel ?? null;
    const derivedAgentKey = existing?.agent_key ?? derivedRoute?.agentKey ?? account.default_agent_key ?? WHATSAPP_AGENT_KEY;
    const derivedMode = existing?.mode ?? account.mode ?? "shadow";
    if (existing) {
        const updates = {};
        if (derivedClientSlug && existing.client_slug !== derivedClientSlug) {
            updates.client_slug = derivedClientSlug;
        }
        if (derivedChannel && existing.discord_channel_name !== derivedChannel) {
            updates.discord_channel_name = derivedChannel;
        }
        if (existing.agent_key !== derivedAgentKey) {
            updates.agent_key = derivedAgentKey;
        }
        if (existing.mode !== derivedMode) {
            updates.mode = derivedMode;
        }
        if (Object.keys(updates).length > 0) {
            const { error: updateError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"].from("whatsapp_conversations").update(updates).eq("id", existing.id);
            if (updateError) {
                console.error("[whatsapp] conversation update failed:", updateError.message);
            }
            return {
                ...existing,
                ...updates
            };
        }
        return existing;
    }
    const { data: inserted, error: insertError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"].from("whatsapp_conversations").insert({
        account_id: account.id,
        agent_key: derivedAgentKey,
        client_slug: derivedClientSlug,
        contact_id: contact.id,
        discord_channel_name: derivedChannel,
        mode: derivedMode
    }).select("agent_key, client_slug, discord_channel_name, discord_thread_id, id, last_outbound_message_at, metadata, mode, status").single();
    if (insertError || !inserted) {
        throw new Error(`[whatsapp] conversation insert failed: ${insertError?.message ?? "unknown error"}`);
    }
    return inserted;
}
async function touchConversation(conversationId, direction, preview, at) {
    if (!__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"]) return;
    const payload = {
        last_message_preview: preview
    };
    if (direction === "inbound") {
        payload.last_inbound_message_at = at;
    } else {
        payload.last_outbound_message_at = at;
    }
    const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"].from("whatsapp_conversations").update(payload).eq("id", conversationId);
    if (error) {
        console.error("[whatsapp] conversation touch failed:", error.message);
    }
}
async function upsertInboundMessage(account, contact, conversation, message) {
    if (!__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"] || !message.messageId) {
        throw new Error("WhatsApp inbound message missing persistence requirements.");
    }
    const existingResult = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"].from("whatsapp_messages").select("id, message_id, mirrored_to_discord_at, triaged_at").eq("message_id", message.messageId).maybeSingle();
    if (existingResult.error) {
        throw new Error(`[whatsapp] message lookup failed: ${existingResult.error.message}`);
    }
    if (existingResult.data) {
        const { error: updateError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"].from("whatsapp_messages").update({
            account_id: account.id,
            contact_id: contact.id,
            context_message_id: message.contextMessageId ?? null,
            conversation_id: conversation.id,
            from_wa_id: message.fromWaId,
            message_type: message.messageType,
            raw_payload: message.rawPayload,
            received_at: message.receivedAt,
            status: message.status ?? "received",
            text_body: message.textBody,
            to_wa_id: message.toWaId
        }).eq("id", existingResult.data.id);
        if (updateError) {
            console.error("[whatsapp] message update failed:", updateError.message);
        }
        await touchConversation(conversation.id, "inbound", message.preview, message.receivedAt);
        return existingResult.data;
    }
    const { data: inserted, error: insertError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"].from("whatsapp_messages").insert({
        account_id: account.id,
        contact_id: contact.id,
        context_message_id: message.contextMessageId ?? null,
        conversation_id: conversation.id,
        direction: "inbound",
        from_wa_id: message.fromWaId,
        message_id: message.messageId,
        message_type: message.messageType,
        raw_payload: message.rawPayload,
        received_at: message.receivedAt,
        status: message.status ?? "received",
        text_body: message.textBody,
        to_wa_id: message.toWaId
    }).select("id, message_id, mirrored_to_discord_at, triaged_at").single();
    if (insertError || !inserted) {
        throw new Error(`[whatsapp] message insert failed: ${insertError?.message ?? "unknown error"}`);
    }
    await touchConversation(conversation.id, "inbound", message.preview, message.receivedAt);
    return inserted;
}
async function applyStatusUpdate(account, status) {
    if (!__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"] || !status.messageId) return;
    const existingResult = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"].from("whatsapp_messages").select("conversation_id, id").eq("message_id", status.messageId).maybeSingle();
    if (existingResult.error) {
        throw new Error(`[whatsapp] status lookup failed: ${existingResult.error.message}`);
    }
    if (existingResult.data) {
        const { error: updateError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"].from("whatsapp_messages").update({
            error_message: status.errorMessage ?? null,
            metadata: status.metadata ?? {},
            provider_conversation_id: status.providerConversationId ?? null,
            provider_pricing: status.providerPricing ?? {},
            raw_payload: status.rawPayload,
            sent_at: status.sentAt,
            status: status.status
        }).eq("id", existingResult.data.id);
        if (updateError) {
            console.error("[whatsapp] status update failed:", updateError.message);
        }
        await touchConversation(existingResult.data.conversation_id, "outbound", status.preview, status.sentAt);
        return;
    }
    const recipientWaId = normalizeWaId(status.recipientWaId);
    if (!recipientWaId) return;
    const contact = await ensureContact(recipientWaId, status.recipientProfileName ?? null);
    const conversation = await ensureConversation(account, contact);
    const { error: insertError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"].from("whatsapp_messages").insert({
        account_id: account.id,
        contact_id: contact.id,
        conversation_id: conversation.id,
        direction: "outbound",
        error_message: status.errorMessage ?? null,
        from_wa_id: normalizeWaId(account.display_phone_number ?? account.phone_number_id),
        message_id: status.messageId,
        message_type: "status",
        metadata: status.metadata ?? {},
        provider_conversation_id: status.providerConversationId ?? null,
        provider_pricing: status.providerPricing ?? {},
        raw_payload: status.rawPayload,
        sent_at: status.sentAt,
        status: status.status,
        to_wa_id: recipientWaId
    });
    if (insertError) {
        throw new Error(`[whatsapp] status insert failed: ${insertError.message}`);
    }
    await touchConversation(conversation.id, "outbound", status.preview, status.sentAt);
}
async function enqueueConversationTask(conversation, message) {
    if (!__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"]) return null;
    const taskId = `whatsapp_${message.message_id}`;
    const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"].from("agent_tasks").upsert({
        action: "triage-conversation",
        from_agent: "whatsapp-cloud",
        id: taskId,
        params: {
            conversationId: conversation.id,
            discordChannelName: conversation.discord_channel_name,
            messageId: message.message_id
        },
        status: "pending",
        tier: "green",
        to_agent: conversation.agent_key || WHATSAPP_AGENT_KEY
    }, {
        onConflict: "id"
    });
    if (error) {
        console.error("[whatsapp] task enqueue failed:", error.message);
        return null;
    }
    return taskId;
}
function toNormalizedMetaInboundMessage(message, account) {
    if (!message.id) return null;
    const preview = buildWhatsAppMessagePreview(message);
    return {
        contextMessageId: message.context?.id ?? null,
        fromWaId: normalizeWaId(message.from),
        messageId: message.id,
        messageType: message.type ?? "unknown",
        preview,
        rawPayload: message,
        receivedAt: toIsoTimestamp(message.timestamp),
        status: "received",
        textBody: getTextFromMessage(message) ?? preview,
        toWaId: normalizeWaId(account.display_phone_number ?? account.phone_number_id)
    };
}
function toNormalizedMetaStatus(status) {
    if (!status.id) return null;
    const statusValue = status.status ?? "sent";
    return {
        errorMessage: status.errors?.length ? JSON.stringify(status.errors) : null,
        messageId: status.id,
        metadata: {
            last_status: statusValue,
            last_status_payload: status,
            provider: "meta-cloud"
        },
        preview: `[status] ${statusValue}`,
        providerConversationId: status.conversation?.id ?? null,
        providerPricing: status.pricing ?? {},
        rawPayload: status,
        recipientWaId: normalizeWaId(status.recipient_id),
        sentAt: toIsoTimestamp(status.timestamp),
        status: statusValue
    };
}
async function logInboundMessageEvent(transport, conversation, contact, message, metadata) {
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$system$2d$events$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logSystemEvent"])({
        ...getSystemActor(transport),
        clientSlug: conversation.client_slug,
        detail: message.preview,
        entityId: conversation.id,
        entityType: "whatsapp_conversation",
        eventName: "whatsapp_message_received",
        metadata: {
            ...metadata,
            contactName: contact.profile_name,
            fromWaId: message.fromWaId,
            messageId: message.messageId,
            mode: conversation.mode
        },
        summary: `WhatsApp message received from ${contact.profile_name ?? message.fromWaId ?? "unknown"}.`,
        visibility: "admin_only"
    });
}
async function ingestWhatsAppWebhook(payload) {
    if (!__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"]) {
        throw new Error("Database not configured. Set SUPABASE_SERVICE_ROLE_KEY.");
    }
    const batches = extractWhatsAppWebhookBatches(payload);
    let processedMessages = 0;
    let processedStatuses = 0;
    const taskIds = [];
    for (const batch of batches){
        const account = await ensureAccount({
            businessDisplayName: batch.displayPhoneNumber,
            displayPhoneNumber: batch.displayPhoneNumber,
            phoneNumberId: batch.phoneNumberId,
            transport: "meta-cloud",
            wabaId: batch.wabaId
        });
        for (const message of batch.messages){
            const waId = normalizeWaId(message.from);
            if (!waId || !message.id) continue;
            const normalized = toNormalizedMetaInboundMessage(message, account);
            if (!normalized) continue;
            const contact = await ensureContact(waId, batch.contacts.get(waId)?.profile?.name ?? null);
            const conversation = await ensureConversation(account, contact);
            const persistedMessage = await upsertInboundMessage(account, contact, conversation, normalized);
            await logInboundMessageEvent("meta-cloud", conversation, contact, normalized, {
                phoneNumberId: batch.phoneNumberId,
                provider: "meta-cloud"
            });
            const taskId = await enqueueConversationTask(conversation, persistedMessage);
            if (taskId) taskIds.push(taskId);
            processedMessages += 1;
        }
        for (const status of batch.statuses){
            const normalizedStatus = toNormalizedMetaStatus(status);
            if (!normalizedStatus) continue;
            await applyStatusUpdate(account, normalizedStatus);
            processedStatuses += 1;
        }
    }
    return {
        processedMessages,
        processedStatuses,
        taskIds
    };
}
function buildTwilioErrorMessage(raw) {
    const code = raw.ErrorCode?.trim();
    const message = raw.ErrorMessage?.trim() || raw.ChannelStatusMessage?.trim();
    if (code && message) return `${code}: ${message}`;
    if (code) return code;
    return message || null;
}
function buildTwilioAccountAddress(payload) {
    return normalizeWhatsAppAddress(isTwilioInboundMessage(payload) ? payload.to : payload.from);
}
function buildTwilioInboundMessage(payload, account) {
    if (!payload.messageSid) return null;
    const preview = buildTwilioMessagePreview(payload);
    const receivedAt = new Date().toISOString();
    return {
        fromWaId: normalizeWaId(payload.waId ?? payload.from),
        messageId: payload.messageSid,
        messageType: (payload.mediaCount ?? 0) > 0 ? "media" : "text",
        preview,
        profileName: payload.profileName ?? null,
        rawPayload: payload.raw,
        receivedAt,
        status: "received",
        textBody: payload.body ?? preview,
        toWaId: normalizeWaId(account.display_phone_number ?? account.phone_number_id)
    };
}
function buildTwilioStatus(payload) {
    if (!payload.messageSid || !payload.messageStatus) return null;
    return {
        errorMessage: buildTwilioErrorMessage(payload.raw),
        messageId: payload.messageSid,
        metadata: {
            last_status: payload.messageStatus,
            last_status_payload: payload.raw,
            provider: "twilio"
        },
        preview: `[status] ${payload.messageStatus}`,
        providerConversationId: payload.raw.ConversationSid ?? null,
        providerPricing: {},
        rawPayload: payload.raw,
        recipientWaId: normalizeWaId(payload.to),
        sentAt: new Date().toISOString(),
        status: payload.messageStatus
    };
}
async function ingestTwilioWebhook(params) {
    if (!__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"]) {
        throw new Error("Database not configured. Set SUPABASE_SERVICE_ROLE_KEY.");
    }
    const payload = parseTwilioWebhookPayload(params);
    const accountAddress = buildTwilioAccountAddress(payload);
    const accountKey = normalizeDigits(accountAddress);
    if (!accountAddress || !accountKey) {
        throw new Error("Twilio webhook is missing the Outlet WhatsApp sender number.");
    }
    const account = await ensureAccount({
        businessDisplayName: "Twilio WhatsApp",
        displayPhoneNumber: accountAddress,
        metadata: {
            twilioAccountSid: payload.accountSid,
            twilioFrom: accountAddress
        },
        phoneNumberId: accountKey,
        transport: "twilio"
    });
    let processedMessages = 0;
    let processedStatuses = 0;
    const taskIds = [];
    if (isTwilioInboundMessage(payload)) {
        const waId = normalizeWaId(payload.waId ?? payload.from);
        const normalized = buildTwilioInboundMessage(payload, account);
        if (waId && normalized) {
            const contact = await ensureContact(waId, payload.profileName ?? null);
            const conversation = await ensureConversation(account, contact);
            const persistedMessage = await upsertInboundMessage(account, contact, conversation, normalized);
            await maybeSendAutomaticInboundFeedback(account, contact, conversation, normalized);
            await logInboundMessageEvent("twilio", conversation, contact, normalized, {
                phoneNumberId: account.phone_number_id,
                provider: "twilio",
                twilioAccountSid: payload.accountSid
            });
            const taskId = await enqueueConversationTask(conversation, persistedMessage);
            if (taskId) taskIds.push(taskId);
            processedMessages += 1;
        }
    } else {
        const normalizedStatus = buildTwilioStatus(payload);
        if (normalizedStatus) {
            await applyStatusUpdate(account, normalizedStatus);
            processedStatuses += 1;
        }
    }
    return {
        processedMessages,
        processedStatuses,
        taskIds
    };
}
async function resolveSendContext(input) {
    if (!__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"]) {
        throw new Error("Database not configured. Set SUPABASE_SERVICE_ROLE_KEY.");
    }
    if (input.conversationId) {
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"].from("whatsapp_conversations").select(`
          id,
          agent_key,
          client_slug,
          discord_channel_name,
          discord_thread_id,
          mode,
          status,
          whatsapp_accounts!inner (
            id,
            business_display_name,
            default_agent_key,
            default_client_slug,
            default_discord_channel,
            display_phone_number,
            metadata,
            mode,
            phone_number_id
          ),
          whatsapp_contacts!inner (
            client_slug,
            id,
            profile_name,
            wa_id
          )
        `).eq("id", input.conversationId).single();
        if (error || !data) {
            throw new Error(`[whatsapp] conversation lookup failed: ${error?.message ?? "not found"}`);
        }
        return {
            account: firstJoinedRow(data.whatsapp_accounts),
            contact: firstJoinedRow(data.whatsapp_contacts),
            conversation: {
                agent_key: data.agent_key,
                client_slug: data.client_slug,
                discord_channel_name: data.discord_channel_name,
                discord_thread_id: data.discord_thread_id,
                id: data.id,
                mode: data.mode,
                status: data.status
            },
            phoneNumberId: firstJoinedRow(data.whatsapp_accounts).phone_number_id ?? "",
            toWaId: firstJoinedRow(data.whatsapp_contacts).wa_id ?? ""
        };
    }
    const toWaId = normalizeWaId(input.toWaId);
    const phoneNumberId = input.phoneNumberId?.trim();
    if (!toWaId || !phoneNumberId) {
        throw new Error("Either conversationId or both phoneNumberId and toWaId are required.");
    }
    const { data: account, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"].from("whatsapp_accounts").select("id, business_display_name, default_agent_key, default_client_slug, default_discord_channel, display_phone_number, metadata, mode, phone_number_id, waba_id").eq("phone_number_id", phoneNumberId).single();
    if (error || !account) {
        throw new Error(`[whatsapp] account lookup failed: ${error?.message ?? "not found"}`);
    }
    const contact = await ensureContact(toWaId, undefined);
    const conversation = await ensureConversation(account, contact);
    return {
        account: account,
        contact,
        conversation,
        phoneNumberId,
        toWaId
    };
}
function assertConversationSendMode(context, input) {
    const mode = context.conversation?.mode;
    if (!mode) return;
    if (mode === "shadow" || mode === "draft_only") {
        throw new Error(`WhatsApp conversation ${context.conversation?.id} is in ${mode} mode; outbound send blocked.`);
    }
    if (mode === "assisted" && !input.approved) {
        throw new Error(`WhatsApp conversation ${context.conversation?.id} is in assisted mode; outbound send requires approved=true.`);
    }
}
function getTwilioStatusCallbackUrl() {
    const explicit = process.env.TWILIO_WHATSAPP_STATUS_CALLBACK_URL?.trim();
    if (explicit) return explicit;
    const appUrl = ("TURBOPACK compile-time value", "https://fe88-2600-1702-4fb0-b050-bcfe-1303-100a-5539.ngrok-free.app")?.trim();
    if (!appUrl) return null;
    return new URL("/api/whatsapp/twilio/status", appUrl).toString();
}
async function sendTwilioTypingIndicator(account, inboundMessageId) {
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const accountSid = (typeof account.metadata?.twilioAccountSid === "string" ? account.metadata.twilioAccountSid : null) ?? process.env.TWILIO_ACCOUNT_SID;
    if (!accountSid || !authToken || !inboundMessageId) {
        return;
    }
    const payload = new URLSearchParams({
        channel: "whatsapp",
        messageId: inboundMessageId
    });
    const response = await fetch("https://messaging.twilio.com/v2/Indicators/Typing.json", {
        body: payload.toString(),
        headers: {
            Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST"
    });
    if (!response.ok) {
        const result = await response.text().catch(()=>"") || `HTTP ${response.status}`;
        throw new Error(`Twilio typing indicator failed: ${result}`);
    }
}
async function maybeSendAutomaticInboundFeedback(account, contact, conversation, message) {
    const accessStatus = parseConversationAccessStatus(conversation.metadata);
    const chatKind = parseConversationChatKind(conversation.metadata);
    if (!shouldAutoAcknowledgeWhatsAppInbound({
        accessStatus,
        chatKind,
        lastOutboundMessageAt: conversation.last_outbound_message_at ?? null,
        mode: conversation.mode,
        textBody: message.textBody,
        waId: contact.wa_id
    })) {
        return;
    }
    if (shouldUseTwilioTypingIndicator()) {
        try {
            await sendTwilioTypingIndicator(account, message.messageId);
        } catch (error) {
            const detail = error instanceof Error ? error.message : String(error);
            console.warn("[whatsapp] typing indicator failed:", detail);
        }
    }
    const delayMs = autoAckDelayMs();
    if (delayMs > 0) {
        await new Promise((resolve)=>setTimeout(resolve, delayMs));
    }
    try {
        await sendWhatsAppTextMessage({
            approved: true,
            body: buildAutomaticAckText(),
            conversationId: conversation.id,
            replyToMessageId: message.messageId
        });
    } catch (error) {
        const detail = error instanceof Error ? error.message : String(error);
        console.warn("[whatsapp] automatic ack failed:", detail);
    }
}
async function sendMetaCloudTextMessage(context, input, body) {
    const token = process.env.WHATSAPP_CLOUD_API_TOKEN;
    if (!token) {
        throw new Error("WHATSAPP_CLOUD_API_TOKEN is not configured.");
    }
    const payload = {
        messaging_product: "whatsapp",
        preview_url: input.previewUrl ?? false,
        recipient_type: "individual",
        text: {
            body
        },
        to: context.toWaId,
        type: "text"
    };
    if (input.replyToMessageId) {
        payload.context = {
            message_id: input.replyToMessageId
        };
    }
    const response = await fetch(`https://graph.facebook.com/${WHATSAPP_GRAPH_API_VERSION}/${context.phoneNumberId}/messages`, {
        body: JSON.stringify(payload),
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        method: "POST"
    });
    const result = await response.json().catch(()=>null);
    if (!response.ok) {
        throw new Error(result?.error?.message ?? `WhatsApp API request failed (${response.status})`);
    }
    const messageId = result?.messages?.[0]?.id;
    if (!messageId) {
        throw new Error("WhatsApp API response did not include a message id.");
    }
    return {
        messageId,
        rawPayload: {
            request: payload,
            response: result,
            transport: "meta-cloud"
        },
        sentAt: new Date().toISOString(),
        status: "sent"
    };
}
async function sendTwilioTextMessage(context, input, body) {
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const accountSid = (typeof context.account.metadata?.twilioAccountSid === "string" ? context.account.metadata.twilioAccountSid : null) ?? process.env.TWILIO_ACCOUNT_SID;
    if (!accountSid || !authToken) {
        throw new Error("TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN are required for Twilio WhatsApp sends.");
    }
    const fromAddress = (typeof context.account.metadata?.twilioFrom === "string" ? context.account.metadata.twilioFrom : null) ?? context.account.display_phone_number ?? process.env.TWILIO_WHATSAPP_FROM ?? context.account.phone_number_id;
    const payload = new URLSearchParams({
        Body: body,
        From: toWhatsAppAddress(fromAddress),
        To: toWhatsAppAddress(context.toWaId)
    });
    const statusCallbackUrl = getTwilioStatusCallbackUrl();
    if (statusCallbackUrl) {
        payload.set("StatusCallback", statusCallbackUrl);
    }
    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
        body: payload.toString(),
        headers: {
            Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST"
    });
    const result = await response.json().catch(()=>null);
    if (!response.ok) {
        throw new Error(result?.message ?? `Twilio WhatsApp request failed (${response.status})`);
    }
    const messageId = result?.sid;
    if (!messageId) {
        throw new Error("Twilio WhatsApp response did not include a message sid.");
    }
    return {
        messageId,
        rawPayload: {
            request: Object.fromEntries(payload.entries()),
            response: result,
            transport: "twilio"
        },
        sentAt: new Date().toISOString(),
        status: result?.status ?? "queued"
    };
}
async function sendWhatsAppTextMessage(input) {
    const context = await resolveSendContext(input);
    assertConversationSendMode(context, input);
    const body = input.body.trim();
    if (!body) {
        throw new Error("WhatsApp message body cannot be empty.");
    }
    const transport = getAccountTransport(context.account);
    const sent = transport === "twilio" ? await sendTwilioTextMessage(context, input, body) : await sendMetaCloudTextMessage(context, input, body);
    if (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"]) {
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"].from("whatsapp_messages").insert({
            account_id: context.account.id,
            contact_id: context.contact?.id ?? null,
            context_message_id: input.replyToMessageId ?? null,
            conversation_id: context.conversation?.id ?? null,
            direction: "outbound",
            from_wa_id: normalizeWaId(context.account.display_phone_number ?? context.account.phone_number_id),
            message_id: sent.messageId,
            message_type: "text",
            metadata: {
                approved: input.approved ?? false,
                transport
            },
            raw_payload: sent.rawPayload,
            sent_at: sent.sentAt,
            status: sent.status,
            text_body: body,
            to_wa_id: context.toWaId
        });
        if (context.conversation) {
            await touchConversation(context.conversation.id, "outbound", body, sent.sentAt);
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$system$2d$events$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logSystemEvent"])({
                ...getSystemActor(transport),
                clientSlug: context.conversation.client_slug,
                detail: body,
                entityId: context.conversation.id,
                entityType: "whatsapp_conversation",
                eventName: "whatsapp_message_sent",
                metadata: {
                    messageId: sent.messageId,
                    phoneNumberId: context.phoneNumberId,
                    transport,
                    toWaId: context.toWaId
                },
                summary: `WhatsApp message sent to ${context.contact?.profile_name ?? context.toWaId}.`,
                visibility: "admin_only"
            });
        }
    }
    return {
        conversationId: context.conversation?.id ?? null,
        messageId: sent.messageId
    };
}
}),
"[project]/src/app/api/whatsapp/twilio/status/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/api-helpers.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$whatsapp$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/whatsapp/server.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase.ts [app-route] (ecmascript)");
;
;
;
;
function forbidden() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["apiError"])("Unauthorized", 401);
}
async function POST(request) {
    if (!__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"]) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["apiError"])("Database not configured. Set SUPABASE_SERVICE_ROLE_KEY.", 503);
    }
    const rawBody = await request.text();
    const params = new URLSearchParams(rawBody);
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$whatsapp$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["verifyTwilioWebhookSignature"])(request.url, params, request.headers.get("x-twilio-signature"))) {
        return forbidden();
    }
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$whatsapp$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ingestTwilioWebhook"])(params);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ok: true
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error("[whatsapp-twilio-status-webhook] ingest failed:", message);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["apiError"])(message, 500);
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__14ebdd52._.js.map
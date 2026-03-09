module.exports = [
"[project]/src/lib/env.ts [instrumentation] (ecmascript, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "server/chunks/node_modules_zod_v4_01165f01._.js",
  "server/chunks/src_lib_env_ts_ff789873._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[project]/src/lib/env.ts [instrumentation] (ecmascript)");
    });
});
}),
];
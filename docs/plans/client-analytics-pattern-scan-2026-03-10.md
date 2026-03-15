# Client Analytics Pattern Scan

Date: March 10, 2026

## Scope

- Scanned 182 deduped public repositories across analytics, BI, observability, reporting, admin dashboards, ecommerce, finance, and marketing.
- Kept the strongest 100 public dashboard/reporting projects below as a reusable reference set.
- Cross-checked current commercial product patterns on official sites for products clients already recognize:
  - [Amplitude](https://amplitude.com/)
  - [Mixpanel](https://mixpanel.com/)
  - [PostHog](https://posthog.com/product-analytics)
  - [Databox](https://databox.com/)
  - [Triple Whale](https://www.triplewhale.com/)
  - [Northbeam](https://www.northbeam.io/)
  - [Plausible](https://plausible.io/)
  - [Grafana](https://grafana.com/)
  - [Metabase](https://www.metabase.com/)
  - [Looker Studio](https://lookerstudio.google.com/)

## What Outlet Should Steal Next

1. Lead with a campaign intelligence brief, not a wall of equal cards. The best dashboards open with one dominant summary zone that explains what is happening, what changed, and what matters now.
2. Put decision signals above exploration. Best age, best gender, best city, best hour, best day, strongest creative, and pacing status should be visible before the deeper charts.
3. Use mixed visual density. Professional tools do not stack twenty identical cards. They mix one hero, two or three ranked panels, one timeline, one heatmap, and one league table.
4. Make time filters compare-aware. Today, yesterday, 7d, 30d, lifetime, plus previous-period deltas are standard. Users expect immediate context, not raw totals.
5. Show dayparting and schedule insight visually. Heatmaps for day of week and hour of day are repeatedly used because they directly change spending and creative decisions.
6. Rank entities, not only metrics. Ads, ad sets, markets, audiences, and placements should appear in leaderboards with winners, laggards, and outliers.
7. Surface data freshness and attribution caveats. Strong tools tell users when data was last updated and where it came from so low-volume days do not feel broken.
8. Turn analytics into action. The best products pair insight with recommendation: shift budget, duplicate winning creative, refresh weak demographics, or check tracking.
9. Use empty states that teach. When the selected window has no delivery, say exactly that and suggest a better range instead of inventing "best" signals from zeros.
10. Keep charts tied to the workflow. For Outlet, recommendations should become campaign-native next steps, not dead-end observations.

## Outlet Translation

- Replace the current card grid with a top "Campaign Intelligence Brief" block that combines delivery status, budget pace, revenue story, and a short narrative.
- Add a horizontal "Decision Signals" rail with best age, best gender, best market, best day, best hour, and top creative.
- Add a true daypart heatmap for weekday by hour when the API data supports it.
- Rework ad performance into a ranked table with status, spend, clicks, impressions, revenue, CTR, and a winner/laggard marker.
- Add a "What changed vs previous window" summary instead of showing absolute values only.
- Add a "Data source and freshness" footer to reinforce trust: Meta data, selected date range, and last sync time.

## 100 Public Projects Scanned

1. [grafana/grafana](https://github.com/grafana/grafana) - Observability
2. [metabase/metabase](https://github.com/metabase/metabase) - Core analytics
3. [ant-design/ant-design-pro](https://github.com/ant-design/ant-design-pro) - Admin dashboards
4. [refinedev/refine](https://github.com/refinedev/refine) - Admin dashboards
5. [raga-ai-hub/RagaAI-Catalyst](https://github.com/raga-ai-hub/RagaAI-Catalyst) - Core analytics
6. [kubeshark/kubeshark](https://github.com/kubeshark/kubeshark) - Observability
7. [keen/dashboards](https://github.com/keen/dashboards) - Core analytics
8. [zuiidea/antd-admin](https://github.com/zuiidea/antd-admin) - Admin dashboards
9. [hyperdxio/hyperdx](https://github.com/hyperdxio/hyperdx) - Observability
10. [coroot/coroot](https://github.com/coroot/coroot) - Observability
11. [evidence-dev/evidence](https://github.com/evidence-dev/evidence) - Business intelligence
12. [edp963/davinci](https://github.com/edp963/davinci) - Data viz
13. [coreui/coreui-free-react-admin-template](https://github.com/coreui/coreui-free-react-admin-template) - Admin dashboards
14. [chartbrew/chartbrew](https://github.com/chartbrew/chartbrew) - Executive reporting
15. [dotdc/grafana-dashboards-kubernetes](https://github.com/dotdc/grafana-dashboards-kubernetes) - Observability
16. [observablehq/framework](https://github.com/observablehq/framework) - Observability
17. [adrianhajdin/project_syncfusion_dashboard](https://github.com/adrianhajdin/project_syncfusion_dashboard) - Admin dashboards
18. [booleanhunter/ReactJS-AdminLTE](https://github.com/booleanhunter/ReactJS-AdminLTE) - Admin dashboards
19. [running-elephant/datart](https://github.com/running-elephant/datart) - Data viz
20. [perses/perses](https://github.com/perses/perses) - Observability
21. [opensearch-project/OpenSearch-Dashboards](https://github.com/opensearch-project/OpenSearch-Dashboards) - Core analytics
22. [DesignRevision/shards-dashboard-react](https://github.com/DesignRevision/shards-dashboard-react) - Admin dashboards
23. [flatlogic/react-material-admin](https://github.com/flatlogic/react-material-admin) - Admin dashboards
24. [LANIF-UI/dva-boot-admin](https://github.com/LANIF-UI/dva-boot-admin) - Admin dashboards
25. [flatlogic/react-dashboard](https://github.com/flatlogic/react-dashboard) - Admin dashboards
26. [FrigadeHQ/trench](https://github.com/FrigadeHQ/trench) - Observability
27. [kubetail-org/kubetail](https://github.com/kubetail-org/kubetail) - Observability
28. [ed-roh/react-admin-dashboard](https://github.com/ed-roh/react-admin-dashboard) - Admin dashboards
29. [vercel/nextjs-postgres-nextauth-tailwindcss-template](https://github.com/vercel/nextjs-postgres-nextauth-tailwindcss-template) - Admin dashboards
30. [Raathigesh/dazzle](https://github.com/Raathigesh/dazzle) - Core analytics
31. [chiphuyen/sniffly](https://github.com/chiphuyen/sniffly) - Core analytics
32. [slok/grafterm](https://github.com/slok/grafterm) - Observability
33. [mariusandra/insights](https://github.com/mariusandra/insights) - Business intelligence
34. [TailAdmin/free-react-tailwind-admin-dashboard](https://github.com/TailAdmin/free-react-tailwind-admin-dashboard) - Admin dashboards
35. [robbins23/daisyui-admin-dashboard-template](https://github.com/robbins23/daisyui-admin-dashboard-template) - Admin dashboards
36. [themesberg/volt-react-dashboard](https://github.com/themesberg/volt-react-dashboard) - Admin dashboards
37. [uilibrary/matx-react](https://github.com/uilibrary/matx-react) - Admin dashboards
38. [codedthemes/mantis-free-react-admin-template](https://github.com/codedthemes/mantis-free-react-admin-template) - Admin dashboards
39. [frappe/insights](https://github.com/frappe/insights) - Business intelligence
40. [start-react/sb-admin-react](https://github.com/start-react/sb-admin-react) - Admin dashboards
41. [mujx/hakatime](https://github.com/mujx/hakatime) - Core analytics
42. [creativetimofficial/purity-ui-dashboard](https://github.com/creativetimofficial/purity-ui-dashboard) - Admin dashboards
43. [creativetimofficial/material-tailwind-dashboard-react](https://github.com/creativetimofficial/material-tailwind-dashboard-react) - Admin dashboards
44. [design-sparx/mantine-analytics-dashboard](https://github.com/design-sparx/mantine-analytics-dashboard) - Core analytics
45. [woshijielie/stock_prediction_and_recommendation](https://github.com/woshijielie/stock_prediction_and_recommendation) - Data viz
46. [helicalinsight/helicalinsight](https://github.com/helicalinsight/helicalinsight) - Business intelligence
47. [mprove-io/mprove](https://github.com/mprove-io/mprove) - Business intelligence
48. [widestage/widestage](https://github.com/widestage/widestage) - Business intelligence
49. [VKCOM/statshouse](https://github.com/VKCOM/statshouse) - Observability
50. [sy-vendor/Gobi](https://github.com/sy-vendor/Gobi) - Business intelligence
51. [tomdyson/wagalytics](https://github.com/tomdyson/wagalytics) - Core analytics
52. [kubernetes-retired/kubedash](https://github.com/kubernetes-retired/kubedash) - Core analytics
53. [shamiraty/Streamlit-Dashboard-Descriptive-Analytics-with-MYSQL](https://github.com/shamiraty/Streamlit-Dashboard-Descriptive-Analytics-with-MYSQL) - Core analytics
54. [psf/pypistats.org](https://github.com/psf/pypistats.org) - Core analytics
55. [veronikakurth/django-dashboard-app](https://github.com/veronikakurth/django-dashboard-app) - Core analytics
56. [Azure/ibex-dashboard](https://github.com/Azure/ibex-dashboard) - Core analytics
57. [phillipdupuis/dtale-desktop](https://github.com/phillipdupuis/dtale-desktop) - Data viz
58. [vivekchand/clawmetry](https://github.com/vivekchand/clawmetry) - Observability
59. [decileapp/decile](https://github.com/decileapp/decile) - Business intelligence
60. [MarkEdmondson1234/ga-dashboard-demo](https://github.com/MarkEdmondson1234/ga-dashboard-demo) - Core analytics
61. [propeldata/ui-kit](https://github.com/propeldata/ui-kit) - Data viz
62. [biblibre/urungi](https://github.com/biblibre/urungi) - Business intelligence
63. [lalomorales22/global-analytics-dashboard](https://github.com/lalomorales22/global-analytics-dashboard) - Core analytics
64. [dankilman/awe](https://github.com/dankilman/awe) - Executive reporting
65. [builderz-labs/hermes-dashboard](https://github.com/builderz-labs/hermes-dashboard) - Marketing analytics
66. [laravel-bi/laravel-bi](https://github.com/laravel-bi/laravel-bi) - Business intelligence
67. [Qeagle/reporter-engine](https://github.com/Qeagle/reporter-engine) - Executive reporting
68. [NuCivic/react-dash](https://github.com/NuCivic/react-dash) - Data viz
69. [KaterinaLupacheva/react-google-analytics-dashboard](https://github.com/KaterinaLupacheva/react-google-analytics-dashboard) - Core analytics
70. [simovilab/infobus-data](https://github.com/simovilab/infobus-data) - Business intelligence
71. [SahilChachra/Video-Analytics-Dashboard](https://github.com/SahilChachra/Video-Analytics-Dashboard) - Core analytics
72. [shakibsadman/shakib-admin](https://github.com/shakibsadman/shakib-admin) - SaaS dashboards
73. [openedx-unsupported/edx-analytics-dashboard](https://github.com/openedx-unsupported/edx-analytics-dashboard) - Core analytics
74. [behnamyazdan/ecommerce_realtime_data_pipeline](https://github.com/behnamyazdan/ecommerce_realtime_data_pipeline) - Ecommerce
75. [opensearch-project/observability](https://github.com/opensearch-project/observability) - Observability
76. [jessekorzan/real-time-dashboard](https://github.com/jessekorzan/real-time-dashboard) - Executive reporting
77. [kubowania/crypto-dashboard-react](https://github.com/kubowania/crypto-dashboard-react) - Crypto
78. [akshay5995/powerbi-report-component](https://github.com/akshay5995/powerbi-report-component) - Executive reporting
79. [renaissancetroll/reactjs-crypto-api-dashboard](https://github.com/renaissancetroll/reactjs-crypto-api-dashboard) - Crypto
80. [yogeshsd/query2report](https://github.com/yogeshsd/query2report) - Business intelligence
81. [typhoonworks/lotus](https://github.com/typhoonworks/lotus) - Business intelligence
82. [Danupriyav/Digital-Marketing-Analytics-Dashboard](https://github.com/Danupriyav/Digital-Marketing-Analytics-Dashboard) - Marketing analytics
83. [uwdata/mosaic-framework-example](https://github.com/uwdata/mosaic-framework-example) - Observability
84. [qtecsolution/qpos](https://github.com/qtecsolution/qpos) - Sales
85. [Hazrat-Ali9/Stock-Manager-Frontend](https://github.com/Hazrat-Ali9/Stock-Manager-Frontend) - Product analytics
86. [Hazrat-Ali9/Cow-Hut-Frontend](https://github.com/Hazrat-Ali9/Cow-Hut-Frontend) - Sales
87. [Kuzma02/Free-Admin-Dashboard](https://github.com/Kuzma02/Free-Admin-Dashboard) - Data viz
88. [codebucks27/CryptoBucks-A-crypto-screener-application](https://github.com/codebucks27/CryptoBucks-A-crypto-screener-application) - Crypto
89. [madEffort/youtube-trend-dashboard](https://github.com/madEffort/youtube-trend-dashboard) - Streamlit
90. [softvis-research/jqa-dashboard](https://github.com/softvis-research/jqa-dashboard) - Data viz
91. [BobsProgrammingAcademy/cryptocurrency-dashboard](https://github.com/BobsProgrammingAcademy/cryptocurrency-dashboard) - Crypto
92. [stefanrmmr/beatinspect](https://github.com/stefanrmmr/beatinspect) - Streamlit
93. [LeuAlmeida/app.october](https://github.com/LeuAlmeida/app.october) - Finance
94. [mxvsh/modern-crypto-dashboard-ui](https://github.com/mxvsh/modern-crypto-dashboard-ui) - Crypto
95. [atapas/covid-19](https://github.com/atapas/covid-19) - Data viz
96. [arnobt78/Warehouse-Stock-Inventory-Management-System--NextJS-FullStack](https://github.com/arnobt78/Warehouse-Stock-Inventory-Management-System--NextJS-FullStack) - Product analytics
97. [brunorosilva/todoist-analytics](https://github.com/brunorosilva/todoist-analytics) - Streamlit
98. [tjvantoll/financial-dashboard](https://github.com/tjvantoll/financial-dashboard) - Finance
99. [blueswen/grafana-zero-to-hero](https://github.com/blueswen/grafana-zero-to-hero) - Observability
100. [opensearch-project/dashboards-observability](https://github.com/opensearch-project/dashboards-observability) - Observability

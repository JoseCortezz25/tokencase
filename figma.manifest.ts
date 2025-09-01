// https://www.figma.com/plugin-docs/manifest/
export default {
  name: "TokenCase",
  id: "1544171464960633020",
  api: "1.0.0",
  main: "plugin.js",
  ui: "index.html",
  capabilities: [],
  enableProposedApi: false,
  editorType: ["figma"],
  networkAccess: { 
    allowedDomains: ["none"],
  },
  documentAccess: "dynamic-page"
};

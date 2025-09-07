// https://www.figma.com/plugin-docs/manifest/
export default {
  name: 'TokenCase',
  id: '1544168977475213494',
  api: '1.0.0',
  main: 'plugin.js',
  ui: 'index.html',
  capabilities: [],
  enableProposedApi: false,
  editorType: ['figma'],
  networkAccess: {
    allowedDomains: ['none']
  },
  documentAccess: 'dynamic-page'
};

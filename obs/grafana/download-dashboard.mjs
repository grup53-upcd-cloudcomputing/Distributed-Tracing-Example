import { rename, writeFile } from 'node:fs/promises';

const dashboardUrl = 'https://grafana.com/api/dashboards/1860/revisions/42/download';
const datasourceUid = 'host-prometheus';
const response = await fetch(dashboardUrl, {
  signal: AbortSignal.timeout(60000),
});

if (!response.ok) {
  throw new Error(`Dashboard download failed: HTTP ${response.status}`);
}

const dashboard = await response.json();
if (dashboard.title !== 'Node Exporter Full' || !Array.isArray(dashboard.panels)) {
  throw new Error('The downloaded JSON is not the expected Node Exporter Full dashboard');
}

const datasourceInputs = (dashboard.__inputs ?? [])
  .filter((input) => input.type === 'datasource' && input.pluginId === 'prometheus')
  .map((input) => input.name);
const datasourceNames = new Set(['DS_PROMETHEUS', ...datasourceInputs]);

function bindDatasource(value) {
  if (typeof value === 'string') {
    for (const name of datasourceNames) {
      if (value === '${' + name + '}' || value === '$' + name) {
        return datasourceUid;
      }
    }
    return value;
  }
  if (Array.isArray(value)) {
    return value.map(bindDatasource);
  }
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, bindDatasource(entry)]),
    );
  }
  return value;
}

for (const variable of dashboard.templating?.list ?? []) {
  if (variable.type === 'datasource' && variable.query === 'prometheus') {
    variable.current = { text: 'Host Prometheus', value: datasourceUid };
    variable.options = [];
  }
}

delete dashboard.__inputs;
dashboard.id = null;
dashboard.uid = 'node-exporter-full';
const dashboardPath = '/dashboards/node-exporter-full.json';
await writeFile(`${dashboardPath}.tmp`, JSON.stringify(bindDatasource(dashboard)), {
  mode: 0o644,
});
await rename(`${dashboardPath}.tmp`, dashboardPath);
console.log('Provisioned Node Exporter Full (1860, revision 42)');
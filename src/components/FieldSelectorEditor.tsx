import React from 'react';
import { StandardEditorProps } from '@grafana/data';
import { Combobox } from '@grafana/ui';
import { getTemplateSrv } from '@grafana/runtime';
import { CustomDashboardListOptions } from '../types';

export const FieldSelectorEditor = ({
  value,
  onChange,
  context,
}: StandardEditorProps<string, undefined, CustomDashboardListOptions>) => {
  const fields = (context.data || []).flatMap((frame) => frame.fields.map((field) => field.name));

  // Retrieve all dashboard variables from Grafana's template service
  let dashboardVars: string[] = [];
  try {
    const vars = getTemplateSrv().getVariables();
    if (vars && Array.isArray(vars)) {
      dashboardVars = vars.map((v) => `\${${v.name}}`);
    }
  } catch {
    // If not in a dashboard context (e.g., panel edit sandbox)
  }

  // Built-in Grafana user and dashboard variables
  const builtInVars = [
    '${__user.name}',
    '${__user.login}',
    '${__user.email}',
    '${__user.id}',
    '${__dashboard.name}',
    '${__dashboard.uid}',
  ];

  const fieldOptions = Array.from(new Set(fields.filter(Boolean))).map((f) => ({
    label: `Spalte: ${f}`,
    value: f as string,
  }));

  const varOptions = Array.from(new Set([...dashboardVars, ...builtInVars])).map((v) => ({
    label: `Variable: ${v}`,
    value: v,
  }));

  const currentOption = value && !fields.includes(value) && !dashboardVars.includes(value) && !builtInVars.includes(value)
    ? [{ label: `Wert / Variable: ${value}`, value }]
    : [];

  const options = [...fieldOptions, ...varOptions, ...currentOption];

  return (
    <Combobox
      isClearable
      createCustomValue
      customValueDescription="Als Variable oder benutzerdefinierten Wert verwenden"
      options={options}
      value={value}
      onChange={(selected) => onChange(selected?.value ?? '')}
    />
  );
};

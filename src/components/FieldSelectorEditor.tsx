import React from 'react';
import { StandardEditorProps } from '@grafana/data';
import { Combobox } from '@grafana/ui';
import { CustomDashboardListOptions } from '../types';

export const FieldSelectorEditor = ({
  value,
  onChange,
  context,
}: StandardEditorProps<string, undefined, CustomDashboardListOptions>) => {
  const fields = (context.data || []).flatMap((frame) => frame.fields.map((field) => field.name));
  const options = Array.from(new Set([...fields, value].filter(Boolean))).map((field) => ({
    label: field as string,
    value: field as string,
  }));

  return (
    <Combobox
      isClearable
      options={options}
      value={value}
      onChange={(selected) => onChange(selected?.value ?? '')}
    />
  );
};


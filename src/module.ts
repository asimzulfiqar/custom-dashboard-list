import { PanelPlugin } from '@grafana/data';
import { CustomDashboardListPanel } from './components/CustomDashboardListPanel';
import { FieldSelectorEditor } from './components/FieldSelectorEditor';
import { CustomDashboardListOptions } from './types';

export const plugin = new PanelPlugin<CustomDashboardListOptions>(CustomDashboardListPanel).setPanelOptions((builder) => {
  builder
    // -------------------------------------------------------------
    // Category: View Mode & Roles
    // -------------------------------------------------------------
    .addRadio({
      path: 'viewMode',
      name: 'View Mode',
      category: ['View Mode & Roles'],
      description: 'Automatic role detection or force a specific view mode.',
      defaultValue: 'auto',
      settings: {
        options: [
          { label: 'Auto (Automatic Detection)', value: 'auto' },
          { label: 'Authority View (Grouped by Operator)', value: 'authority' },
          { label: 'Operator View (Own Assets)', value: 'operator' },
        ],
      },
    })

    // -------------------------------------------------------------
    // Category: Column Mapping (Queries)
    // -------------------------------------------------------------
    .addCustomEditor({
      id: 'fieldMappings.wellNameField',
      path: 'fieldMappings.wellNameField',
      name: 'Station / Asset Name Column',
      category: ['Column Mapping (Queries)'],
      description: 'Column with the name or title of the station/asset (e.g. "title", "brunnenbezeichnung")',
      editor: FieldSelectorEditor,
      defaultValue: '',
    })
    .addCustomEditor({
      id: 'fieldMappings.wellIdField',
      path: 'fieldMappings.wellIdField',
      name: 'Asset ID / Code Column',
      category: ['Column Mapping (Queries)'],
      description: 'Column containing the asset ID (e.g. "well_id", "objektkennzahl")',
      editor: FieldSelectorEditor,
      defaultValue: '',
    })
    .addCustomEditor({
      id: 'fieldMappings.operatorField',
      path: 'fieldMappings.operatorField',
      name: 'Operator (Company / Organization)',
      category: ['Column Mapping (Queries)'],
      description: 'Column containing the operator name (e.g. "Betreiber")',
      editor: FieldSelectorEditor,
      defaultValue: 'Betreiber',
    })
    .addCustomEditor({
      id: 'fieldMappings.meterReadingField',
      path: 'fieldMappings.meterReadingField',
      name: 'Current Meter Reading Column',
      category: ['Column Mapping (Queries)'],
      description: 'Column containing the latest meter reading value',
      editor: FieldSelectorEditor,
      defaultValue: '',
    })
    .addCustomEditor({
      id: 'fieldMappings.consumption12hField',
      path: 'fieldMappings.consumption12hField',
      name: '12h Consumption Column',
      category: ['Column Mapping (Queries)'],
      description: 'Column containing the consumption over the last 12 hours',
      editor: FieldSelectorEditor,
      defaultValue: '',
    })
    .addCustomEditor({
      id: 'fieldMappings.consumptionYearField',
      path: 'fieldMappings.consumptionYearField',
      name: 'Annual Consumption Column',
      category: ['Column Mapping (Queries)'],
      description: 'Column containing cumulative calendar year consumption',
      editor: FieldSelectorEditor,
      defaultValue: '',
    })
    .addCustomEditor({
      id: 'fieldMappings.lastSeenField',
      path: 'fieldMappings.lastSeenField',
      name: 'Telemetry Timestamp Column',
      category: ['Column Mapping (Queries)'],
      description: 'Timestamp of the last telemetry message for 24h freshness check',
      editor: FieldSelectorEditor,
      defaultValue: '',
    })
    .addCustomEditor({
      id: 'fieldMappings.statusField',
      path: 'fieldMappings.statusField',
      name: 'Status Column (Optional Override)',
      category: ['Column Mapping (Queries)'],
      description: 'Optional: If status is already provided as 1/0, boolean, or online/offline',
      editor: FieldSelectorEditor,
      defaultValue: '',
    })
    .addCustomEditor({
      id: 'fieldMappings.dashboardUidField',
      path: 'fieldMappings.dashboardUidField',
      name: 'Dashboard UID Column (Optional)',
      category: ['Column Mapping (Queries)'],
      description: 'Optional: Column containing individual Grafana dashboard UID per station',
      editor: FieldSelectorEditor,
      defaultValue: '',
    })
    .addCustomEditor({
      id: 'fieldMappings.betreiberkennzahlField',
      path: 'fieldMappings.betreiberkennzahlField',
      name: 'Operator ID / Kennzahl Column (Optional)',
      category: ['Column Mapping (Queries)'],
      description: 'Optional: Column with operator numerical ID from the database (e.g. "betreiberkennzahl")',
      editor: FieldSelectorEditor,
      defaultValue: '',
    })
    .addCustomEditor({
      id: 'fieldMappings.authorityNameField',
      path: 'fieldMappings.authorityNameField',
      name: 'Authority / Agency Column (Optional)',
      category: ['Column Mapping (Queries)'],
      description: 'Optional: Column with name of the supervisory authority or agency',
      editor: FieldSelectorEditor,
      defaultValue: '',
    })
    .addCustomEditor({
      id: 'fieldMappings.userNameField',
      path: 'fieldMappings.userNameField',
      name: 'User Name Column (Optional)',
      category: ['Column Mapping (Queries)'],
      description: 'Optional: Column with user display name from query (e.g. "user_name")',
      editor: FieldSelectorEditor,
      defaultValue: '',
    })

    // -------------------------------------------------------------
    // Category: Header & Greeting
    // -------------------------------------------------------------
    .addBooleanSwitch({
      path: 'header.showHeader',
      name: 'Show Header Banner',
      category: ['Header & Greeting'],
      defaultValue: true,
    })
    .addTextInput({
      path: 'header.headerTitle',
      name: 'Project Title',
      category: ['Header & Greeting'],
      description: 'Top header title banner (e.g. "Pilotprojekt Funkzähler Bergtheimer Mulde")',
      defaultValue: 'Smart Utility & Grid Operations',
    })
    .addTextInput({
      path: 'header.userName',
      name: 'User Name (Template / Fallback)',
      category: ['Header & Greeting'],
      description: 'Supports Grafana variables like ${__user.name} or ${__user.login}',
      defaultValue: '${__user.name}',
    })
    .addTextInput({
      path: 'header.authorityName',
      name: 'Authority / Agency Name (Fallback)',
      category: ['Header & Greeting'],
      defaultValue: '',
    })
    .addTextInput({
      path: 'header.betreiberkennzahl',
      name: 'Operator ID / Kennzahl (Fallback)',
      category: ['Header & Greeting'],
      defaultValue: '',
    })

    // -------------------------------------------------------------
    // Category: Formatting & Status
    // -------------------------------------------------------------
    .addSelect({
      path: 'numberFormat',
      name: 'Number Format',
      category: ['Formatting & Status'],
      defaultValue: 'de-grouped',
      settings: {
        options: [
          { label: 'German with Separators (22.123 m³ / 21,5 m³)', value: 'de-grouped' },
          { label: 'German without Separator (22123 m³ / 21,5 m³)', value: 'de-plain' },
          { label: 'English with Separators (22,123 m³ / 21.5 m³)', value: 'en-grouped' },
          { label: 'Standard (22123 m³ / 21.5 m³)', value: 'en-plain' },
        ],
      },
    })
    .addNumberInput({
      path: 'readingDecimals',
      name: 'Meter Reading Decimals',
      category: ['Formatting & Status'],
      defaultValue: 0,
    })
    .addNumberInput({
      path: 'consumptionDecimals',
      name: 'Consumption Decimals',
      category: ['Formatting & Status'],
      defaultValue: 0,
    })
    .addTextInput({
      path: 'meterReadingUnit',
      name: 'Meter Reading Unit',
      category: ['Formatting & Status'],
      defaultValue: 'm³',
    })
    .addTextInput({
      path: 'consumption12hUnit',
      name: '12h Consumption Unit',
      category: ['Formatting & Status'],
      defaultValue: 'm³',
    })
    .addTextInput({
      path: 'consumptionYearUnit',
      name: 'Annual Consumption Unit',
      category: ['Formatting & Status'],
      defaultValue: 'm³',
    })
    .addNumberInput({
      path: 'freshnessHoursThreshold',
      name: 'Freshness Threshold in Hours (Green / Red Dot)',
      category: ['Formatting & Status'],
      description: 'Within this threshold = Green dot, older = Red dot',
      defaultValue: 24,
    })
    .addTextInput({
      path: 'excludedOperators',
      name: 'Excluded Operators',
      category: ['Formatting & Status'],
      description: 'Comma-separated list of operator names to hide from the panel (e.g. "Hauptbetreiber")',
      defaultValue: 'Hauptbetreiber',
    })
    .addBooleanSwitch({
      path: 'autoHeight',
      name: 'Dynamic Height (Auto-expand without inner scrollbar)',
      category: ['Formatting & Status'],
      description: 'Automatically adjusts panel height to display all data without an inner scroll box.',
      defaultValue: false,
    })
    .addBooleanSwitch({
      path: 'searchEnabled',
      name: 'Enable Search Bar (Authority View)',
      category: ['Formatting & Status'],
      defaultValue: true,
    })
    .addBooleanSwitch({
      path: 'defaultExpandedAccordions',
      name: 'Expand Operator Accordions by Default',
      category: ['Formatting & Status'],
      description: 'If disabled, all operator accordions start collapsed.',
      defaultValue: false,
    })
    .addBooleanSwitch({
      path: 'showSampleDataOnEmpty',
      name: 'Show Sample Data when Queries are Empty',
      category: ['Formatting & Status'],
      description: 'Displays demo rows when no data source is connected yet.',
      defaultValue: true,
    })

    // -------------------------------------------------------------
    // Category: Asset Navigation & Links
    // -------------------------------------------------------------
    .addTextInput({
      path: 'wellLinks.wellUrlPattern',
      name: 'Asset Link URL Pattern',
      category: ['Asset Navigation & Links'],
      description: 'Placeholders: ${wellId}, ${id_raw}, ${dashboardUid}, ${from}, ${to}',
      defaultValue: '/d/${dashboardUid}?var-GroupWells=$__all&from=${from}&to=${to}',
    })
    .addTextInput({
      path: 'wellLinks.targetDashboardUid',
      name: 'Target Dashboard UID (Fallback)',
      category: ['Asset Navigation & Links'],
      description: 'Fallback dashboard UID if not returned in query columns',
      defaultValue: '',
    })
    .addTextInput({
      path: 'wellLinks.defaultTimeFrom',
      name: 'Default Time Range From',
      category: ['Asset Navigation & Links'],
      defaultValue: 'now-5d',
    })
    .addTextInput({
      path: 'wellLinks.defaultTimeTo',
      name: 'Default Time Range To',
      category: ['Asset Navigation & Links'],
      defaultValue: 'now',
    })
    .addBooleanSwitch({
      path: 'wellLinks.openInNewTab',
      name: 'Open Link in New Tab',
      category: ['Asset Navigation & Links'],
      defaultValue: false,
    })

    // -------------------------------------------------------------
    // Category: Additional Stations & Weather
    // -------------------------------------------------------------
    .addBooleanSwitch({
      path: 'quickLinks.showGroundwaterLink',
      name: 'Show Central Network Monitoring Link (Authority)',
      category: ['Additional Stations & Weather'],
      defaultValue: true,
    })
    .addTextInput({
      path: 'quickLinks.groundwaterTitle',
      name: 'Network Monitoring Title',
      category: ['Additional Stations & Weather'],
      defaultValue: 'Zentrale Netz- & Pegelüberwachung',
    })
    .addTextInput({
      path: 'quickLinks.groundwaterLinkLabel',
      name: 'Network Monitoring Link Text',
      category: ['Additional Stations & Weather'],
      defaultValue: 'Zu den Netzmesswerten',
    })
    .addTextInput({
      path: 'quickLinks.groundwaterUrl',
      name: 'Network Monitoring URL',
      category: ['Additional Stations & Weather'],
      defaultValue: '/d/grid-telemetry',
    })
    .addBooleanSwitch({
      path: 'quickLinks.showWeatherLink',
      name: 'Show Weather Station Link',
      category: ['Additional Stations & Weather'],
      defaultValue: true,
    })
    .addTextInput({
      path: 'quickLinks.weatherTitle',
      name: 'Weather Station Title',
      category: ['Additional Stations & Weather'],
      defaultValue: 'Meteorologische Referenzstation',
    })
    .addTextInput({
      path: 'quickLinks.weatherInternalLinkLabel',
      name: 'Telemetry Data Link Text (Authority)',
      category: ['Additional Stations & Weather'],
      defaultValue: 'Zu den meteorologischen Stationsdaten',
    })
    .addTextInput({
      path: 'quickLinks.weatherInternalUrl',
      name: 'Telemetry Data URL',
      category: ['Additional Stations & Weather'],
      defaultValue: '/d/weather-telemetry',
    })
    .addTextInput({
      path: 'quickLinks.weatherExternalLinkLabel',
      name: 'External Weather Service Link Text (All)',
      category: ['Additional Stations & Weather'],
      defaultValue: 'Nationaler Wetterdienst (DWD)',
    })
    .addTextInput({
      path: 'quickLinks.weatherExternalUrl',
      name: 'External Weather Service URL',
      category: ['Additional Stations & Weather'],
      defaultValue: 'https://www.dwd.de',
    });
});

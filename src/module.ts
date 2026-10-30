import { PanelPlugin } from '@grafana/data';
import { CustomDashboardListPanel } from './components/CustomDashboardListPanel';
import { FieldSelectorEditor } from './components/FieldSelectorEditor';
import { CustomDashboardListOptions } from './types';

export const plugin = new PanelPlugin<CustomDashboardListOptions>(CustomDashboardListPanel).setPanelOptions((builder) => {
  builder
    // -------------------------------------------------------------
    // Category: Ansichtsmodus & Rolle
    // -------------------------------------------------------------
    .addRadio({
      path: 'viewMode',
      name: 'Ansichtsmodus',
      category: ['Ansichtsmodus & Rolle'],
      description: 'Automatische Rollenerkennung oder feste Ansicht erzwingen.',
      defaultValue: 'auto',
      settings: {
        options: [
          { label: 'Auto (Automatische Erkennung)', value: 'auto' },
          { label: 'Aufsichtsansicht (Gruppiert nach Betreiber)', value: 'authority' },
          { label: 'Betreiberansicht (Eigene Anlagen)', value: 'operator' },
        ],
      },
    })

    // -------------------------------------------------------------
    // Category: Spaltenzuordnung (Queries)
    // -------------------------------------------------------------
    .addCustomEditor({
      id: 'fieldMappings.wellNameField',
      path: 'fieldMappings.wellNameField',
      name: 'Bezeichnung der Station / Anlage',
      category: ['Spaltenzuordnung (Queries)'],
      description: 'Spalte mit dem Namen der Messstelle oder Anlage (z. B. "Einspeisestation Node-Alpha")',
      editor: FieldSelectorEditor,
      defaultValue: '',
    })
    .addCustomEditor({
      id: 'fieldMappings.wellIdField',
      path: 'fieldMappings.wellIdField',
      name: 'Anlagen-ID / Kennziffer',
      category: ['Spaltenzuordnung (Queries)'],
      description: 'Spalte mit der Kennziffer / ID (z. B. "FL-101")',
      editor: FieldSelectorEditor,
      defaultValue: '',
    })
    .addCustomEditor({
      id: 'fieldMappings.operatorField',
      path: 'fieldMappings.operatorField',
      name: 'Betreiber (Organisation / Unternehmen)',
      category: ['Spaltenzuordnung (Queries)'],
      description: 'Spalte mit dem Namen des Betreibers',
      editor: FieldSelectorEditor,
      defaultValue: 'Betreiber',
    })
    .addCustomEditor({
      id: 'fieldMappings.meterReadingField',
      path: 'fieldMappings.meterReadingField',
      name: 'Aktueller Zählerstand',
      category: ['Spaltenzuordnung (Queries)'],
      description: 'Spalte mit dem aktuellen Zählerstand',
      editor: FieldSelectorEditor,
      defaultValue: '',
    })
    .addCustomEditor({
      id: 'fieldMappings.consumption12hField',
      path: 'fieldMappings.consumption12hField',
      name: 'Verbrauch letzte 12 Std.',
      category: ['Spaltenzuordnung (Queries)'],
      description: 'Spalte mit dem Verbrauch der letzten 12 Stunden',
      editor: FieldSelectorEditor,
      defaultValue: '',
    })
    .addCustomEditor({
      id: 'fieldMappings.consumptionYearField',
      path: 'fieldMappings.consumptionYearField',
      name: 'Gesamtverbrauch Kalenderjahr',
      category: ['Spaltenzuordnung (Queries)'],
      description: 'Spalte mit dem kumulierten Jahresverbrauch',
      editor: FieldSelectorEditor,
      defaultValue: '',
    })
    .addCustomEditor({
      id: 'fieldMappings.lastSeenField',
      path: 'fieldMappings.lastSeenField',
      name: 'Übertragungszeitstempel (Funk / Telemetrie)',
      category: ['Spaltenzuordnung (Queries)'],
      description: 'Zeitstempel der letzten empfangenen Telemetrienachricht für die 24h-Prüfung',
      editor: FieldSelectorEditor,
      defaultValue: '',
    })
    .addCustomEditor({
      id: 'fieldMappings.statusField',
      path: 'fieldMappings.statusField',
      name: 'Status (Optionaler Override)',
      category: ['Spaltenzuordnung (Queries)'],
      description: 'Optional: Falls der Status bereits als 1/0 oder boolean vorliegt',
      editor: FieldSelectorEditor,
      defaultValue: '',
    })
    .addCustomEditor({
      id: 'fieldMappings.dashboardUidField',
      path: 'fieldMappings.dashboardUidField',
      name: 'Dashboard UID (Optional)',
      category: ['Spaltenzuordnung (Queries)'],
      description: 'Optional: Spalte mit individueller Grafana Dashboard-UID pro Station',
      editor: FieldSelectorEditor,
      defaultValue: '',
    })
    .addCustomEditor({
      id: 'fieldMappings.betreiberkennzahlField',
      path: 'fieldMappings.betreiberkennzahlField',
      name: 'Betreiber-ID Spalte (Optional)',
      category: ['Spaltenzuordnung (Queries)'],
      description: 'Optional: Spalte mit Betreiber-ID aus der Datenbank',
      editor: FieldSelectorEditor,
      defaultValue: '',
    })
    .addCustomEditor({
      id: 'fieldMappings.authorityNameField',
      path: 'fieldMappings.authorityNameField',
      name: 'Leitstelle / Behörde Spalte (Optional)',
      category: ['Spaltenzuordnung (Queries)'],
      description: 'Optional: Spalte mit Name der Leitstelle oder Aufsichtsbehörde',
      editor: FieldSelectorEditor,
      defaultValue: '',
    })
    .addCustomEditor({
      id: 'fieldMappings.userNameField',
      path: 'fieldMappings.userNameField',
      name: 'Benutzername Spalte (Optional)',
      category: ['Spaltenzuordnung (Queries)'],
      description: 'Optional: Spalte mit Name des Benutzers aus der Query (z. B. user_name)',
      editor: FieldSelectorEditor,
      defaultValue: '',
    })

    // -------------------------------------------------------------
    // Category: Kopfbereich & Begrüßung
    // -------------------------------------------------------------
    .addBooleanSwitch({
      path: 'header.showHeader',
      name: 'Kopfbereich anzeigen',
      category: ['Kopfbereich & Begrüßung'],
      defaultValue: true,
    })
    .addTextInput({
      path: 'header.headerTitle',
      name: 'Projekttitel',
      category: ['Kopfbereich & Begrüßung'],
      defaultValue: 'Smart Utility & Grid Operations',
    })
    .addTextInput({
      path: 'header.userName',
      name: 'Benutzername (Template / Fallback)',
      category: ['Kopfbereich & Begrüßung'],
      description: 'Unterstützt Grafana-Variablen wie ${__user.name} oder ${__user.login}',
      defaultValue: '${__user.name}',
    })
    .addTextInput({
      path: 'header.authorityName',
      name: 'Aufsichtsbehörde / Leitstelle (Fallback)',
      category: ['Kopfbereich & Begrüßung'],
      defaultValue: '',
    })
    .addTextInput({
      path: 'header.betreiberkennzahl',
      name: 'Betreiberkennzahl (Fallback)',
      category: ['Kopfbereich & Begrüßung'],
      defaultValue: '',
    })

    // -------------------------------------------------------------
    // Category: Formatierung & Status
    // -------------------------------------------------------------
    .addSelect({
      path: 'numberFormat',
      name: 'Zahlenformat',
      category: ['Formatierung & Status'],
      defaultValue: 'de-grouped',
      settings: {
        options: [
          { label: 'Deutsch Tausendertrennung (22.123 m³ / 21,5 m³)', value: 'de-grouped' },
          { label: 'Deutsch ohne Punkt (22123 m³ / 21,5 m³)', value: 'de-plain' },
          { label: 'Englisch (22,123 m³ / 21.5 m³)', value: 'en-grouped' },
          { label: 'Standard (22123 m³ / 21.5 m³)', value: 'en-plain' },
        ],
      },
    })
    .addNumberInput({
      path: 'readingDecimals',
      name: 'Nachkommastellen Zählerstand',
      category: ['Formatierung & Status'],
      defaultValue: 0,
    })
    .addNumberInput({
      path: 'consumptionDecimals',
      name: 'Nachkommastellen Verbrauchswerte',
      category: ['Formatierung & Status'],
      defaultValue: 0,
    })
    .addTextInput({
      path: 'meterReadingUnit',
      name: 'Einheit Zählerstand',
      category: ['Formatierung & Status'],
      defaultValue: 'm³',
    })
    .addTextInput({
      path: 'consumption12hUnit',
      name: 'Einheit Verbrauch 12h',
      category: ['Formatierung & Status'],
      defaultValue: 'm³',
    })
    .addTextInput({
      path: 'consumptionYearUnit',
      name: 'Einheit Gesamtverbrauch Kalenderjahr',
      category: ['Formatierung & Status'],
      defaultValue: 'm³',
    })
    .addNumberInput({
      path: 'freshnessHoursThreshold',
      name: 'Status-Schwelle in Stunden (Grün / Rot)',
      category: ['Formatierung & Status'],
      description: 'Innerhalb dieser Stundenzahl = Grüner Punkt, älter = Roter Punkt',
      defaultValue: 24,
    })
    .addTextInput({
      path: 'excludedOperators',
      name: 'Betreiber ausblenden / ignorieren',
      category: ['Formatierung & Status'],
      description: 'Kommagetrennte Liste von Betreibernamen, die im Panel ausgeblendet werden (z. B. "Hauptbetreiber")',
      defaultValue: 'Hauptbetreiber',
    })
    .addBooleanSwitch({
      path: 'autoHeight',
      name: 'Dynamische Höhe (Alle Daten ohne innere Scrollbox anzeigen)',
      category: ['Formatierung & Status'],
      description: 'Passt die Panel-Höhe dynamisch an den Inhalt an: klein bei wenigen Brunnen, groß bei vielen Brunnen.',
      defaultValue: true,
    })
    .addBooleanSwitch({
      path: 'searchEnabled',
      name: 'Suchleiste aktivieren (Aufsichtsansicht)',
      category: ['Formatierung & Status'],
      defaultValue: true,
    })
    .addBooleanSwitch({
      path: 'defaultExpandedAccordions',
      name: 'Betreiber-Akkordeons standardmäßig aufklappen',
      category: ['Formatierung & Status'],
      description: 'Standardmäßig alle Betreiber aufklappen (wenn deaktiviert, sind alle zugeklappt)',
      defaultValue: false,
    })
    .addBooleanSwitch({
      path: 'showSampleDataOnEmpty',
      name: 'Beispieldaten anzeigen wenn keine Daten geliefert werden',
      category: ['Formatierung & Status'],
      description: 'Zeigt Demodaten an, solange noch keine Datenquellen-Query verbunden ist.',
      defaultValue: true,
    })

    // -------------------------------------------------------------
    // Category: Anlagen-Verlinkung (Navigation)
    // -------------------------------------------------------------
    .addTextInput({
      path: 'wellLinks.wellUrlPattern',
      name: 'URL-Muster für Anlagenlink',
      category: ['Anlagen-Verlinkung (Navigation)'],
      description: 'Platzhalter: ${wellId}, ${id_raw}, ${dashboardUid}, ${from}, ${to}',
      defaultValue: '/d/${dashboardUid}?var-device_id=${wellId}&from=${from}&to=${to}',
    })
    .addTextInput({
      path: 'wellLinks.targetDashboardUid',
      name: 'Ziel-Dashboard UID (Fallback)',
      category: ['Anlagen-Verlinkung (Navigation)'],
      description: 'UID des Detail-Dashboards falls nicht in der Spalte vorhanden',
      defaultValue: '',
    })
    .addTextInput({
      path: 'wellLinks.defaultTimeFrom',
      name: 'Standard-Zeitbereich Von',
      category: ['Anlagen-Verlinkung (Navigation)'],
      defaultValue: 'now-7d',
    })
    .addTextInput({
      path: 'wellLinks.defaultTimeTo',
      name: 'Standard-Zeitbereich Bis',
      category: ['Anlagen-Verlinkung (Navigation)'],
      defaultValue: 'now',
    })
    .addBooleanSwitch({
      path: 'wellLinks.openInNewTab',
      name: 'In neuem Tab öffnen',
      category: ['Anlagen-Verlinkung (Navigation)'],
      defaultValue: false,
    })

    // -------------------------------------------------------------
    // Category: Weitere Messstellen & Wetter
    // -------------------------------------------------------------
    .addBooleanSwitch({
      path: 'quickLinks.showGroundwaterLink',
      name: 'Zentrale Netzüberwachung anzeigen (Aufsicht)',
      category: ['Weitere Messstellen & Wetter'],
      defaultValue: true,
    })
    .addTextInput({
      path: 'quickLinks.groundwaterTitle',
      name: 'Titel Netzüberwachung',
      category: ['Weitere Messstellen & Wetter'],
      defaultValue: 'Zentrale Netz- & Pegelüberwachung',
    })
    .addTextInput({
      path: 'quickLinks.groundwaterLinkLabel',
      name: 'Linktext Netzüberwachung',
      category: ['Weitere Messstellen & Wetter'],
      defaultValue: 'Zu den Netzmesswerten',
    })
    .addTextInput({
      path: 'quickLinks.groundwaterUrl',
      name: 'URL Netzüberwachung',
      category: ['Weitere Messstellen & Wetter'],
      defaultValue: '/d/grid-telemetry',
    })
    .addBooleanSwitch({
      path: 'quickLinks.showWeatherLink',
      name: 'Wetterstation anzeigen',
      category: ['Weitere Messstellen & Wetter'],
      defaultValue: true,
    })
    .addTextInput({
      path: 'quickLinks.weatherTitle',
      name: 'Titel Wetterstation',
      category: ['Weitere Messstellen & Wetter'],
      defaultValue: 'Meteorologische Referenzstation',
    })
    .addTextInput({
      path: 'quickLinks.weatherInternalLinkLabel',
      name: 'Linktext Telemetriedaten (Aufsicht)',
      category: ['Weitere Messstellen & Wetter'],
      defaultValue: 'Zu den meteorologischen Stationsdaten',
    })
    .addTextInput({
      path: 'quickLinks.weatherInternalUrl',
      name: 'URL Meteorologische Stationsdaten',
      category: ['Weitere Messstellen & Wetter'],
      defaultValue: '/d/weather-telemetry',
    })
    .addTextInput({
      path: 'quickLinks.weatherExternalLinkLabel',
      name: 'Linktext Wetterdienst (Alle)',
      category: ['Weitere Messstellen & Wetter'],
      defaultValue: 'Nationaler Wetterdienst (DWD)',
    })
    .addTextInput({
      path: 'quickLinks.weatherExternalUrl',
      name: 'URL Externer Wetterdienst',
      category: ['Weitere Messstellen & Wetter'],
      defaultValue: 'https://www.dwd.de',
    });
});

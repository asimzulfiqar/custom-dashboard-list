# Custom Dashboard List Panel for Grafana

A modern, responsive Grafana landing page and portal panel plugin designed for multi-operator utility grids, industrial asset monitoring, smart metering, and supervisory oversight portals.

## Key Features

- **Dual-Role Layouts**:
  - **Aufsichtsansicht (Authority / Regulator View)**: Hierarchical accordions grouped by **Operator** (Betreiber), live aggregate metrics (12h consumption, cumulative year totals), online/offline status counts, full-text search, central telemetry quick links, and environmental reference station links.
  - **Betreiberansicht (Operator View)**: Dedicated flat view showing only the operator's authorized assets, displaying their **Betreiber-ID**, and external weather link.
- **Dynamic Query Mapping**:
  - Map any columns from SQL databases (PostgreSQL, MySQL) and time-series databases (InfluxDB):
    - Station / Asset Name
    - Station ID / Meter Number
    - Operator / Company
    - Current Meter Reading
    - 12h Consumption
    - Cumulative Year Consumption
    - Transmission Timestamp / Freshness
- **Freshness & Status Indicators**:
  - Compares last transmission timestamp against a customizable freshness threshold (default: 24 hours).
  - 🟢 Green indicator if data received within threshold.
  - 🔴 Red indicator if offline $> 24$ hours.
  - Detailed hover tooltip with exact date/time and relative freshness.
- **German Number Formatting**:
  - Standard German grouped numbers (e.g. `245.890 m³`, `124 m³`, `0 m³`), configurable decimals, and custom units (`m³`, `kWh`, `MWh`).
- **Fully Responsive Architecture**:
  - Desktop: Clean data table with right-aligned values and sticky-style headers.
  - Mobile (< 680px): Automatically converts into responsive mobile stat cards with zero horizontal scrolling.
- **Direct Drill-down Links**:
  - Clickable assets that navigate to parameterized Grafana dashboards (`/d/${dashboardUid}?var-device_id=${wellId}&from=now-7d&to=now`).

---

## Installation & Adding to Grafana

### 1. Build the Plugin
First, build the production distribution bundle:

```bash
# Install dependencies
npm install

# Build the production bundle into dist/
npm run build
```

This compiles all assets into the `dist/` directory.

---

### 2. Install into your Grafana Instance

#### Option A: Linux / Production Server
1. Copy the compiled `dist/` folder into your Grafana plugins directory:
   ```bash
   sudo mkdir -p /var/lib/grafana/plugins/asimzulfiqar-customdashboardlist-panel
   sudo cp -r dist/* /var/lib/grafana/plugins/asimzulfiqar-customdashboardlist-panel/
   ```

2. Allow loading unsigned plugins in `/etc/grafana/grafana.ini`:
   ```ini
   [plugins]
   allow_loading_unsigned_plugins = asimzulfiqar-customdashboardlist-panel
   ```
   *(Or pass the environment variable `GF_PLUGINS_ALLOW_LOADING_UNSIGNED_PLUGINS=asimzulfiqar-customdashboardlist-panel`)*

3. Restart the Grafana service:
   ```bash
   sudo systemctl restart grafana-server
   ```

#### Option B: Docker Container
If running Grafana via Docker or Docker Compose, mount the `dist/` directory into the container:

```yaml
services:
  grafana:
    image: grafana/grafana:latest
    ports:
      - "3000:3000"
    volumes:
      - ./dist:/var/lib/grafana/plugins/asimzulfiqar-customdashboardlist-panel
    environment:
      - GF_PLUGINS_ALLOW_LOADING_UNSIGNED_PLUGINS=asimzulfiqar-customdashboardlist-panel
```

---

### 3. Adding the Panel to a Dashboard

1. Open your Grafana instance in your browser.
2. Navigate to your dashboard (or create a new one) and click **Add visualization**.
3. In the visualization selector on the right panel, search for **Custom Dashboard List**.
4. Add your data queries (e.g., PostgreSQL query for asset metadata and InfluxDB query for meter readings).
5. In the panel options panel on the right:
   * **Ansichtsmodus & Rolle**: Select `Auto`, `Aufsichtsansicht`, or `Betreiberansicht`.
   * **Spaltenzuordnung (Queries)**: Select your query fields for Station Name, ID, Betreiber, Zählerstand, 12h, and Jahr.
   * **Kopfbereich & Begrüßung**: Customize the header title, username variable (`${__user.name}`), and authority/operator ID.
   * **Anlagen-Verlinkung**: Set the drill-down URL pattern (e.g., `/d/detail-view?var-device_id=${wellId}`).
6. Click **Save** and **Apply**.

---

### 4. Terraform Dashboard Provisioning (Optional)

To provision this panel automatically via Terraform or dashboard JSON templates, use panel type `asimzulfiqar-customdashboardlist-panel`:

```json
{
  "id": 1,
  "gridPos": { "h": 20, "w": 24, "x": 0, "y": 0 },
  "type": "asimzulfiqar-customdashboardlist-panel",
  "title": "",
  "options": {
    "viewMode": "auto",
    "fieldMappings": {
      "operatorField": "Betreiber"
    },
    "header": {
      "showHeader": true,
      "headerTitle": "Smart Utility & Grid Operations",
      "userName": "${__user.name}"
    },
    "wellLinks": {
      "wellUrlPattern": "/d/device-detail?var-device_id=${id}&from=now-7d&to=now"
    }
  }
}
```

---

## Local Development & Testing

```bash
# Run typecheck
npm run typecheck

# Run unit tests
npm run test:ci

# Start local pre-provisioned Grafana container
npm run server
```

Open `http://localhost:3000` to view the pre-configured example dashboard.

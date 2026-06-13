# Congregation Directory SPA

A standalone, browser-based person directory search application built as a single HTML file. It imports a `Persons.csv` export, builds a local SQLite database in your browser, and provides a fast, tag-driven search interface — with no server, no installation, and no build step required.

---

## Getting Started

1. Open `index.html` in any modern browser (Chrome, Firefox, Edge, Safari).
2. Click **Open Settings & Import** (or the ⚙️ icon in the top-right corner).
3. Under **Data Import**, upload your `Persons.csv` file or configure a URL to fetch it from.
4. The directory loads and is ready to search.

> **Note:** Because sql.js and Tailwind are loaded from CDN, the browser needs an internet connection on first load. After the initial load, all data is stored locally.

---

## Features

### Search & Filter

- **Name search** — filter by first name, last name, or display name.
- **Tag filter panel** — all tags generated from the CSV are grouped by category and displayed as clickable chips.
- **Tag filter modes:**
  - Click a tag once → **Include** (highlighted in theme colour)
  - Click again → **Exclude / NOT** (highlighted in red)
  - Click a third time → removes the filter
- **AND / OR mode** — toggle between:
  - **AND** — person must match *all* included tags
  - **OR** — person must match *at least one* included tag
  - Excluded (NOT) tags are always applied regardless of AND/OR mode
- Active filters are shown as chips below the search bar and can be removed individually or all at once.

### Tag Categories

| Category | Description |
|---|---|
| Congregation Status | Publisher, Baptized, Unbaptized Publisher, Associated Family, Active, Inactive, Field Service Group |
| Appointment | Elder, Ministerial Servant, Regular Pioneer, Continuous Auxiliary Pioneer, Special Pioneer |
| Family | Male, Female, Family Head, Family name |
| Field Service Group | Field Service Group Overseer, Field Service Group Assistant |
| OCLM / Student | OCLM Enrolled, Bible Reading, Initial Call, Follow Up, Making Disciples, Explaining Beliefs, Talks, Assistant |
| Meeting Assignments | Midweek Chairman, Midweek Classroom Counselor, Prayer |
| Treasures from God's Word | Treasure from God's Word, Digging for Spiritual Gems |
| Living as Christians | Living as Christians Parts |
| Congregation Bible Study | CBS Conductor, CBS Reader |
| Public Meeting | Local Public Talks, Away Public Talks, Weekend Chairman, Watchtower Reader |
| Field Service | Local Public Witnessing, Local Public Witnessing Key Person, Meeting for Field Service Conductor/Prayer, Local Maintenance Volunteer |
| Hall Duties | Auditorium Attendant, Entrance Attendant, Video Conference Host, Microphone Carrier, Audio/Video Operator, Stage Attendant |

### Person Cards & Detail View

Each person is displayed as a card showing:
- Initials avatar (colour-coded by name)
- Full name, field service group, and family name
- Key appointment badges (Elder, MS, Pioneer, etc.)
- Status badges (Inactive, Moved, Child, Removed)
- Mobile phone number (tap to call on mobile devices)

Tap or click any card to open a **detail modal** showing full contact information, all tags organised by category, and biographical details.

- **Sort & group** — a control in the results header sorts cards by name or age, or groups them by field service group or family.
- **Per-person notes** — the detail modal has a free-text **Notes** field. Notes are stored locally in your browser (IndexedDB), kept separate from the imported CSV so they survive re-imports. A 📝 marker appears on cards that have a note.

### Analysis & Reports

Accessed via the **Analyze** menu in the results header. Every report reflects the **current filter/search** — filter first to scope a report to a group, age band, etc.

- **Statistics** — gender breakdown and age distribution.
- **Demographics & Care** — median age, % over 65, children, baptized publishers; appointment ratios (publishers per elder, pioneers as % of publishers); congregation-wide household counts (single vs. multi-person, households with children); groups flagged for having one elder or no ministerial servant; and a **care list** of those marked elderly/infirm, blind, deaf, or incarcerated, highlighting who lives alone.
- **Capability Coverage** — for each meeting part and hall duty, how many people are marked eligible. Counts are colour-coded so **0 (nobody)** and **1–2 (single point of failure)** stand out; expand any row to see exactly who. Filter to *Active* first for a realistic picture.
- **Map** — family markers with geocoding (see existing map features).
- **FSGs** — service group distribution chart and table.
- **Data Quality** — records missing a mobile, email, address, coordinates, or date of birth, plus incomplete addresses. Expand a category to see and open the affected people, then fix them in New World Scheduler and re-import.

### Actions, Sharing & Print

Accessed via the **Actions** menu (operates on the current results):

- **Email All / Text All** — open a pre-addressed email or SMS.
- **Copy Emails / Copy Phone Numbers** — copy the current list to the clipboard for pasting into other tools.
- **vCards** — download contacts.
- **Print…** — choose a **Directory** table, per-group **FSG Contact Sheets** (one page per group), or a household **Address List**.
- **Saved Filters…** — name and store the current filter/search combination, then re-apply it in one click later. Presets are saved in browser `localStorage`.

### Data Import

**Manual CSV Upload**
- Click or drag-and-drop a `Persons.csv` file onto the upload area in Settings.
- The file must match the column structure exported by the congregation management software (see [CSV Format](#csv-format) below).
- `Persons.csv` can be exported from the **New World Scheduler** application.

**Auto-Fetch from URL**
- Enter a URL pointing to a hosted `Persons.csv` file.
- Enter a username and password if the URL requires HTTP Basic authentication.
- Click **Fetch Now** to import immediately.
- Set an **Auto-sync interval** (hourly, 6-hourly, daily, or weekly) to have the app check for updates automatically on startup.
- The URL can target a deployment of [persons-uploader](https://github.com/jgruber/persons-uploader), a companion app that serves the latest `Persons.csv` export over HTTP.

### Database

- The SQLite database is stored entirely in your browser's **IndexedDB** — it persists across page reloads without any server.
- The schema is identical to the one produced by `syncPersons.py`, with tables: `congregations`, `field_service_groups`, `families`, `persons`, and `tags`.
- **Export .db File** — download the database as a standard `.db` file compatible with any SQLite tool.
- **Clear Database** — permanently remove all data from the browser.

### Appearance

Accessed via the ⚙️ Settings menu:

- **Dark / Light mode** — toggle between themes; defaults to your system preference on first load.
- **Theme colour** — choose from Blue, Indigo, Green, Purple, Orange, or Rose. The selection is saved between sessions.

---

## CSV Format

The application expects a CSV file with the standard column headers produced by the congregation management software. `Persons.csv` can be exported from the **New World Scheduler** application. Required columns include:

| Column | Description |
|---|---|
| `PersonID` | Unique integer identifier |
| `FirstName`, `LastName`, `DisplayName` | Name fields |
| `Gender` | `Male` or `Female` |
| `DOB` | Date of birth (`YYYY/MM/DD`) |
| `DateOfBaptism` | Baptism date (`YYYY/MM/DD`) |
| `PhoneMobile`, `PhoneHome`, `PhoneWork` | Phone numbers |
| `Email`, `Email2` | Email addresses |
| `Address` | Full street address (multiline supported) |
| `FamilyID`, `FamilyName`, `FamilyHead` | Family grouping |
| `FieldServiceGroupID`, `GroupName`, `GroupResponsibility` | FSG assignment (`Overseer`, `Assistant`, or blank) |
| `Privilege` | `E` (Elder), `MS` (Ministerial Servant), `PUB` (Publisher), `UBP` (Unbaptized Publisher), `No` (Associated) |
| `PioneerStatus` | `RegularPioneer`, `AuxiliaryPioneer`, `SpecialPioneer`, or blank |
| `Active` | `True` or `False` |
| `CLMStudent` | `True` or `False` |
| `Moved`, `Removed` | `True` or `False` |
| `ElderlyInfirm`, `Blind`, `Deaf`, `Child`, `Incarcerated` | Special circumstances (`True`/`False`) |
| `UseFor*` | Assignment eligibility flags (`True`/`False`) — see full list in the CSV header |

---

## Customizing Congregation-Specific Tag Columns

Several `Persons.csv` columns exported by New World Scheduler are generic — their meaning varies by congregation. `index.html` must be edited manually to reflect what each column means for your congregation.

### Where to edit in `index.html`

Search for the comment block:

```
// ── CONGREGATION CUSTOMIZATION START ─
```

Everything between that marker and `// ── CONGREGATION CUSTOMIZATION END ─` is the area you need to edit. Each entry in the `useForMap` array follows this format:

```js
['CsvColumnName', 'tagType', 'Tag label shown in UI'],
```

- **`CsvColumnName`** — the exact column header from `Persons.csv`
- **`tagType`** — controls which category section the tag appears in (see table below)
- **`'Tag label shown in UI'`** — the text shown on the tag chip and in the filter panel

To add a tag for any other `True`/`False` column in `Persons.csv` that is not already listed, append a new entry in the same format. Columns that contain `False` are silently ignored, so unused entries cause no harm.

**Available tag types:**

| `tagType` value | UI category heading |
|---|---|
| `congregation` | Congregation Status |
| `appointment` | Appointment |
| `family` | Family |
| `field_service_group` | Field Service Group |
| `usefor` | Meeting Assignments |
| `treasures` | Treasures from God's Word |
| `student` | OCLM / Student |
| `living` | Living as Christians |
| `cbs` | Congregation Bible Study |
| `public` | Public Meeting |
| `service` | Field Service |
| `duty` | Hall Duties |

---

### `UseForDuty[N]` — Hall Duties

New World Scheduler exports up to seven `UseForDuty[N]` boolean columns. By default, `index.html` maps them as follows:

| CSV Column | Default Tag Name |
|---|---|
| `UseForDuty1` | Auditorium Attendant |
| `UseForDuty2` | Entrance Attendant |
| `UseForDuty3` | Video Conference Host |
| `UseForDuty4` | Microphone Carrier |
| `UseForDuty6` | Audio/Video Operator |
| `UseForDuty7` | Stage Attendant |

> **Note:** `UseForDuty5` is omitted by default — add it explicitly if your congregation uses it.

To rename a duty, change the third element of the relevant entry. For example, if `UseForDuty5` is used for "Sound Desk Operator":

```js
['UseForDuty5', 'duty', 'Sound Desk Operator'],
```

---

### `UseForCleaningType[N]` — Cleaning Groups

New World Scheduler exports `UseForCleaningType[N]` boolean columns whose meaning (e.g. which cleaning roster a person is on) is entirely congregation-specific. The default mapping uses placeholder names:

| CSV Column | Default Tag Name |
|---|---|
| `UseForCleaningType1` | Cleaning Group 1 |
| `UseForCleaningType2` | Cleaning Group 2 |
| `UseForCleaningType3` | Cleaning Group 3 |
| `UseForCleaningType4` | Cleaning Group 4 |

Change the tag label to match your congregation's actual cleaning group names. Remove or comment-out rows for columns your CSV does not include.

---

### `UseForGardenCareType[N]` — Garden / Grounds Care Groups

`UseForGardenCareType[N]` columns follow the same pattern. The default mapping uses placeholder names:

| CSV Column | Default Tag Name |
|---|---|
| `UseForGardenCareType1` | Garden Care Group 1 |
| `UseForGardenCareType2` | Garden Care Group 2 |
| `UseForGardenCareType3` | Garden Care Group 3 |
| `UseForGardenCareType4` | Garden Care Group 4 |

Change the tag label to match your congregation's actual garden care group names. Remove or comment-out rows for columns your CSV does not include.

---

### Renaming the "Hall Duties" category heading or colour

All `duty`-type tags (hall duties, cleaning, and garden care) share the same category heading and chip colour. To rename the heading shown in the filter panel and detail modal, find the `TAG_LABELS` object and change the `duty` value:

```js
duty: 'Hall Duties',   // ← change to suit your congregation
```

To change the chip colour, find `TAG_COLORS` and update the `duty` entry using Tailwind CSS utility classes:

```js
duty: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300',
```

### Summary of changes required per customization

| What you're changing | Where to edit |
|---|---|
| Which CSV column maps to which tag label | `useForMap` array between the `CONGREGATION CUSTOMIZATION` comments |
| Category heading in the UI | `TAG_LABELS.duty` |
| Chip colour in the UI | `TAG_COLORS.duty` |

---

## Technical Details

| Component | Technology |
|---|---|
| UI framework | [Tailwind CSS](https://tailwindcss.com) (Play CDN) |
| Database engine | [sql.js](https://sql.js.org) 1.10.2 (SQLite compiled to WebAssembly) |
| Persistence | Browser IndexedDB |
| Dependencies | None — single HTML file, CDN only |

### Browser Compatibility

Requires a modern browser with support for:
- WebAssembly
- IndexedDB
- ES2020+ (async/await, optional chaining, etc.)

Tested on current versions of Chrome, Firefox, Edge, and Safari.

### Privacy & Security

- All data is processed and stored **locally in your browser**. Nothing is sent to any external service.
- HTTP Basic authentication credentials entered for URL auto-fetch are saved in browser `localStorage`. Do not use this feature on a shared or public computer.
- If the target URL is on a different origin, the server must send appropriate **CORS headers** (`Access-Control-Allow-Origin`) for the browser to allow the fetch. This is a browser security restriction that cannot be bypassed.

---

## Relationship to `syncPersons.py`

`index.html` is the browser-side counterpart to the Python `syncPersons.py` script. It reproduces the same data processing logic entirely in JavaScript:

- Parses the `Persons.csv` format (including quoted multiline fields)
- Builds the same SQLite table schema (`persons`, `families`, `field_service_groups`, `congregations`, `tags`)
- Generates the same tag records (type/name/value) for every person
- Applies the same address parsing heuristic to split raw address strings into street, city, state, and postal code components

The legacy database portions of `syncPersons.py` are not replicated, as the SPA operates independently of any server-side database.

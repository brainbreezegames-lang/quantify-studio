# Avontus Quantify — Complete Docs Reference
> Compiled from all publicly accessible Avontus sources. Use this when designing any Quantify mobile screen.

---

## What Quantify Is
Windows desktop app (client-server) for scaffolding rental & inventory management. Tracks equipment across yards and job sites, manages billing/invoicing, shipping logistics, and reporting.

**Deployment:** On-premise (SQL Server) or Cloud (Azure via Avontus QuAD). Authentication via Microsoft Entra ID (work email).

---

## Editions

| Edition | Key Additions |
|---------|--------------|
| **Small Business** | Core inventory, shipments, billing, invoicing |
| **Enterprise** | + Scaffold register, custom properties, forecasting pivot, Quantify Web |
| **Industrial** | + Scaffold Activities, activity-level invoicing, advanced scaffold register |

---

## Location Hierarchy

```
Branch Office (main yard/stocking location — where equipment lives + billing comes from)
 └── Sub-Branch / Laydown Yard (secondary stocking)
 └── Staging Area (temporary holding — NOT billed, no inventory adjustment)
 └── Job Site — Regular (track equipment to a location)
 └── Job Site — Tagged (track equipment to specific individual scaffolds)
      └── Group / Area (sub-area within a job site, e.g. "Front Nave", "Tower")
           └── Scaffold (individual structure — Tagged jobs only)
```

### Job Site Types (Critical Distinction)
- **Regular Job Site** — equipment tracked to a location only. Standard rental.
- **Tagged Job Site** — equipment tracked to individual scaffolds at the location. Used for large industrial sites with hundreds/thousands of scaffolds. Requires scaffold tracking to be enabled.

### Staging Area (Important for Mobile)
- Equipment sits here WITHOUT billing — it's a free holding zone
- Used at large industrial complexes: all equipment staged here, moved to individual scaffolds as built
- **Returns must go back to the staging area, NOT the job site** — this can break mobile workflows if not handled correctly

---

## Core Modules

1. **Customers** — customer records
2. **Products** (Product Catalog) — rental equipment catalog
3. **Branch Offices / Laydown Yards** — stocking locations
4. **Job Sites** — active rental sites
5. **Estimates** — quotes/bids
6. **Shipments / Transactions** — DEL, RET, TRF, RSV movements
7. **Invoicing** — billing and invoice generation
8. **Inventory** — real-time stock levels
9. **Reservations** — future-dated material holds
10. **Reports / Pivots** — custom pivot reports
11. **Scaffold Register** (Enterprise/Industrial) — scaffold lifecycle
12. **Reminders** — notifications and alerts
13. **Service Tickets** — maintenance work orders
14. **Global Options** — system-wide configuration

---

## Shipment / Transaction Types

| Code | Name | Description |
|------|------|-------------|
| **DEL** | Delivery | Ships to job site; rent starts accruing |
| **RET** | Return | Returns from job site; rent stops |
| **TRF** | Transfer | Move between locations (branch↔branch or branch↔jobsite; job-to-job transfers exist but excluded from mobile app — fringe case) |
| **RSV** | Reservation | Future-dated material hold |
| **Sell** | Sale | Sell products outright |

---

## The 4 Things on a Shipment (from interview)

1. **Products** — the physical scaffold equipment (tubes, boards, couplers, standards, ledgers, etc.)
2. **Consumables** — one-way items that never come back (netting, sheeting, plastic ties). Burned/buried on site.
3. **Additional Charges** — one-off fees on a shipment (erection fee, transport, dismantle charge)
4. **Recurring Charges** — a fixed amount billed every 28 days regardless of equipment quantity. Sent out like a product; bringing it back stops the billing.

---

## The 3 Ways to Send Equipment (from interview — CRITICAL)

### Way 1 — Direct Shipment (instant)
```
New Shipment → add products → hit OK → done
```
- **Rent start date is configurable**, not always instant: either set explicitly on each shipment, or via a global option that defaults to Today+x days
- No verification step
- Done by desktop (or mobile)
- **Mobile app: probably not needed here**
- Photos/attachments can be added to any shipment (common when there are discrepancies)

### Way 2 — Reservation → Confirm
```
Create Reservation → equipment held as "Reserved" (removed from available stock)
→ Yard workers count + load truck
→ Desktop/Mobile enters actual quantities sent → taps OK
→ Equipment on rent ✓
```
- Reservation "holds" stock so others can't use it
- Reserved items appear in stock as "Reserved" not "Available"
- Yard workers can barcode-scan items as they load
- If shortages found, there's a checkbox to create a new reservation for the short items
- **Mobile app: yard worker counting + confirming what went on the truck**

### Way 3 — Reservation → Confirm → Customer Confirmation (most controlled)
```
Create Reservation → Yard counts + loads
→ Desktop/Mobile taps OK → equipment marked "In Transit" (not yet on rent)
→ Customer physically counts what arrived → confirms
→ If mismatch: status becomes "Discrepancies" → resolved → on rent ✓
```
- Used when customer disputes quantities
- Can hide quantities from customer so they must count themselves
- **Discrepancy flow**: mismatch creates a "Discrepancies" status; must be resolved before going on rent
  - Customer counted wrong → item goes on rent (customer pays)
  - Company didn't load it → goes back to available stock (company's fault)
- **Signatures**: delivery driver signs + customer rep signs (freeform text field) on the In Transit delivery
- Photos/attachments strongly encouraged when discrepancies exist
- **Mobile app: both yard counting AND customer confirmation steps**

**Client's words:** *"To me, when I think of a mobile app, I see somebody with a tablet in the yard confirming what went."*

---

## Barcode / Scanning Feature (from interview)

Two modes when creating a shipment:
1. **Scan individual items** — beep each piece one at a time
2. **Scan a group/kit** — one barcode = entire kit. E.g., scan "Tower Kit" automatically adds: 4 casters + 8 verticals + 24 guardrails + 50 boards + 1 ladder. Company sets up kits in advance.

Scanning is available on reservations too — yard workers scan as they load.

---

## The 2 Ways to Bring Equipment Back (from interview)

### Way 1 — Direct Return (direct shipment from job to branch)
```
Right-click → Return → enter quantities → hit OK → rent stops ✓
```
- Instant, simple
- No scheduling
- Yard types what came in

### Way 2 — Pre-Return (client's preferred method)
```
Create Pre-Return (set future date + expected items)
→ Truck arrives → workers count items off truck
→ Desktop/Mobile confirms actual quantities → rent stops ✓
```
- Client prefers this because date is set once and everything aligns
- Also used for overnight drops: print bin tags (sheet of paper attached to return bins) → workers unload into bays → count in the morning
- **Mobile app: yard worker counting what comes off the truck**

---

## Equipment Condition on Returns (from interview — IMPORTANT)

During a return or pre-return, each item can be flagged with a condition:

| Condition | Meaning | What Happens |
|-----------|---------|--------------|
| **Normal** | Item is fine | Goes back to Available stock |
| **To Be Serviced** | Needs inspection/service before reuse | Goes to "To Be Serviced" queue; serviced then back to stock |
| **Damaged** | Broken, might be fixable | Goes to Out of Service; later repaired or scrapped |
| **Scrapped** | Completely unusable | Written off permanently |
| **Lost** | Disappeared | Written off; customer may be charged |

**To Be Serviced detail:**
- Some products are always set to require servicing (e.g., safety harnesses) — configured in Product Catalog
- Can bill customer for the servicing cost
- Limitation: can't split same product into "serviced" and "not serviced" on the same return

**Limitation from client:** *"Very annoying — if I want to service 2 couplers and send 18 back to stock, I can't do both on the same delivery."*

---

## Over-Returns & Negative Balances (from interview — edge case)

A **negative balance** happens when more items come back than went out. Real-world reasons:
- Customer picked up someone else's equipment on the same site
- A 10-foot tube was cut down on site into two 5-foot tubes — both come back, but only one 10-foot went out
- Equipment was on site that no one knew about

**The system allows this** — it creates a negative balance on the job site record.

Example from interview: "7-foot board cut down to 5-foot on site. Comes back as a 5-foot board. System shows -1 of 7-foot board on job site."

**Mobile app implication:** The count screen must allow workers to enter parts that weren't on the original shipment.

---

## New Direct Ship Dialog — Tabs & Structure

Up to 6 tabs:
1. **Shipment Properties** — custom properties per shipment (configured in Global Options)
2. **Products** — line items with quantities; filter by category or text; barcode scanning toggle
3. **Consumables** — one-way items
4. **Additional Charges** — one-off fees
5. **Recurring Charges** — fixed periodic billing items
6. **Attachments** — attach files

**Shipment direction options:**
- Branch → Job Site / Group
- Branch → Branch
- Job Site / Group → Branch
- Job Site / Group → Job Site / Group

**Key fields on shipment:**
- Planned ship date
- Actual ship date
- Salesperson
- Driver (person responsible) OR Vehicle
- Rent start date (when billing begins)

**Pick Tickets (desktop only):** A pick ticket comes from a reservation — it's a printed report showing expected quantities. Yard workers fill it out by hand (what they actually loaded), then bring it back to the office to enter into Quantify desktop.
- **Mobile app replaces this**: instead of printing and carrying a pick ticket, yard workers do the "picking" directly in the app (filling out the reservation in real-time). No physical pick ticket is printed when mobile is used.
- Signature lines appear on the pick ticket when delivering an In Transit shipment: Prepared by / Delivered by / Received by (2–5 lines configurable)
- Bin tags: separate small printout to attach to return bins (different from pick ticket)

---

## Estimates

**Tabs:** Summary, Products, Consumables

**Fields:**
- Customer (dropdown)
- Label (name/title)
- Price Type: Rent / Sell Available / Sell New
- Rent Discount (%)
- Delivery Date
- Number of Periods
- Product rows with Quantity column

**From Estimate → can create:** Reservation, Delivery, Shipment, Sell Transaction

---

## Job Site Dialog — Tabs & Fields

**Tabs:** General, Scaffolds, Billing, Properties

**Billing Settings (required):**
- Rate Profile (assign from list)
- Billing Method: Arrears / Advance / FATA (First Advance Then Arrears)
- Customer (dropdown)
- Tax Rate
- Invoice Up To date

**Option:** Configure job site to count shipments upon receipt (field confirmation workflow).

---

## Inventory States

| State | Meaning |
|-------|---------|
| **Available** | In yard, ready to ship |
| **On Rent** | At a job site, actively billing |
| **Reserved** | Held for future delivery |
| **To Be Serviced** | Returned, needs maintenance |
| **Out of Service** | Damaged/lost, not rentable |
| **Re-rent** | Rented from 3rd party vendor |

---

## Rate Profiles

- Grid of rental rates, sell prices, replacement costs per product
- Must be marked Active to be usable
- Assigned to Job Sites and Estimates
- Two modes (configured in Global Options > Billing Tab):
  - **Single Rate Mode** — default rates from Product Catalog
  - **Rate Profile Mode** — per-piece rates per job site

---

## Billing & Invoicing

**Invoice Generation:**
1. Set Invoice Up To date on Job Site
2. Quantify calculates all charges in that period
3. Preview and print or export to accounting

**Invoice Types:**
- Detailed / Summary with Rent Lines / Summary with Rent Lines (Landscape) / Summary
- Scaffold Invoice / Scaffold Summary Invoice / Scaffold PO/WO Summary (Industrial)

**Billing Methods:**
- **Arrears** — charge after rental period
- **Advance** — charge before rental period
- **FATA** — first advance, then arrears

**Accounting Integrations:** QuickBooks, Xero (OAuth 2.0), Sage 50, Oracle

---

## Scaffold Register (Enterprise / Industrial)

**Scaffold Record Fields:**
- Scaffold Number / Tag
- Description
- Type
- Location
- Status
- Planned Build Date / Actual Build Date
- Planned Dismantle Date / Actual Dismantle Date
- Days Standing
- Total Weight
- Total Number of Pieces
- Precautions (safety notes)
- Custom properties (configured in Global Options)

**5 Scaffold Pivot Reports:**
1. Scaffolds (summary: status, days standing, weight, pieces)
2. Scaffold Activities (Industrial only)
3. Inspections (history per scaffold)
4–5. (Additional reports)

**Inspections:**
- Inspection Date, Pass/Fail, Inspector Name
- Automatic inspection reminders
- Full history per scaffold

**Scaffold Activities (Industrial):**
- Record erection, dismantle, or other tasks
- Can invoice down to activity level

**QR Codes:**
- Print QR labels for scaffold tags
- Anyone with a smartphone can scan to view details
- Configurable fields shown in QR popup
- Scaffold location viewable in Google Earth

---

## Quantify Web (Browser / Mobile Companion)

**URL:** `[site name]/quantify/`

**Tabs (Admin users see all):**
- Products
- Scaffold Tags
- Shipment Pivot
- Drawings
- Map

**Features:**
- Equipment Request (Request Portal) — field requests materials
- Generate inventory and scaffold reports
- View interactive site maps + Google Earth
- Scan QR scaffold tags
- Enter inspection results remotely
- View Avontus Designer drawings
- Create/save Scaffold Register + Shipment pivot reports (2024)

**User Roles:**
- **Admin** — sees all data, all locations, all tabs
- **Customer User** — sees only their own data

---

## Products & Inventory

**Product Catalog:**
- Serial numbers (serialized asset tracking — must enable in Global Options)
- Barcodes (print barcode reports)
- Categories
- Re-rent flag + Owner column (shows supplier name)

**Consumables Catalog:**
- Separate from Product Catalog
- Includes Sell Rate column
- Can be moved to Product Catalog
- Rate Profiles can include consumable sell rates

**Re-order Points:**
- Per-product threshold
- Triggers reminder when stock drops below threshold
- Re-order Quantity field

---

## Reports & Pivot System

**Named Reports:**
- Product History Pivot — daily snapshot of equipment at each job site
- Forecasting Pivot — availability projections based on planned dates
- Transaction Products Pivot — with cost column
- Estimate Pivot — handles large volumes
- Scaffold Register Pivot (×5)
- Shipment Pivot
- Invoicing Reports (multiple formats)
- Pick Tickets (delivery / return)
- Products/Serial Number with Barcode

---

## Notifications & Reminders

- Per-user reminder settings
- Types: inspection, reorder, warranty, custom
- Automatic inspection reminders for scaffolds
- Re-order point triggers

---

## Out of Service / Maintenance

- **To Be Serviced:** Return damaged items to maintenance queue; create Service Tickets; charge to Job Site
- **Out of Service:** Damaged beyond repair or lost; invoice customer for OOS fees
- **Service Tickets:** Invoiced to customers as line items

---

## Global Options Dialog — Tabs

- **General** — Enable: Staging Areas, serialized tracking, inventory tracking, equipment servicing, requests, notifications, Additional Charges
- **Billing** — Single Rate vs. Rate Profile mode; tax rate options
- **Shipments and Scaffolds** — Custom shipment properties; custom scaffold properties/dropdowns
- **Reports** — Signature lines on pick tickets (2–5)

---

## Key Workflows

### Bid → Invoice
```
Create Estimate → Print for customer → Convert to DEL Shipment
→ Job Site on rent → Generate Invoice → Export to accounting
```

### Return
```
Create RET from Job Site → Equipment to Branch Office
→ Inspect on receipt → Damaged → Out of Service / To Be Serviced
→ Invoice credits for returns
```

### Scaffold Register (Industrial)
```
Create Scaffold → Record erection → Set inspection schedule
→ Field scans QR → Enters pass/fail → Record dismantle
→ Scaffold pivot report
```

### Equipment Request (Field)
```
Customer User logs into Quantify Web → Request Portal
→ Requests equipment → Office reviews → Creates Reservation or DEL
```

### Re-Rent
```
Purchase re-rented material via Transaction → Track in Owner column
→ Invoice customer at full rate → Track vendor cost separately
→ Exclude from owned asset reports
```

---

## Terminology

| Term | Meaning |
|------|---------|
| DEL | Delivery — starts rent |
| RET | Return — stops rent |
| TRF | Transfer between locations |
| RSV | Reservation (future-dated) |
| BOM | Bill of Materials |
| FATA | First Advance Then Arrears (billing) |
| On Rent | Equipment at job site, billing active |
| Off Rent | Billing suspended period |
| Continuation | Period between billing cycles |
| Branch Office | Main yard/stocking location |
| Laydown Yard | Sub-branch stocking location |
| Staging Area | Temporary holding location |
| Scaffold Tag | Physical tag with QR code |
| Rate Profile | Pricing schedule for a job site |
| Pick Ticket | Physical document for delivery crews |
| To Be Serviced | Maintenance queue |
| Out of Service | Damaged/lost queue |
| Re-rent | Equipment rented from 3rd party |
| Pivot Report | Drag-and-drop custom report |
| Product History | Daily equipment snapshot per job site |
| Forecasting Pivot | Availability projection |
| Group | Sub-unit within a Job Site |
| Request Portal | Web/mobile equipment request interface |
| Pre-Return | Count of expected returns before arrival |

---

## Integrations

| System | Type |
|--------|------|
| QuickBooks | Accounting (invoice sync) |
| Xero | Accounting (OAuth 2.0) |
| Sage 50 | Accounting |
| Oracle | ERP (export file) |
| Avontus Designer | BOM export → Quantify |
| ScaffoldIQ | Field ops (bidirectional sync) |
| Avontus Viewer | 3D/VR/AR visualization |
| Microsoft Azure | Cloud hosting |
| Microsoft Entra ID | Authentication |
| Google Earth | Scaffold location mapping |
| Trimble | Formwork planning |

---

## Products Tab — Full Detail

### Context-Sensitive Columns

**Corporate Structure View:**
Part Number, Serial Number, Description, Owner, Available, On Rent, New, Reserved, In Transit, Discrepancy, On Order, On Order New, Backordered, Backordered New, Total

**Branch Office View:**
Part Number, Serial Number, Description, Owner, Available, New, Reserved, In Transit, Discrepancy, On Order, On Order New, Backordered, Backordered New, Total

**Job Site View:**
Part Number, Serial Number, Description, On Rent, In Transit, Discrepancy, Total

**Owner column:** Shows supplier name if item is re-rented. Blank = company owns it.

### Products Tab — Change Dropdown
- Move items to **To Be Serviced** queue
- Move items to **Out of Service** queue

### Products Tab — Reports Dropdown
- **Product Utilization Report** (3 types: by Quantities / Average Cost / Catalog Cost)
- All Product Activity by Category
- Selected Product Activity Pivot Report
- Selected Product Quantities by Location Report (shows every location the product exists, quantities per location, status breakdown)
- Active Job Sites and Groups
- All Active Locations with Shipping / Billing / Business Address
- **Selected Location Count Sheet Report** — printed inventory verification form with space for live count, counter name, date, signature
- Job Sites with Negative Balances Report
- Product Pricing Pivot Report (quantities + cost data including Cost, Last Cost, Average Cost — good Asset Report)
- Product Quantity Pivot Report (all statuses: available, on rent, backordered, in transit, to be serviced, damaged, scrapped)
- Job Sites and Groups Pivot (admin + billing info)
- Re-Rent Swap History Pivot

### Filtering the Products Tab
- Filter by Part Number or Description
- Filter modes: "contained anywhere" or "starts with"

### Product Forecasting
- Available for Branch Offices and Sub-Branches
- Display: Pivot or Chart format
- Shows warnings when balances or settings affect results

---

## Shipments — Full Detail

### New Direct Ship Dialog — Confirmed Tabs
1. **Shipment Properties Tab** — custom lists and properties per shipment
2. Products tab — line items
3. Consumables tab
4. Additional Charges tab
5. Recurring Charges tab
6. Attachments tab

### Shipment Permissions (Global Options > Shipments Tab)
- Allow editing of shipment number
- Allow rent stop date to be modified
- Allow editing and prorating of rent rate
- Allow editing of recurring charges
- Allow editing of minimum days (FATA billing — Min. Override column in Products tab)
- Allow editing of consumable sell price
- Allow editing of additional charge description
- Allow editing of additional charge weight

### Shipment List — Default Filter
- Configurable date range filter (set in Global Options > Shipments tab)

### Color Coding (configurable)
- Delivery headers: custom color
- Return headers: custom color (Pre-returns same color as returns)
- Transfer headers: custom color

### Rent Start/Stop Date Defaults
- Default rent start date for new deliveries: today + X days (configurable)
- Default rent stop date for new returns: today + X days (configurable)

### Counting / Receiving Workflow
- Job Sites can be configured to count shipments upon receipt
- Items enter **In Transit** status after delivery until counted
- **Discrepancy** column shows unresolved count differences
- Cannot adjust inventory at Staging Areas

### Pick Tickets — Options
- Default: 1 signature line
- Option: Show "Prepared by / Delivered by / Received by" (3 lines)
- Option: Show additional charges and prices
- Option: Show delivery driver signature line
- Custom notes configurable (appear on all pick tickets)
- Custom notes also configurable for all shipments

---

## Job Site Dialog — Full Detail

### Tabs
- General
- Scaffolds (scaffold configuration)
- Billing (Rate Profile, billing method, customer, tax rate, Invoice Up To date)
- Properties (custom properties)
- Requests (if Requests feature enabled)
- Invoices

### Billing Tab — Required Fields
- Rate Profile (assign from list)
- Billing Method: Arrears / Advance / FATA / Advance with Credits
- Customer (dropdown)
- Tax Rate
- Invoice Up To date

### Billing Methods (Detailed)
- **Arrears** — charge after rental period (28-day cycle typical)
- **Advance** — charge before rental period
- **FATA** — first invoice in advance (at beginning or end of minimum period), then arrears; Min. Override column available per shipment
- **Advance with Credits** — pre-bill with return credits
- **Advance with Credits and Cycle** — common cycle start date

---

## Invoices Tab — Full Detail

### What It Shows
- All invoices for selected Job Site
- Click Branch Office → see all invoices for all job sites under it

### Actions
**Reports dropdown:**
- Preview invoice in 7 formats
- Preview invoice reporting job costs
- Print selected invoices
- Save selected invoices
- Billable Job Site Summary Pivot
- Invoice Pivot
- Invoice Additional Charges Pivot
- Rent Extension Pivot

**Accounting dropdown** (appears when accounting integration configured):
- Export / sync invoices
- Set export status: Not Exported / Do Not Export
- Functions vary by accounting app

**Change dropdown:**
- Reset invoice rent rates and job costs from Rate Profile

**Filter dropdown (varies by accounting app):**
- Show All
- Show Only Non-Zero Invoices/Credits
- Not Synchronized
- Do not Synchronize
- Draft
- Awaiting Approval
- Awaiting Payment
- Paid
- Overdue
- Deleted
- Voided

---

## Scaffold Register Tab — Full Detail

### What It Shows
- Click Job Site → scaffolds for that job site
- Click Branch Office → all scaffolds under all job sites in that branch
- Cannot view scaffolds from main Organization tree level

### Scaffold Register — Bottom Panel Sub-Tabs
- **Bill of Materials** — list of materials in transaction
- **Shipping** — all shipments assigned to scaffold (DEL/RET/TRF); can create delivery, return, or transfer directly from here; can edit or void shipment
- **Activities** — add/edit/delete activities (Industrial only)
- **Inspections** — add/edit/delete inspections; full inspection history
- **Access Points** — add/edit/delete access points
- **Attachments** — attach files
- **Details** — physical details, created date, creator, notes
- **History** — all changes; can generate History pivot report for selected scaffold or all scaffolds at location

### Actions
- **Dashboard** — Scaffold Register Dashboard
- **Reports** dropdown
- **Change** dropdown — reset rent rates/job costs from Rate Profile
- **Inspections** dropdown — add and enable inspections
- **Filter** dropdown: Estimate / On Rent / Off Rent / Brock Use / Completed
- **Scaffold Lists** dropdown: Priority, Project, Step, Shifts, Activity Types, Unit-Hour Profiles

---

## Security & User Roles

### Roles
- 8 standard roles including Administrator (all permissions, not customizable)
- Up to 3 additional custom roles
- Each role = a group of permissions

### Location-Based Security
- Assign individual users to specific locations
- Enabled in Global Options > General tab

### Login Options
- Standard username/password
- Microsoft Entra ID (Azure AD) — sign in with work email; configurable domains

---

## Global Options Dialog — Full Tab Detail

### General Tab
- Track serialized assets (must enable to add serialized parts to Product Catalog)
- Allow servicing of equipment (must enable for To Be Serviced queue)
- Track inventory / New equipment (adds New column to Products tab)
- Use staging areas
- Google Earth: auto-geocode addresses, Google Maps API key
- Location-based security
- Salesperson unique employee numbers
- Microsoft Entra authentication domains

### Notifications Tab
- Store notifications for review
- Enable email notifications (HTML format, UTC timestamps)
- Active Notifications report (PDF)
- Delete All Notifications
- "Do not send notice to user who caused notification" option
- From email address
- SMTP configuration (server, SSL, port, auth, username, password)
- Re-order point: resend every X days, Reset Send Date, Resend Email
- Re-rent balance: resend every X days
- Inspection + warranty expiration: resend every X days
- Test email settings

### Reports Tab
- Logo (PNG 225×95px): Add / View / Save / Delete
- Paper size
- Footer text
- Show date/time created on reports
- Display standard signature details on estimates, shipments, transactions
- Invoice/Estimate: return address label, additional charges label, invoice title, notes, company name, rental items label, unsaved invoice watermark, estimate terms
- Invoice: show invoice number in footer, signature lines, billing period, job site shipping address, Area columns on Summary Landscape
- Shipments: delivery driver signature line, additional charges, additional charge prices, 3-signature pick tickets (Prepared by / Delivered by / Received by), pick ticket notes, shipment notes

### Requests Tab
- Enable requests for products (adds Requests tab to interface + job site dialog)
- Available for Enterprise and Industrial editions
- Available on iOS and Android
- Custom lists (up to 3, configurable labels, can be Required)
- Custom text properties (configurable, can be Required)
- Custom Yes/No properties

### Shipments and Scaffolds Tab
**Shipments sub-tab:**
- Default shipment view filter (date range)
- Color for delivery / return / transfer headers
- Shipment Permissions (all listed above)
- Default rent start/stop dates
- Custom lists for shipments (up to 2 lists, configurable labels, Required option)
- Custom text properties for shipments
- Custom Yes/No properties for shipments

**Scaffolds sub-tab:**
- Allow scaffold tracking (global enable)
- Allow scaffold to be set completed if there are balances
- Allow scaffold transfers between job sites
- Checkbox to create inspection from new activity (checked by default option)
- Label for tab in main window (rename "Scaffold Register" tab)
- Built-in Scaffold List Names (3 customizable list names)
- Scaffold Statuses (edit name, description, active/inactive per status)

---

## Print Preview / Reports

### Export Formats
- **PDF** — not editable, readable on most devices
- **RTF** — editable in Microsoft Word
- **XLSX** — editable in Excel 2007+; calculations/logic not exported; some formatting may change

### Email
- Email reports directly from Print Preview
- Formats: PDF, RTF, XLSX
- Requires mail client installed on machine

---

## Billing Timelines (Visual Reference)

- **Arrears** — deliveries + returns drive invoice dates at end of each 28-day cycle
- **FATA (invoicing at beginning of minimums)** — first invoice at start of minimum period, then arrears
- **FATA (invoicing at end of first minimum)** — first invoice at end of minimum period, then arrears
- **Advance with Credits** — pre-bill on 28-day cycle, credits applied for returns
- **Advance with Credits and Cycle** — same but with a fixed common cycle start date

---

## Requests Feature (Mobile-Relevant)

### How It Works
- Field workers / customer users access **Request Portal** on iOS or Android
- Request products for a specific Job Site
- Requests filtered to show only materials for parent location (configurable)
- Custom lists + properties per request (configured in Global Options > Requests tab)
- Office reviews requests → converts to Reservation or Delivery

### Enabling
- Global Options > Requests tab > Enable requests for products
- Adds Requests tab to main Quantify interface
- Adds Requests tab to Job Site dialog
- Available: Enterprise and Industrial editions only

---

## Scaffold Status Machine (ScaffoldIQ)

> Source: Confluence spec "Status Machine: Scaffold and Activity" by Brian Webb

The Status Machine manages the entire lifecycle of a scaffold — switching statuses of scaffolds, activities, and requests as they change. These statuses are of primary importance to everyone on a construction site and closely correspond with the physical scaffold tag.

### Scaffold Lifecycle

```
Awaiting Build (blue) → Build In Progress (red) → Standing (green)
  ↕ Modify In Progress (red) ← Scheduled Modification
  ↕ Repair In Progress (red) ← failed inspection/handover only
  ↕ Awaiting Inspection (red) → Inspection pass → Standing
  ↕ Awaiting Handover (red) → Handover pass → Standing
  ↕ Do Not Use (red) — generic safety hold
  → Dismantle In Progress (red) ← Scheduled Dismantle → Dismantled
```

### Scaffold Statuses & Tag Colors

| Status | Tag Color | Meaning |
|--------|-----------|---------|
| Awaiting Build | Blue | No physical scaffold exists yet — planning phase |
| Build In Progress | Red | Materials on site, being built — hazardous, cannot be used |
| Standing | Green | Completed, safe to use by all trades |
| Standing (precautions) | Yellow/Green | Safe but with noted hazards (e.g., 100% tie-off required) |
| Scheduled Modification | Blue | Future modification planned |
| Modify In Progress | Red | Being modified — cannot be used |
| Repair In Progress | Red | Being repaired after failed inspection/handover — cannot be used |
| Awaiting Repair | Red | Failed inspection/handover, needs repair |
| Scheduled Dismantle | Blue | Future dismantle planned |
| Dismantle In Progress | Red | Being dismantled — cannot be used |
| Dismantled | None | No materials, no tag — scaffold record retained for templates |
| Awaiting Inspection | Red | Built/modified/repaired, waiting for safety sign-off |
| Awaiting Handover | Red | Work complete, waiting for requestor to verify scope |
| Do Not Use | Red | Generic safety hold for any reason |

### Physical Scaffold Tags

Every scaffold must have a non-removable tag at every access point (ladder/stairs) by law.

- **Red tag**: Incomplete or defective — cannot be used by end-users (builders can use it for work)
- **Green tag**: Completed and safe to use
- **Yellow/Green tag**: Usable but with specific precautions noted on tag

### Activity Types

| Type | Can Be Requested? | How Many Per Scaffold? | Notes |
|------|-------------------|----------------------|-------|
| Build | Yes (new scaffold) | Exactly 1 | Life of scaffold begins here |
| Modify | Yes | Multiple allowed | Planned changes to standing scaffold |
| Repair | No — internal only | Multiple allowed | Created only from failed inspection or failed handover |
| Dismantle | Yes | Exactly 1 | Only when all activities completed |

### Key Processes

**Handover**: Pass/fail event after build/modify/repair/dismantle completion. Requestor verifies work was performed to scope with the builder. A failed handover may create a Repair activity.

**Inspection**: Recurring pass/fail safety check by a dedicated inspector. Frequency varies by site (number of days, or every shift change). A failed inspection creates a Repair activity and red-tags the scaffold. Inspection forms are stored with unique numbers as history.

**Do Not Use**: A toggle status for any safety concern. Can be applied to any Standing scaffold — question about scope, safety, lack of time to inspect, etc.

### Personas

| Persona | Role | Primary Concern |
|---------|------|----------------|
| Scaffold End-User | Painters, pipers, insulators who use scaffolds daily | Is it safe? Any precautions? |
| Builder | Competent person who builds/modifies/dismantles | Materials, resources, work to be done |
| Requestor | Anyone who requests build/modify/dismantle | Coordination with trades, cost management |
| Inspector | Dedicated safety inspector | Recurring structural safety checks, pass/fail |

### Relationships

```
Request ←(1:1)→ Activity ←(many:1)→ Scaffold
```

- 1 request always creates exactly 1 activity
- 1 scaffold can have many activities
- 1 activity belongs to exactly 1 scaffold
- Repair activities have NO associated request

### Business Rules

- A scaffold can only have 1 Build activity and 1 Dismantle activity
- A scaffold can have multiple Modify activities
- Only 1 activity can be In Progress at any time per scaffold
- Modification only allowed when build is completed or scaffold is in Do Not Use
- Dismantle only allowed when all activities are completed
- Do Not Use, Repair, Handover, Inspection only possible when scaffold is Standing
- Failed inspection → automatically creates Repair activity
- Failed handover → may create Repair activity
- Scaffold can only be deleted when Dismantled (deletes all related records)

### Status Colors in UI

- **Blue**: Not yet built / scheduled for future work (no physical presence)
- **Red**: Cannot be used — any in-progress work or safety hold
- **Green**: Standing and safe to use

---

## UX Research — Users & Environment

> Source: quantify-ux-research.md

### Who They Are
- Yard workers, yard managers, inventory teams
- Office/billing/dispatch staff (desktop users, directly dependent on mobile)
- Field/job site workers — foremen, GCs (secondary mobile users)

### Devices
- iPads and rugged Android tablets in heavy-duty drop-proof cases with hand straps
- Both iOS and Android required

### Physical Realities
- **Direct sunlight** causes severe screen glare — workers squint, seek shade, or abandon the app for paper
- **Thick gloves** (leather, rubber-coated, cut-resistant) are mandatory — small touch targets are unusable
- **Greasy/dirty hands** — touching the screen requires removing a glove, which they hate
- **Devices are NOT carried constantly** — loading requires two hands; tablets get balanced on truck tailgates, stacked on materials, or shoved under an armpit
- Devices are never permanently mounted to vehicles — workers walk the entire yard

---

## UX Research — How They Work Today

### Yard Worker's Shift
- Check device for incoming equipment requests, outbound orders, unscheduled returns
- Truck arrives → worker gets pick-list (often still paper on a clipboard)
- Physically hunt down materials — items are frequently buried under other stacks
- Pull items, load using forklift or by hand, count, get driver signature
- Hand paperwork back to office

### The Paper Problem
- Many yards still use paper pick-tickets because they're easy to fill out on a tailgate
- When counts don't match, workers cross out the printed number with a Sharpie and write the actual number
- The office updates the system later — if they remember

### Communication Between Yard and Office
- Two-way radios (walkie-talkies) are the standard
- Yelling out the window
- Calling the yard worker's personal cell phone
- To check delivery status, the office literally looks out the window to see if the truck is still there

---

## UX Research — Edge Cases & Pain Points

| Pain Point | What Happens |
|-----------|-------------|
| **Phantom inventory** | System says 50 pieces in yard — worker is staring at empty dirt. Items moved to another job site, never documented. #1 reason workers walk to the office. |
| **Phantom transfers** | Scaffolding moves Job Site A → Job Site B without returning to yard. Truck arrives with 300 pieces, system expected 100. |
| **Undocumented substitutions** | Worker needs 50 items, only finds 45. Throws in 5 of a different size to keep truck moving. Forgets to write it down → corrupted inventory. **#1 mistake the office has to fix.** |
| **Damaged returns** | Returns come back bent, concrete-covered. Must be flagged so they're not accidentally allocated to the next outgoing truck. Currently no clean way to do this in the flow. |
| **Buried inventory** | Needed items at the bottom of a massive stack. Workers substitute a different size/type on the fly. |
| **Unscheduled returns** | Trucks arrive with equipment not tied to any reservation. No paperwork, no advance notice — just a pile of metal. |
| **Last-minute field requests** | "We're done, come get it tomorrow" — zero planning. Or opposite: pickup scheduled for Friday, work delayed, scaffolding sits 3 extra weeks. |

---

## UX Research — Connectivity & Offline

### The Reality
- Scaffolding yards are giant Faraday cages — massive stacks of steel/aluminum kill WiFi and cellular signals
- Dead zones everywhere, especially near metal laydown areas and loading bays
- Job sites are even worse — basements, parking garages, steel-framed high-rises = zero signal

### Requirements
- **Full offline mode is non-negotiable** — not offline-capable, offline-FIRST
- Queue all data locally when connection drops
- Worker must be able to continue counting seamlessly without interruption
- Auto-sync in background when connection returns
- Prioritize critical inventory updates over heavy media (photos)
- If offline mode fails, workers restart 200-piece counts from scratch — major frustration source
- **Clear visual confirmation that sync was successful** — worker needs to know the office received their data before moving to the next truck

---

## UX Research — Mobile → Desktop Handoff

- Office **cannot** finalize a shipment, process an invoice, or release billing until the yard worker confirms the physical count
- Once worker taps "confirm" and device syncs → office sees updated inventory in real-time
- Automatically triggers: delivery manifests, inventory adjustments, rental billing activation
- No manual office intervention required after sync

### The Waiting Game
- Office waits on yard for final load confirmations (so they can run billing or go home)
- Yard waits on office when a driver shows up unannounced and the pick-ticket isn't approved yet
- Both sides are frequently blocked by the other

---

## UX Research — Scanning & Input

- **Barcode scanning is primary input — but deeply unreliable**: metal scaffolding gets covered in mud, concrete, rust; barcodes get destroyed
- Workers on Reddit openly mock barcodes/QR codes in scaffolding yards
- **Manual quantity entry is an absolute fallback necessity**
- Workers identify products almost entirely by **sight, size, and muscle memory** — they don't read labels
- **Group scanning (Feb 2026):** scan one barcode for a predefined bundle (e.g., 50 horizontal braces) → records entire group quantity

---

## UX Research — Key Design Drivers

| Rule | Why |
|------|-----|
| **Touch targets 56px+ minimum** | Gloved hands, greasy fingers |
| **High contrast, sunlight-readable** | Direct sunlight is the default environment |
| **The app competes with paper** | If slower than clipboard + Sharpie, workers abandon it |
| **Never block the worker** | Any hard stop (approval gates, connection requirements) kills adoption |
| **Offline-first** | Not offline-capable — offline-FIRST |
| **Sync status must be unmistakable** | Worker needs to know office received data before walking to next truck |
| **Design for substitutions** | Workers WILL change counts without approval — allow it, flag it, don't prevent it |
| **Returns need the most UX attention** | Messiest workflow — unsorted piles, damage flags, over-returns |
| **Product images > product numbers** | Workers identify by sight, not by code |

---

## Mobile POC — 5 Core Screens

> Source: "Quantify Mobile App - UNO PoC" client document

### Tech Stack
- Design System: Figma (Uno Platform Material Toolkit)
- UI Framework: WinUI 3 (API surface)
- Cross-Platform: Uno Platform
- MAUI: excluded unless unavoidable

### Screen 1 — Login
- Quantify logo/branding
- Username + Password fields (TextBox Outlined, PasswordBox Outlined)
- Sign In (Filled button), Connection Settings (Text button)
- Connection status bar at bottom, version + copyright footer
- **Validation state:** inline field errors + error banner "Sign in failed"

### Screen 2 — Connection Settings
- NavigationBar with back/close
- Remote server TextBox, Protocol row (https://), Use SSL toggle (default On)
- Test Connection button
- **Error state:** red banner "Connection failed"
- **Success state:** green banner "Connected successfully"

### Screen 3 — Home
- NavigationBar "Home"
- Welcome card: avatar (initials), name, role
- Quick Actions: Who Am I, Sample Form, Scan Barcode (MenuItem rows with chevron)
- Last Scan card (placeholder or result)
- Version footer

### Screen 4 — Who Am I
- Avatar, full name, email
- Detail rows: Role, Permissions, Username (56px height, label/value)
- Branch offices as Chips (Portland, Chicago, Salt Lake City)
- Sign Out button

### Screen 5 — Sample Form ("Parent")
- Scrollable form with card sections: text fields, files, boolean toggles, dropdowns, date fields, numeric fields + calculated result
- Bottom action bar: Cancel (Outlined) + Save (Filled)
- **Validation state:** error summary banner + inline errors below each invalid field

---

## Design Feedback — What Works / What Doesn't

> Accumulated from design review sessions with client

### What They Liked
- Metrics showing real scaffold data (467 green / 703 red / 3,024 requests / 406 active)
- Topic cards with colored icons
- Navy blue (#10296E) as the brand color — NOT the bright #0A3EFF
- Split layout: left 30% overview + right 70% content
- White/light backgrounds with blue accents only

### What They Hated
- Multiple blues clashing — pick ONE
- Dark mode — keep it white/light
- Generic dashboard cards that look like every other app
- Broken/hand-drawn SVG icons — use icon libraries or copy exact source
- Too much text, too colorful, too busy
- Black anywhere in the UI
- Box-in-box-in-box nesting
- Rounded frame/mockup wrappers around the UI
- Hamburger menus that serve no purpose

### Critical Design Rules
- **ONE blue only: #10296E** (navy dark blue, not the bright primary #0A3EFF)
- Never hand-draw SVG icons — use Material Symbols, Lucide, or copy exact source
- White/light backgrounds — never dark mode
- Body text 16px minimum, labels 13px minimum
- All interactive rows 56px+ height
- Buttons 52px+ tall, full-width for primary actions
- Always show connection/online status
- #757575 minimum for secondary text — #9E9E9E only for tertiary (never #ABABAB, fails WCAG AA)
- Plan the design in detail BEFORE coding — one good build beats 10 quick iterations

---

## Industry Context — The 6 Roles in a Scaffolding Rental Business

> Universal across scaffolding rental companies (AT-PAC, BrandSafway, Altrad, Sunbelt, Apollo, Layher, etc.). Use this to know who you are designing for when someone names a job title.

### 1. Rental Coordinator (a.k.a. Rental Clerk, Rental Admin)

- **Where:** Office. Phone-and-keyboard job.
- **Day:** Takes rental inquiries, creates reservations, prepares rental agreements, schedules pickups/returns, enters and invoices rental orders, maintains job files, communicates inventory needs to purchasing.
- **Software:** The rental management system (Quantify, Rentalman, Alert, InTempo, RUX, Baseplan, MCS, Rental360). Rentalman is the incumbent competitor Quantify typically replaces.
- **Reports to:** Operations Manager or Branch Manager.
- **Handoffs owned:** Customer phone/email → reservation. Reservation → pick ticket to yard. Returned paperwork → invoice.
- **Pain:** Customer calls asking "is my stuff there yet?" with no visibility because yard is on paper. Double-entry between rental system and ERP. Quote/price errors.
- **Vocabulary:** Reservation, quote, rental agreement, pick ticket, invoice, PO, BOL, on-rent, off-rent.

### 2. Yard Supervisor (a.k.a. Yard Manager, Yard Foreman, Warehouse Supervisor)

- **Where:** Half in a yard office, half walking the yard.
- **Day:** Gets pick tickets from office, directs yard workers on what to load, verifies outbound/inbound counts, inspects for damage, tags components for maintenance, manages 3–15 yard workers, signs BOLs, reports damage/missing parts upstream.
- **Software:** Historically paper + clipboard + whiteboard. Increasingly a mobile app on rugged tablet. Dispatcher module of the rental system.
- **Reports to:** Branch Manager.
- **Reports to them:** Yard workers, forklift operators, sometimes drivers.
- **Handoffs owned:** Office pick ticket → physical load → driver (BOL signed). Inbound truck → count-in → report to office. Damage → repair queue or write-off.
- **Pain:** Pick tickets wrong or missing. Damage disputes ("was this broken when it left or came back?"). Counts off by a few items taking 30 min to reconcile. Office promises things that aren't in stock.
- **Vocabulary:** Kit, pick, load, check-in, check-out, BOL, damaged, missing, short, over-count, returnable, scrap.

### 3. Turnaround / Access Coordinator

- **Where:** At the customer (typically oil & gas refinery). Highest-paid role on this list. Often seconded from an EPC or industrial services firm.
- **Day:** During an oil refinery shutdown (2–6 weeks, $1M+/day lost revenue for the refinery), owns all scaffold access decisions. Decides where scaffolding goes, how long it stays, whether to use alternatives (rope access, hydraulic platforms, drones, ladders). Prevents duplicate scaffolds from competing contractors. Monitors rental timeouts. Pushes for early removal.
- **Software:** Spreadsheets. Proprietary turnaround management tools. Sometimes a scaffolding tracking module (Avontus Scaffold Tracker, etc.).
- **Reports to:** Turnaround Manager at the refinery.
- **Coordinates with:** Planners, supervisors, multiple scaffolding contractors, safety, welders/painters/insulators ("soft crafts" that use the scaffolding).
- **Pain:** Field crews refuse to let scaffolds come down ("we might need it again"). Contractors happily leave scaffolds standing because they get paid rental. No single source of truth for "what's up right now." Multiple contractors building overlapping scaffolds for the same pipe rack. Budget blows out quietly.
- **Vocabulary:** Turnaround (TAR), shutdown, access plan, pre-fab, dismantle schedule, idle scaffold, footprint, cost-per-day, craft, soft-craft, playbook.
- **Why this role matters for Quantify:** Biggest, most expensive, most under-served customer segment. Everything breaks during a TAR.

### 4. Dispatcher (often combined with Yard Supervisor at smaller branches)

- **Where:** Office, at a dashboard.
- **Day:** Routes trucks. Assigns drivers. Sequences pickups and deliveries. Reacts to changes (traffic, customer delays, mechanical breakdowns). Communicates with drivers by phone/radio/app.
- **Software:** Graphical dispatch board (Alert, Rental360, Quantify dispatcher). GPS/telematics. Phone.
- **Reports to:** Operations Manager.
- **Handoffs owned:** Reservation → truck slot → driver → customer site. Driver issues → escalation to coordinator/customer.
- **Pain:** Late cancellations. Driver calls saying customer isn't ready. "Rush this to site X by 2pm" on top of a full day. Re-routes.
- **Vocabulary:** Route, run, leg, drop, ETA, BOL, POD (proof of delivery), manifest, dead-head.

### 5. Branch Manager

- **Where:** Branch office. Walks the yard daily. Sometimes on customer visits.
- **Day:** Runs the P&L of one branch. Leads 10–20 people (coordinators + yard crew + drivers). Reviews utilization, revenue, receivables, damages. Handles customer escalations the account manager can't resolve. Hires and fires. Chases late-paying customers.
- **Software:** BI dashboards, the rental system, email, ERP/finance.
- **Reports to:** Regional/Operations Director.
- **KPIs watched daily:**
  - Utilization % (what portion of inventory is currently on-rent)
  - Revenue vs. target
  - DSO (days sales outstanding)
  - On-rent asset count
  - Damage rate
  - Fleet availability
- **Pain:** "I don't know what's actually on rent right now." Receivables aging. Customer disputes over damage. Competing branches borrowing inventory without telling anyone.
- **Vocabulary:** Utilization, DSO, on-rent value, fleet, yield, write-off, depreciation, capex, rebill.

### 6. Account Manager (a.k.a. Sales Rep, Business Development)

- **Where:** Road. Customer site. Coffee shops. Occasionally branch.
- **Day:** Owns the customer relationship. Site surveys. Quotes. Negotiates contracts and long-term rates. Chases late starts, expedites emergencies. Fields escalations. Brings leads in. Cross-sells (scaffold + engineering + labor).
- **Software:** CRM (Salesforce, HubSpot), quoting tool (often inside the rental system), mobile app for on-site estimates, PowerPoint, Excel.
- **Reports to:** Sales Director or Branch Manager.
- **Handoffs owned:** Customer need → quote (loops in estimator for complex jobs). Signed quote → coordinator for reservation. Ongoing relationship → escalation path when things break.
- **Pain:** Quote took 3 days while competitor quoted same day. Rental rate was wrong. Branch forgot to ship. Customer angry about damage invoice they signed off on themselves.
- **Vocabulary:** Site survey, quote, bid, RFQ, rate sheet, master service agreement (MSA), long-term hire, expedite, cross-sell, up-sell, account plan.

---

## Industry Context — Communication Web & Pinch Points

### The Universal Flow

```
    CUSTOMER PROJECT MANAGER  ──▶  ACCOUNT MANAGER
                                        │
                                        ▼
                              RENTAL COORDINATOR
                                   │        │
                          pick ticket      invoice ◀── after return
                                   ▼        │
                            DISPATCHER ─────┤
                                   │        │
                                   ▼        │
                            YARD SUPERVISOR ◀── count-in
                                   │        ▲
                               loads truck  │
                                   ▼        │
                               DRIVER ──▶ SITE ──▶ FIELD FOREMAN
                                                        │
                                             mod requests / returns
                                                        │
                                 (during TAR: ACCESS COORDINATOR owns this leg)
```

### The 5 Pinch Points — Every Quantify Feature Exists To Fix One

| # | Pinch point | Common failure |
|---|-------------|----------------|
| 1 | **Account Manager → Coordinator:** quote-to-reservation | Wrong rate, wrong item, wrong date |
| 2 | **Coordinator → Yard:** pick ticket hand-off | Paper-based, no live update |
| 3 | **Yard → Driver → Site:** BOL + proof of delivery | Unsigned, damaged in transit, customer rep disputes |
| 4 | **Site → Office:** mod requests + ready-for-pickup | Phone tag, no paper trail |
| 5 | **Yard count-in → Coordinator → Invoice:** damage & missing reconciliation | Delayed billing, disputes |

### The Universal Pain Sentence

> Every paper handoff is a 4-to-24 hour information delay plus an error-entry moment.

That is Quantify's whole value proposition in one line. Memorize it.

---

## Industry Context — Cross-Company Terminology (The 20 Unlock Words)

If you can use these 20 in a sentence correctly, you will stop sounding new in any customer call.

**Commercial:** Reservation · Quote · Rental Agreement · Rate sheet · MSA (Master Service Agreement) · On-rent / Off-rent · Re-rent · Rent day / billable day · 28-day billing · DSO

**Operations:** Pick ticket · BOL (Bill of Lading) · POD (Proof of Delivery) · Kit / BOM (Bill of Materials) · Count-in / Check-in · Damage note · Short / Over · Scrap / Write-off

**Physical:** Yard / Depot · Branch · Standard · Ledger · Transom · Cuplok / System scaffold / Tube-and-clamp

**Field:** Erector / Scaffolder · Erection · Dismantle · Modification (mod) request · Handover · Pre-build / Prefab · Tag (green / yellow / red)

**Customer types:** Turnaround (TAR) · Shutdown · Refinery · Craft / Soft-craft · Footprint · Access plan

---

## Industry Context — Where to Learn More (Sources)

**Job-description aggregators (anonymous, quiet research):**
- LinkedIn — search "scaffold rental coordinator," "yard supervisor scaffolding," "turnaround coordinator," "scaffold dispatcher," "branch manager scaffold," "scaffold account manager"
- Indeed / ZipRecruiter / Glassdoor — same searches; the "responsibilities" section of any listing is free organizational anthropology

**Industry-specific:**
- [NASC Scaffolding Careers — Yard Manager role](https://scaffoldingcareers.com/job-roles/yard-manager-yard-supervisor-yard-foreman/)
- [BuildStream — Scaffolding Supervisor](https://www.buildstream.co/job-descriptions/scaffolding-supervisor)
- [Becht — Keeping Your Scaffolding Under Control During a Turnaround](https://becht.com/becht-blog/entry/keeping-your-scaffolding-under-control-during-a-turnaround/) — the best single article on the Access Coordinator role
- SAIA (Scaffold & Access Industry Association) — trade body, whitepapers, webinars
- OSHA 29 CFR 1926 Subpart L — the scaffold safety regulations; know it exists, skim the table of contents

**Competitor / peer operators (read their "About" and "Services" pages for plain-English workflow descriptions):**
- BrandSafway, Altrad, Sunbelt Rentals (Scaffold Services division), Apollo Scaffold Services, Layher, PERI, AT-PAC

**Competitor software (know the incumbents Quantify beats):**
- Rentalman (the big one — older, clunkier, deeply entrenched)
- [Alert Rental — Scaffolding solution](https://alertrental.com/industry-solutions/scaffolding/)
- [RUX Software](https://ruxsoftware.com/industry-technology/scaffolding-rental-management)
- [InTempo Software](https://www.intemposoftware.com/industries/scaffolding-rental-software)
- [MCS Rental Software](https://www.mcsrentalsoftware.com/us/industries/construction-rental-software/scaffolding/)
- [Baseplan](https://baseplan.com/us/scaffolding-rental-management/)
- [Rental360 by Nexvue](https://rental360software.com/industries/scaffolding/)
- [Orion Software](https://www.orion-soft.com/solutions/scaffolding-rental-software)

**Unfiltered customer voice:**
- Reddit — r/Construction, r/scaffolding, r/OilandGasWorkers
- YouTube — search "day in the life scaffolder," "scaffold yard supervisor ride-along," "refinery turnaround documentary" (not timelapses)
- Avontus's own YouTube channel — training videos show the workflows in Quantify's framing

**Internal (ask for access):**
- Support tickets — customers describe problems in their own words
- Recorded sales demos / discovery calls — one hour of these = a masterclass in how the company positions the domain
- Avontus customer case studies on avontus.com

---

## Workflow Detail — Return Process (from AT-PAC interview, 2026-04-13)

> Source: AT-PAC customer interview with Andrej (ops), Michelle (Quantify power user), Lee (Avontus PM). First 30 min.

### Current paper-based flow

1. Truck arrives at the yard with material returning from a customer
2. Yard worker takes photos around the truck with personal phone — raw, unreferenced
3. Yard worker uses a clipboard to write: part, quantity, part, quantity — comparing against what the driver claims
4. If the customer sent a delivery note, use it. Otherwise physically count
5. Material is unpacked in the yard to count properly and identify damage
6. Clipboard + photos go to the office admin
7. Admin re-keys everything into Quantify manually
8. Admin renames each photo laboriously, files them in SharePoint, links them to the return record
9. Admin figures out which Quantify job site this return belongs to — driver may say "CNRL Fort Mac" but system has 3 job sites under that parent, so they pick

### The "first site" concept (critical mental model)

A return must be identified against a reservation FIRST — before any other action. The yard worker should be able to:

- Pick the expected reservation this return is against
- See what was delivered (item × quantity)
- Count what actually came back
- Escape hatch: if the client claims site X but no deliveries exist for that site, yard raises a hand and opens the return against a different correct site

This is the mobile app's conceptual starting point for returns. It is the "first site" principle.

### Damage sub-flow

- Yard captures: item, damaged flag, quick visual note, photos
- Yard does NOT decide repair vs scrap vs charge-back — that's operations
- All damage notes + photos get attached to the return record for ops to review later

---

## Workflow Detail — Delivery Process (from AT-PAC interview, 2026-04-13)

### Current paper-based flow

1. Office creates a **Reservation** in Quantify (this is a DEL in "reserved" status — same record, different status)
2. Office prints the reservation as a **pick ticket** and gives the paper to the yard
3. Yard physically **verifies on-hand quantities** outside — the system can't be trusted, stock drifts
4. Yard reports back to office: "enough stock" or "short on X"
5. Office uses a **blue sheet** (manual spreadsheet) to break the reservation into truckloads — based on tonnage, customer priorities, and what's available
6. Yard picks the small components for Truck 1 with pick ticket + blue sheet in hand, stages them
7. Yard confirms big items are physically ready in the yard
8. Truck arrives, yard loads big items directly from the yard + small items that were staged
9. Yard reports back to office what actually loaded
10. Office keys actual loaded quantities into Quantify → reservation flips to DEL status (complete)
11. Quantify auto-creates a **backorder ticket** for whatever didn't fit on Truck 1
12. Repeat for Trucks 2, 3, 4…
13. Yard takes photos throughout — again unreferenced, re-uploaded + renamed later

### Key principles

- **Reservation and DEL are the same record** in different statuses. Mobile should surface reservations and transition their status, not "create a new delivery."
- **Reservation quantity is the expectation, NOT the default.** If 1000 were reserved and 800 loaded, the system must stay 800. Variance is normal.
- **Truckload breakdown (blue sheet) is office-side.** Yard consumes the breakdown, not produces it. Mobile should render the truckload list for the yard to act on.
- **One reservation = multiple loading sessions over time.** Yard needs to "load another truck against this reservation" — not one-shot completion.

---

## Workflow Detail — Division of Responsibility (critical for mobile design)

| Action | Yard does | Office / Ops does |
|--------|-----------|-------------------|
| Photos | Capture, linked to record at moment of capture | Nothing — no more renaming, no more SharePoint filing |
| Item counts | Estimated actual (enter the number they counted) | Final confirmation in Quantify desktop |
| Damage | Flag + note + photo | Decide repair / scrap / charge-back |
| Site reconciliation | Raise hand when truck claim doesn't match any expected return | Resolve allocation and job site assignment |
| Stock verification | Walk the yard, report on-hand vs reserved | Build the truckload plan (blue sheet) based on yard's feedback |
| Truckload loading | Load truck, report actual loaded quantities | Confirm in Quantify, generate backorder if needed |

**Design rule:** mobile "complete" actions read as **submit for ops confirmation**, NOT "done." Yard-entered counts stay visibly "pending confirmation" until desktop closes them. This preserves the existing trust model.

---

## Workflow Detail — The CNRL Job-Site Problem (site reconciliation)

A single human-readable site name (e.g. "CNRL Fort Mac") maps to multiple distinct Quantify job sites. The driver or client references the parent name; the yard worker has to identify which child job site.

**Current paper flow:** yard guesses, office corrects later. Common source of re-keying errors.

**Mobile design response:**
- When yard scans/opens a return, show **recently-delivered reservations at that parent location** as a pickable list
- Never force the yard to type a job site name
- If no match, give them the "first site" escape hatch: raise a hand, open against a different site, flag for ops

---

## Workflow Detail — Photo Handling (THE biggest pain + opportunity)

### What's broken today

- Photos taken on personal phones during offload / loading
- Photos have no reference to any record (the DEL may not even exist yet)
- Photos uploaded to SharePoint by office staff
- Office staff **manually renames every photo** to match record IDs
- Office staff re-uploads into Quantify and links to the DEL

This was called out as "a big pain point for us" by multiple interviewees. It's the clearest example of the double-capture problem.

### Mobile design response

- First action in any flow **opens or creates the record** (pre-return draft, DEL reservation selected)
- Photos captured in the record are **auto-tagged with the record ID**
- No renaming, no SharePoint, no re-linking — photos are born attached
- Photo count visible on the record throughout the flow

---

## Quantify Desktop — Shipping Tab UI Reference (from Avontus Help Docs)

> Source: Avontus Quantify help documentation, Shipping and Logistics section. This is the official reference for how the desktop Shipping tab behaves. Use when designing mobile equivalents so terminology, statuses, and flows match what existing Quantify users expect.

### The Shipping Tab at a Glance

The Shipping tab is **focus-sensitive**: what it shows depends on what's selected in the Organization Tree.
- Select a Branch Office → shows shipments to and from that branch
- Select a Job Site → shows shipments for just that job site
- To see shipments from inactive job sites when focused on a branch, "Inactive Job Sites" must be enabled in My Options

The tab has two areas: a **top grid** of all shipments, and a **bottom detail panel** for the selected shipment.

### Top Grid — Toolbar Actions

| Action | What it does |
|--------|--------------|
| **Reports dropdown** | Preview/print/save shipment, shipment with pricing, pick ticket, return pick ticket for job site, return labels for pre-return, shipment pivot, consumables pivot, additional charges pivot, shipment pivot for job site |
| **Change dropdown** | Change/update Rate Profile on selected shipments; change Order number on a scaffold (only if parent job site is not set to invoice a single order) |
| **Receive Selected Shipment** button | Receive an incoming shipment (one at a time only) |
| **Send Selected Shipment** button | Send an outgoing shipment (one at a time only) |
| **Count Materials for Selected Pre-Return** button | Count a pre-return so Quantify can process it |
| **Drivers** button | Manage the list of available drivers |
| **Filter dropdown** | Filter by status: Show All, Reserved (to be sent), To Be Received, Completed, Completed with Discrepancy, Pre-Return, Include Voided Shipments |
| **Date filter** | Show All Dates, Within Last Month, Within Last Two Months, Within Last Six Months |
| **Active Scaffolds filter** | "Only Show Shipments from Active Scaffolds" |

### Bottom Detail Panel — Tabs

When a shipment is selected in the grid, the bottom panel shows:

1. **Bill of Materials** — line items for the shipment
2. **Consumables** — one-way items on the shipment
3. **Additional Charges** — one-off fees (freight, dismantle, etc.)
4. **Recurring Charges** — monthly/cyclical charges
5. **Attachments** — files attached to the shipment (photos, PDFs, etc.)
6. **Details** — creation date, creator, notes
7. **History** — Date, User Name, Change type, Item, Old Value, New Value for every edit

The History tab is the audit log. For any shipment, you can see who changed what, when, from what value to what value. This is important for mobile: any mobile-submitted change becomes a history entry.

---

### New Direct Ship Dialog — Six Tabs

Used for creating Deliveries, Returns, Transfers, and Reservations (Pre-Returns have their own similar dialog).

#### Tab 1: Summary
Configure the high-level shipment metadata:

- **Number** — auto-generated sequential DEL number. Editable only if enabled in Global Options → Shipment and Scaffold Tags → Shipment Permissions
- **Planned Ship date** — calendar picker
- **Actual Ship date** — calendar picker
- **Salesperson** — dropdown; + icon to add new
- **Driver** — dropdown; click Add button to create new driver with name field
- **From** radio + dropdown — origin (Branch Office, Sub-Branch, Job Site/Group)
- **To** radio + dropdown — destination
- **Rent Start date** — required if destination is billable
- **Rent Stop date** — optional; if entered, takes precedence over the rent stop date in the Billing for Return section. Used for equipment still remaining on rent
- **Number of copies to print** — auto-print shipment reports on completion

**Important rule:** once a shipment is created, you cannot edit the To and From fields. You must void and recreate if the destination was wrong.

#### Tab 2: Products
The heart of the dialog. Shows products stocked at the From location by default.

| Control | What it does |
|---------|--------------|
| **Category dropdown** | Filter by Product Category (managed in Product Catalog) |
| **Filter text field** | Text search on Part Number and Description |
| **Barcode icon** | Toggle barcode mode; scans go into "To Ship" column |
| **Filter Options** button | Configure filter behavior |
| **Copy Available to To Ship** | One-click fill: copies all Available quantities into To Ship |
| **Prorate Calculator dropdown** | Prorate by Weight and Quantity, or by List and Quantity. Makes rental rates equal a fixed amount. Must be enabled in Global Options → Shipments and Scaffolds |
| **Delivery Charge / Return Credit Calculator** | Opens a dialog to configure charge + discount/markup |
| **Change Selected Items dropdown** | Change Rent Calculator, Sell Calculator, Factor; or copy a Rate Profile into selected products |
| **Import** button | Import from tab-separated file with Part Number + Quantity columns |
| **Showing dropdown** | Toggle between "All" (all products at branch) and "Parts on Shipment" (just this shipment) |

Grid columns: Part Number, Serial Number (if serialized), Description, Weight, Owner (vendor), Available (current stock), To Ship, Delivery Charge, 28 Day Rate, Return Credit (on returns), List (retail price).

Status bar at bottom shows: Total Pieces, Total Combined Weight, Rent Totals.

#### Tab 3: Consumables
Similar structure to Products but for one-way items. Extra columns: Sent (not To Ship), Sell (price), Cost Basis (None / Catalog / Average / Last — configured in Global Options → Billing), Catalog Cost, Last Cost, Avg. Cost.

Has a Calculate Sell Price button that opens a Discount/Markup/Profit Margin calculator.

#### Tab 4: Additional Charges
One-time fees. Columns: Name, Description, Weight, Units (Each, Hour, Linear Foot, etc.), Price/Unit, No. Units, Taxable (checkbox), Total.

#### Tab 5: Recurring Charges
Only active if destination job site is billable. Columns: Charge name, No. of Units, Charge/Unit. Default values come from Rate Profile. When shipment completes, recurring charges are added to the Product balances at the job site.

#### Tab 6: Shipment Properties
Custom properties configured in Global Options. Destination-specific.

---

### Editing a Shipment

- Editable until the shipment is invoiced
- Shipment properties that aren't billing-related are always editable
- **To and From fields cannot be edited** after creation — must void and recreate
- If destination branch is configured to require counting AND shipment was received with discrepancies, you cannot edit or void until discrepancies are resolved
- Click Edit or double-click the shipment to open the Editing Completed dialog

### Voiding a Shipment

- Cannot void a shipment that's been invoiced
- When voided, quantities are adjusted at both locations
- Voided shipments disappear from the grid by default; include them via the Filter dropdown

---

### Pre-Returns — Dedicated Workflow

Pre-returns let equipment be returned from a job site and counted later (e.g., overnight drops).

#### Creating a Pre-Return
1. Click the Job Site, go to Shipping tab
2. Click "Add Return for Products to be Counted at Another Time" button (or right-click → Pre-Return from this location)
3. Set the Received date
4. Pick From (Job Site) and To (Branch Office / Sub-Branch)
5. Optional: set Driver
6. Enter number of copies for Return Report and Return Labels
7. Click OK

**Important:** the pre-return is created **without a Bill of Materials**. The BOM is created when the pre-return is counted.

#### Counting a Pre-Return
1. Select the pre-return in the Shipping tab
2. Click "Count Materials for Selected Pre-Return"
3. Set Planned Ship date and Rent Stop date
4. In the Products tab, enter actual received quantities in the To Ship column
5. Complete Additional Charges tab if needed
6. Click Complete Shipment

Status updates to Completed and the products are added back to inventory.

#### Return Labels
Separate from reports. Attached to physical return bins so overnight unload teams can drop material into labeled bays. Counted the next morning.

---

### Reservations — Dedicated Workflow

Reservations hold stock for a future shipment. They show in the grid with a reservation book icon.

#### Creating a Reservation
1. Click location, Shipping tab
2. Click "Reserve Items to be Shipped at a Later Time" button
3. Assigned a sequential DEL number with status "New Reservation"
4. Set From, To, and Rent Start (if To is billable)
5. Products tab: enter reserved quantities in the Reserved column
6. Click OK

Stock moves from Available to Reserved. Others can see the reserved quantity in inventory views but can't allocate it to other shipments.

#### Converting Reservation to Delivery
Ship directly from a reservation without creating a separate shipment. The record stays the same; the status transitions.

#### Voiding a Reservation
Returns all reserved equipment to inventory. Status becomes "Voided Reservation."

#### Prorating Rent on a Reservation
Same Prorate options as on a shipment (Weight+Qty or List+Qty). Makes rental rates equal a specific fixed total. Must be enabled in Global Options.

---

### Transfers

Transfers move equipment between two non-billing locations:
- Branch Office to Branch Office
- Job Site to Job Site (requires enabling in Global Options → Shipments and Scaffolds → Scaffolds → "Allow scaffold transfers")

Created via the same dialog as shipments, just selecting Job Site or Branch Office radios on both the From and To sides.

---

### Counting on Receipt (Billable Job Sites)

A job site can be configured to **require counting of equipment on receipt**. When enabled:
- Shipment goes to "To Be Received" status on creation
- Products show as "In Transit" on the receiving site's Products tab
- Shipment is **not included in invoicing** until it reaches Completed status
- Configuration: Job Site dialog → General tab → Receiving Options → two checkboxes (one for transfers, one for deliveries)

#### Completing a To Be Received Shipment
1. Select the shipment, click "Received Selected Shipment" button
2. The Receiving dialog opens with the expected equipment listed
3. Enter actual received quantities in the Received column
4. Optional: use the Copy button to fill all actuals with expected quantities
5. Click Receive Shipment

Items are added to inventory and become invoiceable.

---

### Rate Profile Management on Shipments

- Change/update the Rate Profile on one or many shipments at once via Change dropdown → Change/Update Rate Profile on Selected Shipments
- Changes take effect on invoices created **after** the change; does NOT affect existing invoices
- If billing for a job site is reset, the current shipment rates are used
- Returns (RET) do NOT have Rate Profile assignments — attempting to change one triggers an error

---

### Billing Cycle Controls (Global Options)

**Allow Returns in Prior Billing Cycle**
- Configured in Global Options → Billing tab
- Allows return rent-stop dates in a prior billing cycle, issuing invoice credits
- Max 730 days in the past
- Results in a credit on the next invoice for the difference in rent

**Allow Scaffold Transfers**
- Configured in Global Options → Shipments and Scaffolds → Scaffolds tab
- Off by default
- Must be enabled before job-to-job transfers work

**Prorate Feature**
- Configured in Global Options → Shipments and Scaffolds tab
- When enabled, the Prorate button appears on Products tab of New Direct Ship and New Reservation dialogs

---

### Barcode Scanning on Shipments (Official UI)

1. Launch a shipment and complete Summary tab
2. Go to Products tab
3. Click the barcode icon to toggle barcode mode (click again to exit)
4. Scan barcodes — each scan populates the To Ship column
5. Complete remaining tabs, click Complete Shipment

Barcode scanner connects via USB. Works on both Products and Consumables tabs.

---

### Importing Quantities into a Scaffold Tag (ScaffoldIQ / Industrial edition)

Tab-separated file with Part Number and Quantity columns:
1. Select a Branch or Job Site, click Scaffold Register
2. Select a scaffold tag, click Shipping tab
3. Shipment dropdown → Delivery to Selected Shipment
4. Set Rent Start date
5. Click Import, browse to file
6. Choose: ignore if quantity exists, or overwrite existing
7. Click Import — parts added to shipment; errors shown if any

---

### Status Vocabulary (official)

| Status | Meaning |
|--------|---------|
| **New Reservation** | Just created, stock is reserved |
| **Reserved (to be sent)** | Active reservation waiting for shipment |
| **To Be Received** | Shipment sent but not yet counted at destination (only if destination is set to require counting) |
| **In Transit** | Sub-status showing at receiving location during To Be Received |
| **Completed** | Fully processed |
| **Completed with Discrepancy** | Processed but counts didn't match |
| **Pre-Return** | Scheduled return awaiting count |
| **Voided Reservation** | Canceled reservation, equipment back in stock |
| **Voided Shipment** | Canceled shipment, quantities adjusted at both ends |

Mobile app status vocabulary should match this exactly. Do NOT invent new statuses like "Pending Confirmation" if Quantify calls it "To Be Received."

---

## Mobile v1 Scope — Brian + Lee Walkthrough (2026-04-13)

> Source: Internal meeting with Brian (CEO, Quantify expert) and Lee (PM, ex-AT-PAC) walking Zeno through the desktop Shipping workflows specifically to set mobile v1 scope. This is ground truth on what to build and what not to.

### Record type inference from From/To

Users never pick "Delivery" or "Return" from a menu. The record type is inferred from the From and To selections:

| From | To | Record Type | Number Prefix |
|------|-----|-------------|---------------|
| Branch | Job Site | Delivery | DEL |
| Job Site | Branch | Return | RET |
| Branch | Branch | Transfer | TRN |
| Job Site | Job Site | Transfer | TRN |

Number prefix updates live as radios change. Starting numbers and increments are configured in Tools → Numbering Options. Mobile can trust the defaults and does not need to expose numbering configuration.

### Context-sensitivity

When a user selects a job site in the Org Tree and creates a new shipment, the From and To fields are pre-filled based on that selection. Mobile should mirror this: if a user is looking at a job site and taps "new return," the From should already be set.

### The only required field

**Rent Start Date** is the single mandatory field on a new shipment. Everything else (driver, salesperson, notes, attachments) is optional. A global option can auto-fill Rent Start Date; Blake's code already does this on mobile so users never manually set it.

### Mobile v1 Scope — IN

Explicitly confirmed in scope by Brian and Lee:
- Create shipment with From, To, Rent Start Date pre-filled
- Attachments (photos, files)
- Notes (free text)
- Products tab: pick items, enter quantities, plus/minus incrementers
- Filter by category (Cuplock, QuickStage, etc.)
- Text filter (contains search on part number / description)
- "Showing parts on shipment" vs "showing parts at branch" toggle
- Damaged / Scrap / Lost-Missing handling on returns (one row can split quantity across all four destinations: To Ship, Damage, Scrap, Lost Missing)

### Mobile v1 Scope — OUT (explicitly excluded)

- **Consumables** — AT-PAC does sell them, but leave for later iteration
- **Additional Charges** (freight, dismantle, cutting fees) — office-side only
- **Recurring Charges** (monthly fees) — office-side only
- **Prorate features** (weight-based or list-based rent calculation) — desktop power feature
- **Barcode scanning** — probably useful later, not v1. Revisit after customer feedback
- **Service tickets / to-be-serviced workflow** — AT-PAC doesn't do servicing (harnesses, swing-stage motors aren't their business)
- **Advanced filter options** (starts-with vs contains, field-specific search) — keep filter simple
- **Rate Profile management, billing, invoicing** — all desktop
- **Damage disposition** (cut down to 5-foot, change damage to scrap, bill customer for damage) — desktop only; mobile only captures damage

**Rule:** if something lives in the office, don't build it in mobile. Mobile is for the yard.

### Three existing trust patterns (don't invent new ones)

AT-PAC is expected to raise "we don't trust our yard workers" concerns. Brian's position: this is not a software problem, but the system has three existing ways to handle different trust levels:

1. **Notifications (reactive)** — office gets notified when yard submits; reviews after the fact
2. **Reservations (proactive)** — office pre-creates reservations; yard only confirms quantities, doesn't create from scratch
3. **Counting on Receipt / In Transit** — yard submits, status becomes "To Be Received," office must confirm before it goes On Rent

Mobile does not need to invent new approval screens. It must coexist with all three modes.

### Returns — the four-destination quantity split

On a return, each line item can split its quantity across four columns:

| Column | Meaning | Mobile Behavior |
|--------|---------|-----------------|
| To Ship | Normal, going back into stock | Main quantity field |
| Damage | Damaged, disposition decided later | Flag + note + optional photo |
| Scrap | Beyond repair, write off | Flag + note + optional photo |
| Lost Missing | Physically unfindable on site | Flag + note |

Damage can ONLY be specified on a return — never on a delivery.

Column names are customizable in Global Options but these three are the defaults. Nobody has asked for a fourth category.

### Over-returns are first-class, not an edge case

Quantify allows returning MORE than was delivered. When this happens, the system creates a negative balance on the job site record that's resolved later. Real reasons this happens:
- Equipment was on site that nobody tracked
- A 10-foot tube was cut on site into two 5-foot tubes, both come back
- Customer picked up someone else's equipment

**This is a Quantify differentiator.** Brian cited a customer who paid SAP $10M to replicate Quantify and SAP couldn't do it because distribution software doesn't model return-more-than-you-sent.

Mobile must allow quantities that exceed the delivered amount. Can warn, but must allow.

### Rent Stop Date rules

- Rent Stop Date is the key field on returns
- It CAN be earlier than today (truck returned Friday, office processes Monday → Rent Stop = Friday, customer not billed for weekend)
- Office reviews all deliveries and returns before running invoicing, so yard estimates are fine as a first draft

### Scale — 50 items and 300–400 parts per shipment

Real-world shipment size: **50 distinct line items, 300–400 total parts.**

Implications for mobile counting screen:
- Must be scrollable and fast
- Category filter is essential, not optional
- Consider list virtualization
- Sticky headers so user always knows where they are
- Progress indicator (e.g., "37 of 50 items counted")
- The current prototype with 8 items will collapse at real scale — redesign needed

### Architecture note — library-driven validation

Quantify uses a three-tier architecture:
- **UI tier** — "dumb"; binds to library object
- **Library (middle tier)** — all business rules; exposes `isSavable` and a broken-rules collection with Error / Warning / Info severities
- **Data tier** — "dumb"; assumes valid data, just writes

Mobile uses the same library via API. Validation messages that appear on desktop will appear on mobile. You don't duplicate rules; you render them gracefully. Design error/warning/info display patterns accordingly.

### Predicted v2 requests (scope discipline for v1)

Brian predicts customers will ask for after v1 ships:
- Resolve damages in the yard (currently desktop only)
- Count physical yard inventory (not just count shipments)
- More

When customers ask for these during v1 sessions, the response is "we hear you, v2." Do not expand v1 scope.

### Working cadence

Design review with Brian every two days (Zeno's requested cadence, Brian agreed). Design, show, iterate.

---

## Workflow Detail — End-to-End AT-PAC Delivery Process (from Lee, 2026-04-14)

> Source: process diagram shared by Lee. This is the canonical end-to-end workflow at AT-PAC for a delivery, from sales order through customer-confirmed delivery and email follow-up. Use this to understand where mobile sits inside the full flow and what touches mobile must respect.

### Roles in the diagram

- **Office Staff / Sales** — sales-side and reservation creation
- **Operational / Yard Manager** — orchestrates yard work, prints tickets, hands paperwork around
- **Yard Manager / Yard Staff** — physical yard operations, counting, loading
- **Driver** — picks up at yard, delivers, gets customer sign-off
- **Quantify automation** — system-level state transitions, attachments, status updates

### The full sequence

**Sales / office side (pre-yard):**
1. Order Customer — Office Staff / Sales
2. Estimate — Office Staff / Sales
3. Estimate approved — Office Staff / Sales
4. Reservation ticket created — Operational / Yard Manager
5. Reservation pick ticket printed — Yard Manager

**Yard side (mobile's territory):**
6. Equipment is checked in the yard to confirm availability — Yard Manager / Yard Staff
7. Delivery approval confirmed — Office Staff / Sales
8. Paper reservation pick ticket handed to yard staff — Yard Manager
9. Pick ticket filled out (counting) — Yard Staff
10. Equipment loaded into stillages and set aside, ready for wagons — Yard Staff
11. Paper sheet filled out and handed back to yard manager — Yard Staff
12. Driver's name and vehicle registration captured — Yard Manager / Yard Staff
13. Delivery driver / customer wagon turns up; items collected — Yard Manager / Yard Staff
14. Equipment loaded onto wagon — Yard Staff
15. Photos of the fully loaded wagon and equipment taken — Yard Staff
16. All photos given in print to yard manager — Yard Staff
17. Photo attachments assigned to the delivery ticket number — Yard Manager
18. With driver info + photo attachments handed to Quantify automation
19. Reservation in Quantify is filled out — Yard Manager
20. Quantify status updates to Shipment Sent — Quantify automation
21. Reservation sent to site — Quantify automation
22. New reservation created if not all parts went on the first shipment (backorder) — Quantify automation

**Driver / customer side (post-yard):**
23. Delivery ticket printed and handed to driver — Operational / Yard Manager
24. If the customer is collecting, they sign the document at the yard — Driver
25. Driver delivers to site, equipment is counted by the receiver — Driver
26. Customer signs, document returned to driver, sent back to office — Driver
27. Delivery document added as an attachment in Quantify — Operational / Yard Manager
28. Office fills delivery numbers in Quantify — Quantify automation
29. Quantify status updates to Shipment Sent (final) — Quantify automation
30. Delivery complete email printed and sent to customer — Operational / Yard Manager
31. Process complete

### What this diagram adds beyond Brian + Lee's verbal walkthrough

- **Driver name + vehicle registration capture** is an explicit yard step (12). My prototype was missing this.
- **Photos serve multiple purposes**: full wagon + loaded equipment verification (15), not only damage documentation. Mobile should reframe photo capture as general shipment evidence, with damage as one variant.
- **Stillages first, then wagons** (10): there's a physical staging step where parts get pre-loaded into stillages before the wagon arrives. The yard worker may not need this in the app, but the mental model matters.
- **"Equipment checked in the yard to confirm availability"** (6) before loading begins: this is the verification step Andrej described in the AT-PAC interview. Could be a pre-step in mobile.
- **Customer pickup path** (24): if the customer collects directly, they sign at the yard. The driver-delivery and customer-pickup paths diverge at this point. v1 may treat customer pickup as out of scope; flag for v2.
- **Two "Shipment Sent" status updates** in the diagram (20 and 29) — the diagram labels both as "Shipment Sent" but they appear to be different states (sent from yard vs. confirmed delivered). Verify with Lee whether the second one is actually "Completed" or another status.

### Mobile's slice of this flow (v1 scope)

Mobile owns yard steps 9 → 19. Specifically:
- Steps 9–11: counting, loading, the paper-sheet replacement
- Step 12: driver name + vehicle registration capture (NEW — must be added)
- Steps 13–17: photos of wagon + load + auto-attach to shipment record
- Step 18–19: hand-off to Quantify automation via API

Everything before step 9 (sales, reservation creation, pick ticket print) and after step 19 (driver delivery, customer signature, office finalization) stays on desktop or other systems for v1.

### Open verification questions for Lee

1. Are the two "Shipment Sent" labels (20 and 29) actually the same status, or is the diagram simplified? In Quantify desktop terms, what should each be called?
2. Is the customer-pickup path (24) common enough to model in v1, or wait for v2?
3. The "stillage staging" step (10): is it always a separate pass, or do some yards load directly onto the wagon?
4. Where exactly should driver/registration capture live in mobile — at loading start, mid-load, or at submit?

---

## Workflow Detail — AT-PAC-Specific Vocabulary Added

In addition to the universal glossary above, AT-PAC interviews revealed:

- **Blue sheet** — internal manual spreadsheet for truckload breakdown (tonnage + priorities + sequence)
- **Pre-return pick ticket** — paper form yard fills out when accepting a return
- **Backorder ticket** — auto-generated in Quantify for the remainder after a partial truckload load
- **"First site"** (Andrej's term) — the principle that a return must be identified against the correct job site / reservation at the moment of receipt, not later in the office
- **DEL** — delivery record (reservation in completed state)
- **CNRL Fort Mac** — typical parent-location naming pattern where one named site has multiple Quantify job sites under it

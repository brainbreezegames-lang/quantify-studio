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
| **TRF** | Transfer | Move between locations |
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

### Way 1 — Straight Shipment (instant)
```
New Shipment → add products → hit OK → gone immediately
```
- Rent starts instantly
- No verification step
- Done by office staff
- **Mobile app: probably not needed here**

### Way 2 — Reservation → Release
```
Create Reservation → equipment held as "Reserved" (removed from available stock)
→ Yard workers count + load truck
→ Office enters actual quantities sent → releases
→ Equipment on rent ✓
```
- Reservation "holds" stock so others can't use it
- Reserved items appear in stock as "Reserved" not "Available"
- Yard workers can barcode-scan items as they load
- **Mobile app: yard worker counting + confirming what went on the truck**

### Way 3 — Reservation → Release → Customer Confirmation (most controlled)
```
Create Reservation → Yard counts + loads
→ Office releases → equipment marked "In Transit" (not yet on rent)
→ Customer physically counts what arrived → confirms
→ Discrepancy resolved → on rent ✓
```
- Used when customer disputes quantities
- Can hide quantities from customer so they must count themselves
- Discrepancy resolution:
  - Customer counted wrong → item goes on rent (customer pays)
  - Company didn't load it → goes back to available stock (company's fault)
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

### Way 1 — Straight Return
```
Right-click → Return → enter quantities → hit OK → rent stops ✓
```
- Instant, simple
- No scheduling
- Yard types what came in

### Way 2 — Pre-Return (client's preferred method)
```
Create Pre-Return (set future date + expected items)
→ Print pick ticket → goes to yard workers
→ Truck arrives → workers count items off truck
→ Office confirms actual quantities → rent stops ✓
```
- Client prefers this because date is set once and everything aligns
- Also used for overnight drops: print labels → workers unload into bays → count in the morning
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

**Pick Tickets:** Printable delivery/return documents; 2–5 signature lines configurable. Goes to yard workers showing what to load/unload.

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

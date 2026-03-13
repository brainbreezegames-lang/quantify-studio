# Quantify Mobile — UX Research Synthesis

---

## 1. Users & Environment

**Who they are:**
- Yard workers, yard managers, inventory teams
- Office/billing/dispatch staff (desktop users, but directly dependent on mobile)
- Field/job site workers (foremen, GCs — secondary mobile users)

**Devices:**
- iPads and rugged Android tablets in heavy-duty drop-proof cases with hand straps
- Both iOS and Android required

**Physical realities:**
- Direct sunlight causes severe screen glare — workers squint, seek shade, or abandon the app for paper
- Thick protective gloves (leather, rubber-coated, cut-resistant) are mandatory — small touch targets are unusable
- Hands covered in grease, mud, metal shavings — touching the screen requires removing a glove, which they hate
- Devices are NOT carried the whole time — loading requires two hands. Tablets get balanced on truck tailgates, stacked on materials, or shoved under an armpit
- Devices are never permanently mounted to vehicles — workers walk the entire yard

---

## 2. How They Work Today

**Yard worker's shift:**
- Check device for incoming equipment requests, outbound orders, unscheduled returns
- Truck arrives → worker gets pick-list (often still paper on a clipboard)
- Physically hunt down materials — items are frequently buried under other stacks
- Pull items, load using forklift or by hand, count, get driver signature
- Hand paperwork back to office

**The paper problem:**
- Many yards still use paper pick-tickets because they're easy to fill out on a tailgate
- When counts don't match, workers cross out the printed number with a Sharpie and write the actual number
- The office updates the system later — if they remember

**Communication between yard and office:**
- Two-way radios (walkie-talkies) are the standard
- Yelling out the window
- Calling the yard worker's personal cell phone
- To check delivery status, the office literally looks out the window to see if the truck is still there

---

## 3. Core Shipping Workflows (V1 Must-Haves)

| Type | What happens | Mobile action |
|---|---|---|
| **Direct Ship** | Office creates immediate dispatch | Worker picks items, confirms delivery manifest |
| **Reservation Release** | Office holds inventory for upcoming job | Worker pulls reserved items, triggers release, billing starts |
| **Return** | Rental period ends, truck comes back | Worker sorts, counts, flags damaged/missing items |

**Returns are the hardest workflow:**
- Equipment comes back in messy, unsorted piles
- Good, bent, and concrete-covered items are all mixed together
- Sorting and flagging damage falls entirely on the receiving yard worker, not the field worker
- Most time-consuming of all workflows

---

## 4. Scanning & Input

**Barcode scanning is the primary input — but deeply unreliable:**
- Metal scaffolding gets covered in mud, concrete, rust
- Barcode stickers get obscured, destroyed, or ripped off entirely
- Workers on Reddit openly mock barcodes/QR codes in scaffolding yards
- Manual quantity entry is an absolute fallback necessity

**How workers actually identify products:**
- Almost entirely by sight, size, and muscle memory
- They don't read labels — they know what a 10-foot ledger looks like vs. an 8-foot ledger
- Barcodes are a bonus, not a primary identification method

**Group scanning (new, Feb 2026):**
- Avontus introduced barcode group scanning
- Scan one code for a predefined bundle (e.g., 50 horizontal braces) → records entire group quantity
- Replaces the old one-scan-one-increment method
- Workers also need: scan one item, manually type "x50" for identical bundles on a pallet

---

## 5. Edge Cases & Pain Points

**Phantom inventory:**
- The system says 50 pieces are in the yard — the worker is staring at empty dirt
- Items were moved to another job site and never documented
- This is the #1 reason workers stop what they're doing and walk to the office

**Phantom transfers:**
- Scaffolding moves directly from Job Site A → Job Site B without returning to the yard
- A truck later arrives at the yard with 300 pieces when the system expected 100
- Causes massive count mismatches

**Undocumented substitutions:**
- Worker needs 50 items, only finds 45
- Throws in 5 of a slightly different size to keep the truck moving
- Forgets to write it down → office has corrupted inventory data
- This is the #1 mistake the office has to fix

**Damaged equipment:**
- Returns come back bent, covered in cured concrete
- Must be flagged so they're not accidentally allocated to the next outgoing truck
- Currently no clean way to do this in the flow

**Buried inventory:**
- Needed items are at the bottom of a massive stack
- Workers substitute a different size/type on the fly to get the truck out on time
- "I spend half my day tracking down basic shit"

**Unscheduled returns:**
- Trucks arrive with equipment not tied to any reservation
- No paperwork, no advance notice — just a pile of metal

**Last-minute field requests:**
- "We're done, come get it tomorrow" — zero planning
- Or the opposite: scheduled pickup for Friday, but work gets delayed, scaffolding sits there for 3 extra weeks

---

## 6. Connectivity & Offline

**The reality:**
- Scaffolding yards are giant Faraday cages — massive stacks of steel/aluminum kill WiFi and cellular signals
- Dead zones are everywhere, especially near metal laydown areas and loading bays
- Job sites are even worse — basements, parking garages, steel-framed high-rises = zero signal

**What the app must do:**
- Full offline mode is non-negotiable
- Queue all data locally when connection drops
- Worker must be able to continue counting seamlessly without interruption
- Auto-sync in background when connection returns
- Prioritize critical inventory updates over heavy media (photos)
- If offline mode fails, workers restart 200-piece counts from scratch — major frustration source

**What the worker needs to see:**
- Clear visual confirmation that sync was successful
- They need to know they're no longer blocking the office before moving to the next truck

---

## 7. Mobile → Desktop Handoff

**It's a hard dependency chain:**
- The office CANNOT finalize a shipment, process an invoice, or release billing until the yard worker confirms the physical count
- Once the worker taps "confirm" and the device syncs → office sees updated inventory in real-time
- This automatically triggers: delivery manifests, inventory adjustments, rental billing activation
- No manual office intervention required after sync

**The waiting game:**
- Office waits on yard for final load confirmations (so they can run billing or go home)
- Yard waits on office when a driver shows up unannounced and the pick-ticket isn't approved yet
- Both sides are frequently blocked by the other

**End-of-day office tasks:**
- Running "missing inventory" reports
- Reconciling damages to charge clients for broken/lost equipment
- These reports depend entirely on accurate yard data

---

## 8. Open Design Questions (Need Client Input)

1. **Failed scan fallback:** When a barcode scan fails (mud, damage), should the app immediately open a manual search bar, or prompt the worker to photograph the damaged tag?

2. **Unauthorized substitutions:** When the yard worker changes a count without office approval (which they WILL do to keep trucks moving), should the app block them until the office approves, or allow the change but flag it for the office to review later?

3. **Group scanning in V1:** Given that group scanning launched Feb 2026, should V1 prioritize bundled scanning, or ship with individual scanning first?

---

## Key UX Implications (Design Drivers)

- **Touch targets must be massive** — gloved hands, greasy fingers, sunlight glare
- **High contrast is mandatory** — direct sunlight is the default environment
- **The app competes with paper** — if it's slower than a clipboard and Sharpie, workers will abandon it
- **Offline-first architecture** — not offline-capable, offline-FIRST
- **Never block the worker** — any hard stop (approval gates, connection requirements, forced flows) will kill adoption
- **Sync status must be unmistakable** — the worker needs to know the office received their data so they can walk to the next truck
- **Substitutions will happen** — design for it, don't prevent it
- **Returns are the messiest workflow** — needs the most UX attention
- **Workers identify by sight, not by code** — product images/silhouettes may be more useful than product numbers

import { useState } from 'react'
import { SHIPMENTS, CATALOG, Shipment, ShipmentItem, ItemFlag, CatalogItem } from './data'
import PhoneFrame from './PhoneFrame'
import ShipmentList from './screens/ShipmentList'
import ShipmentDetail from './screens/ShipmentDetail'
import CountingScreen from './screens/CountingScreen'
import MissingItems from './screens/MissingItems'
import ConditionCheck from './screens/ConditionCheck'
import ReviewScreen from './screens/ReviewScreen'
import ToBeReceived from './screens/ToBeReceived'
import DiscrepancyDetail from './screens/DiscrepancyDetail'
import SelectLocation from './screens/SelectLocation'
import PhotoCapture from './screens/PhotoCapture'
import AddItemPicker from './screens/AddItemPicker'
import SideNav from './screens/SideNav'
import ProfileSheet from './screens/ProfileSheet'
import CreateNewSheet from './screens/CreateNewSheet'
import NumericKeypad from './components/NumericKeypad'
import PresenterMode, { Segment } from './presenter/PresenterMode'
import './demo.css'

export type Screen =
  | 'list' | 'detail' | 'counting'
  | 'missing' | 'condition'
  | 'review' | 'to-be-received'
  | 'discrepancy' | 'select-location'
  | 'photo' | 'add-item'

export type Overlay = 'side-nav' | 'profile' | 'create-new' | null

interface DemoState {
  screen: Screen
  direction: 'forward' | 'back'
  overlay: Overlay
  currentShipmentId: string | null
  items: ShipmentItem[]
  activeItemId: string | null
  keypadValue: string
  flaggingItemId: string | null
  photoItemId: string | null
  selectedLocation: string
  submittedSummary: { units: number; variances: number; flagged: number } | null
}

const INITIAL: DemoState = {
  screen: 'list',
  direction: 'forward',
  overlay: null,
  currentShipmentId: null,
  items: [],
  activeItemId: null,
  keypadValue: '',
  flaggingItemId: null,
  photoItemId: null,
  selectedLocation: 'New York Branch Office',
  submittedSummary: null,
}

export default function DemoApp() {
  const [state, setState] = useState<DemoState>(INITIAL)

  function goTo(screen: Screen, dir: 'forward' | 'back' = 'forward') {
    setState(s => ({ ...s, screen, direction: dir, overlay: null }))
  }

  function setOverlay(overlay: Overlay) {
    setState(s => ({ ...s, overlay }))
  }

  function selectShipment(id: string) {
    const shipment = SHIPMENTS.find(s => s.id === id)!
    if (shipment.status === 'DISCREPANCY') {
      setState(s => ({ ...s, currentShipmentId: id, screen: 'discrepancy', direction: 'forward', overlay: null }))
      return
    }
    setState(s => ({
      ...s,
      currentShipmentId: id,
      items: shipment.items.map(i => ({ ...i })),
      screen: 'detail',
      direction: 'forward',
      overlay: null,
    }))
  }

  function startCounting() {
    goTo('counting')
  }

  function openKeypad(itemId: string) {
    const item = state.items.find(i => i.id === itemId)!
    setState(s => ({
      ...s,
      activeItemId: itemId,
      keypadValue: item.counted !== null ? String(item.counted) : '',
    }))
  }

  function keypadInput(digit: string) {
    setState(s => {
      if (s.keypadValue.length >= 4) return s
      return { ...s, keypadValue: s.keypadValue + digit }
    })
  }

  function keypadBackspace() {
    setState(s => ({ ...s, keypadValue: s.keypadValue.slice(0, -1) }))
  }

  function keypadConfirm() {
    const counted = state.keypadValue === '' ? 0 : parseInt(state.keypadValue, 10)
    setState(s => {
      const items = s.items.map(item => {
        if (item.id !== s.activeItemId) return item
        const sameCount = item.counted === counted
        return { ...item, counted, flag: sameCount ? item.flag : null }
      })
      return { ...s, items, activeItemId: null, keypadValue: '' }
    })
  }

  function closeKeypad() {
    setState(s => ({ ...s, activeItemId: null, keypadValue: '' }))
  }

  function openFlag(itemId: string) {
    const targetScreen: Screen = currentShipment?.type === 'PRE-RETURN' ? 'condition' : 'missing'
    setState(s => ({ ...s, flaggingItemId: itemId, screen: targetScreen, direction: 'forward', overlay: null }))
  }

  function saveFlag(itemId: string, flag: ItemFlag) {
    setState(s => {
      const items = s.items.map(i => i.id === itemId ? { ...i, flag } : i)
      return { ...s, items, flaggingItemId: null, screen: 'counting', direction: 'back' }
    })
  }

  function closeFlag() {
    setState(s => ({ ...s, flaggingItemId: null, screen: 'counting', direction: 'back' }))
  }

  function openPhoto(itemId: string) {
    setState(s => ({ ...s, photoItemId: itemId, screen: 'photo', direction: 'forward', overlay: null }))
  }

  function closePhoto() {
    setState(s => ({ ...s, photoItemId: null, screen: 'counting', direction: 'back' }))
  }

  function addItemFromCatalog(catalogItem: CatalogItem, qty: number) {
    const newItem: ShipmentItem = {
      id: `added-${catalogItem.id}-${Date.now()}`,
      name: catalogItem.name,
      subtitle: catalogItem.subtitle,
      expected: qty,
      counted: qty,
      flag: null,
    }
    setState(s => ({
      ...s,
      items: [...s.items, newItem],
      screen: 'counting',
      direction: 'back',
    }))
  }

  function goToReview() {
    goTo('review')
  }

  function confirmSubmit() {
    const units = state.items.reduce((s, i) => s + (i.counted ?? 0), 0)
    const variances = state.items.filter(i => i.counted !== null && i.counted !== i.expected).length
    const flagged = state.items.filter(i => i.flag !== null).length
    setState(s => ({
      ...s,
      screen: 'to-be-received',
      direction: 'forward',
      submittedSummary: { units, variances, flagged },
    }))
  }

  function selectLocation(name: string) {
    setState(s => ({ ...s, selectedLocation: name, screen: 'list', direction: 'back' }))
  }

  function reset() {
    setState(INITIAL)
  }

  const currentShipment: Shipment | null = state.currentShipmentId
    ? (SHIPMENTS.find(s => s.id === state.currentShipmentId) ?? null)
    : null

  const flaggingItem = state.items.find(i => i.id === state.flaggingItemId) ?? null
  const photoItem = state.items.find(i => i.id === state.photoItemId) ?? null
  const activeItem = state.items.find(i => i.id === state.activeItemId) ?? null

  const { screen, direction, overlay } = state
  const isReturn = currentShipment?.type === 'PRE-RETURN'
  const accentColor = isReturn ? '#D97706' : '#1E3FFF'

  // Only render an overlay element when one is actually active,
  // otherwise the empty wrapper would block scroll + clicks on the screen.
  const hasKeypad = !!activeItem && screen === 'counting'
  const hasOverlay = overlay !== null || hasKeypad

  const overlays = hasOverlay ? (
    <>
      {overlay === 'side-nav' && (
        <SideNav
          selectedLocation={state.selectedLocation}
          onClose={() => setOverlay(null)}
          onProfile={() => setState(s => ({ ...s, overlay: 'profile' }))}
          onSelectLocation={() => setState(s => ({ ...s, overlay: null, screen: 'select-location', direction: 'forward' }))}
        />
      )}
      {overlay === 'profile' && <ProfileSheet onClose={() => setOverlay(null)} />}
      {overlay === 'create-new' && (
        <CreateNewSheet
          onClose={() => setOverlay(null)}
          onSelect={(type) => {
            if (type === 'delivery') selectShipment('DEL-2401')
            else if (type === 'pre-return') selectShipment('RET-1892')
            else setOverlay(null)
          }}
        />
      )}
      {hasKeypad && activeItem && (
        <NumericKeypad
          item={activeItem}
          value={state.keypadValue}
          accentColor={accentColor}
          onInput={keypadInput}
          onBackspace={keypadBackspace}
          onConfirm={keypadConfirm}
          onClose={closeKeypad}
        />
      )}
    </>
  ) : undefined

  // ── Presentation script ─────────────────────────────────────────────────────
  const presenterSegments: Segment[] = [
    {
      id: 'open',
      action: () => reset(),
      text: "What you're about to see is scoped exactly to what Brian and Lee defined — a yard-side companion, not a second Quantify. Four things, done well: open a reservation or pre-return, count with a real keypad, capture photos and driver info, and submit. Everything I cut, I cut on purpose.",
    },
    {
      id: 'list-overview',
      action: () => reset(),
      text: "This is what a yard worker sees when they open the app. List first. No hero banner, no promo strip. A yard worker with gloves on, in direct sunlight, doesn't want chrome. They want the list.",
    },
    {
      id: 'discrepancy',
      text: "Look at RET double-oh eight-two-nine. Red stripe, red dot, 'Count mismatch minus twelve,' and inline: 'Resolve on desktop.' The mobile is deliberately read-only for discrepancies. Michelle was emphatic. Destructive and corrective actions stay on desktop.",
    },
    {
      id: 'needs-count',
      text: "DEL double-oh seven-nine-one. Amber stripe, amber dot, 'Needs your count.' At-a-glance triage. What do I have to do today?",
    },
    {
      id: 'filters',
      text: "Filter counts live in their own pill — the number doesn't blend into the label. 'All' is first and default, because that's what a yard worker wants to see on arrival.",
    },
    {
      id: 'fab-open',
      action: () => { goTo('list'); setOverlay('create-new') },
      text: "The plus button. Going Out. Coming In. Delivery, Reservation, Return, Pre-Return. Spoken language that matches Quantify desktop exactly — no invented terms.",
    },
    {
      id: 'fab-close',
      action: () => setOverlay(null),
      text: "Notice what's not here. There's no free-text 'new shipment.' Yard workers never create records from scratch. That's the Brian and Lee rule. Every shipment originates on desktop.",
    },
    {
      id: 'detail-open',
      action: () => selectShipment('DEL-00791'),
      text: "Tap a shipment. From, To, Rent Start — the three things a yard worker needs before loading. Driver and Vehicle are inline fields, tap to set. Brian flagged that driver capture can happen at loading start or at submit. I put it at both touchpoints so it's never missed.",
    },
    {
      id: 'sticky-cta-detail',
      text: "Notice Start Loading stays pinned to the bottom. Sticky CTAs with real states — disabled, loading, success — across every action screen in the app.",
    },
    {
      id: 'counting-open',
      action: () => goTo('counting'),
      text: "This is where the real work happens. Three hundred plus parts per shipment on average. Which is why counting is keypad first — not plus and minus alone. Brian was explicit on this.",
    },
    {
      id: 'keypad-open',
      action: () => {
        const first = SHIPMENTS.find(s => s.id === 'DEL-00791')?.items[0]
        if (first) openKeypad(first.id)
      },
      text: "Tap the count box and you get a numeric sheet. Direct entry. Plus and minus are still available in the row for micro-adjustments, because seasoned yard workers tweak. But the primary interaction is the keypad.",
    },
    {
      id: 'keypad-close',
      action: () => closeKeypad(),
      text: "Filter tabs above the list — All, Pending, Done, Flagged. Search collapses to an icon until you tap it. No stacked control strips. The list dominates the viewport.",
    },
    {
      id: 'flag-open',
      action: () => {
        const damaged = SHIPMENTS.find(s => s.id === 'DEL-00791')?.items.find(i => i.flag)
        if (damaged) {
          setState(s => ({
            ...s,
            flaggingItemId: damaged.id,
            screen: 'missing',
            direction: 'forward',
            overlay: null,
          }))
        }
      },
      text: "Here's the damage flow. Four destinations — Loaded, Damaged, Scrapped, Lost-missing. Exact Quantify desktop vocabulary. Earlier drafts called this 'Split count.' I killed that. If it's not in Quantify, it's not in the app.",
    },
    {
      id: 'flag-close',
      action: () => goTo('counting', 'back'),
      text: "Back to counting. Notice the CTA — it adapts. 'N items left' while counting, 'Review' when complete. The button tells the user what state they're in.",
    },
    {
      id: 'review-open',
      action: () => goTo('review'),
      text: "Review. Three numbers — Units, Variances, Flagged. Then line-level detail. Note field is optional. The office doesn't need essays from the yard.",
    },
    {
      id: 'review-key-line',
      text: "This is the most important sentence in the entire app. 'Rent doesn't start until the office confirms and the truck reaches the customer.' Two-stage trust. Lee, Michelle, and Andrej all flagged this independently during the AT-PAC call. The old flow went Reserved straight to Completed. That was wrong. The office reviews first.",
    },
    {
      id: 'submit',
      action: () => {
        const items = SHIPMENTS.find(s => s.id === 'DEL-00791')?.items ?? []
        const units = items.reduce((s, i) => s + (i.counted ?? 0), 0)
        const variances = items.filter(i => i.counted !== null && i.counted !== i.expected).length
        const flagged = items.filter(i => i.flag !== null).length
        setState(s => ({
          ...s,
          items: items.map(i => ({ ...i })),
          screen: 'to-be-received',
          direction: 'forward',
          submittedSummary: { units, variances, flagged },
        }))
      },
      text: "Submit. Three-dot stepper: Yard counted, Office reviewing, In Transit. The eyebrow says 'To Be Received' — that is the official Quantify status, not something I invented.",
    },
    {
      id: 'closing',
      action: () => goTo('list', 'back'),
      text: "A few things I chose not to build. No void — Michelle said so. No billing, no consumables, no prorate — Andrej endorsed the eighty percent rule. Practical basics first. Every pattern you saw came from internal Quantify vocabulary or the AT-PAC interview. No competitor references anywhere, per Brian's rule.",
    },
    {
      id: 'questions',
      text: "Three open questions for you. One: the interim status when mobile submits but the office hasn't confirmed — is 'To Be Received' correct, or does it need a new name? Two: customer pickup versus driver delivery — version one or version two? Three: video capture — Andrej mentioned some yards use it. Version one or version two? Happy to walk through the code, the data model, or any screen in detail.",
    },
  ]

  return (
    <>
    <PhoneFrame overlay={overlays}>
      <div key={screen} className={direction === 'forward' ? 'screen-enter' : 'screen-enter-back'} style={{ minHeight: '100%' }}>
        {screen === 'list' && (
          <ShipmentList
            shipments={SHIPMENTS}
            selectedLocation={state.selectedLocation}
            onSelect={selectShipment}
            onOpenMenu={() => setOverlay('side-nav')}
            onOpenProfile={() => setOverlay('profile')}
            onOpenLocation={() => goTo('select-location')}
            onOpenCreateNew={() => setOverlay('create-new')}
          />
        )}

        {screen === 'detail' && currentShipment && (
          <ShipmentDetail
            shipment={currentShipment}
            items={state.items}
            onBack={() => goTo('list', 'back')}
            onStart={startCounting}
          />
        )}

        {screen === 'counting' && currentShipment && (
          <CountingScreen
            shipment={currentShipment}
            items={state.items}
            activeItemId={state.activeItemId}
            onBack={() => goTo('detail', 'back')}
            onTapItem={openKeypad}
            onFlag={openFlag}
            onPhoto={openPhoto}
            onAddItem={() => goTo('add-item')}
            onReview={goToReview}
          />
        )}

        {screen === 'missing' && flaggingItem && (
          <MissingItems
            item={flaggingItem}
            onSave={(flag) => saveFlag(flaggingItem.id, flag)}
            onBack={closeFlag}
            onPhoto={() => openPhoto(flaggingItem.id)}
          />
        )}

        {screen === 'condition' && flaggingItem && (
          <ConditionCheck
            item={flaggingItem}
            onSave={(flag) => saveFlag(flaggingItem.id, flag)}
            onBack={closeFlag}
          />
        )}

        {screen === 'review' && currentShipment && (
          <ReviewScreen
            shipment={currentShipment}
            items={state.items}
            onBack={() => goTo('counting', 'back')}
            onConfirm={confirmSubmit}
          />
        )}

        {screen === 'to-be-received' && currentShipment && state.submittedSummary && (
          <ToBeReceived
            shipment={currentShipment}
            summary={state.submittedSummary}
            onDone={reset}
          />
        )}

        {screen === 'discrepancy' && currentShipment && (
          <DiscrepancyDetail
            shipment={currentShipment}
            onBack={() => goTo('list', 'back')}
          />
        )}

        {screen === 'select-location' && (
          <SelectLocation
            selectedLocation={state.selectedLocation}
            onSelect={selectLocation}
            onBack={() => goTo('list', 'back')}
          />
        )}

        {screen === 'photo' && currentShipment && (
          <PhotoCapture
            itemName={photoItem?.name ?? ''}
            shipmentId={currentShipment.id}
            onClose={closePhoto}
          />
        )}

        {screen === 'add-item' && (
          <AddItemPicker
            catalog={CATALOG}
            onAdd={addItemFromCatalog}
            onBack={() => goTo('counting', 'back')}
          />
        )}
      </div>
    </PhoneFrame>
    <PresenterMode segments={presenterSegments} />
    </>
  )
}

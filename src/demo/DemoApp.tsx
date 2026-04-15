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

interface DemoAppProps {
  presentMode?: boolean
}

export default function DemoApp({ presentMode = false }: DemoAppProps = {}) {
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
      text: "This is Quantify Mobile. It replaces a paper clipboard. That's it. A yard worker, in the rain, with gloves on — today they walk back to the office to type numbers into a computer. We thought they shouldn't have to.",
    },
    {
      id: 'list-overview',
      action: () => reset(),
      target: 'app-header',
      text: "The first thing they see. No dashboard. No banners. Just the work.",
    },
    {
      id: 'location-bar',
      target: 'location-bar',
      text: "One branch. One scope. They don't re-select this every time they open the app. That would be insulting.",
    },
    {
      id: 'filters',
      target: 'filter-chips',
      text: "All first. Because on a busy Monday, you don't want to start filtered.",
    },
    {
      id: 'discrepancy',
      target: 'card-RET-00829',
      padding: 10,
      text: "This one's red. What came off the truck didn't match what was sent. And right there on the card — resolve on desktop. Because the yard worker shouldn't fix this on a phone. Their job is to count. Someone else's job is to reconcile.",
    },
    {
      id: 'needs-count',
      target: 'card-DEL-00791',
      padding: 10,
      text: "Amber. Needs your count. This is why they opened the app.",
    },
    {
      id: 'detail-open',
      action: () => selectShipment('DEL-00791'),
      text: "A delivery. From a branch, to a job site, with a rent start date. Driver and vehicle, tap to set. We argued about when to capture the driver — at loading, or at submit. The answer was both.",
    },
    {
      id: 'sticky-cta-detail',
      target: 'sticky-cta',
      text: "And notice — this button never leaves the bottom. You never scroll down to find the action.",
    },
    {
      id: 'counting-open',
      action: () => goTo('counting'),
      text: "This is where they actually live. A typical shipment is three hundred parts. Some are four.",
    },
    {
      id: 'counting-row',
      action: () => {
        const sh = SHIPMENTS.find(s => s.id === 'DEL-00791')
        if (sh) setState(s => ({ ...s, items: sh.items.map(i => ({ ...i })) }))
      },
      target: 'counting-row-d1a',
      text: "One row, one item. Big targets. Gloved thumbs don't hit tiny buttons.",
    },
    {
      id: 'keypad-open',
      action: () => {
        const first = SHIPMENTS.find(s => s.id === 'DEL-00791')?.items[0]
        if (first) openKeypad(first.id)
      },
      target: 'keypad',
      text: "Tap a count box and you get this. A real numeric keypad. Not plus-minus buttons tapped ninety-six times to enter ninety-six.",
    },
    {
      id: 'tabs',
      action: () => closeKeypad(),
      target: 'counting-tabs',
      text: "All. Pending. Done. Flagged. Search is there when you need it. Hidden when you don't.",
    },
    {
      id: 'flag-open',
      action: () => {
        const sh = SHIPMENTS.find(s => s.id === 'DEL-00791')
        if (!sh) return
        const items = sh.items.map(i =>
          i.id === 'd1a' ? { ...i, counted: 65 } : { ...i }
        )
        setState(s => ({
          ...s,
          items,
          flaggingItemId: 'd1a',
          screen: 'missing',
          direction: 'forward',
          overlay: null,
        }))
      },
      text: "When something's damaged, they flag it. Four destinations — loaded, damaged, scrapped, lost. These aren't my words. They're Quantify's words.",
    },
    {
      id: 'review-open',
      action: () => {
        const sh = SHIPMENTS.find(s => s.id === 'DEL-00791')
        if (!sh) return
        setState(s => ({
          ...s,
          items: sh.items.map(i => ({ ...i })),
          screen: 'review',
          direction: 'forward',
          overlay: null,
          flaggingItemId: null,
        }))
      },
      text: "When counting's done, they review. Three numbers that matter. Everything else in a list below.",
    },
    {
      id: 'rent-info',
      target: 'rent-info',
      text: "And this. This sentence. Before we wrote this, yard workers thought submit meant done. It didn't. The office still had to confirm. This sentence makes that honest.",
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
      target: 'stepper',
      text: "They submit. And the shipment moves to a state called To Be Received. The yard's done their part. Now it's the office's turn.",
    },
    {
      id: 'closing',
      action: () => goTo('list', 'back'),
      text: "What's not in here. No void. No billing. No consumables. None of the things the desktop already does better. That's deliberate.",
    },
    {
      id: 'questions',
      text: "Three things I still need your input on. What do we call this interim state. Whether customer pickup belongs in version one. And whether video capture belongs in version one. Those are conversations — not decisions.",
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
    {presentMode && <PresenterMode segments={presenterSegments} autoStart={false} />}
    </>
  )
}

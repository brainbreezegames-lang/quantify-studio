import { useState, useEffect } from 'react'
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
import Settings from './screens/Settings'
import NumericKeypad from './components/NumericKeypad'
import PresenterMode, { Segment } from './presenter/PresenterMode'
import './demo.css'

export type Screen =
  | 'list' | 'detail' | 'counting'
  | 'missing' | 'condition'
  | 'review' | 'to-be-received'
  | 'discrepancy' | 'select-location'
  | 'photo' | 'add-item' | 'settings'

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
  // Where to return after PhotoCapture closes — so taking a photo mid-flag
  // doesn't discard the in-progress MissingItems/ConditionCheck state.
  photoOriginScreen: Screen
  selectedLocation: string
  submittedSummary: { units: number; variances: number; flagged: number } | null
  // Toast shown when a Create-New option isn't hooked up in the demo flow.
  toast: string | null
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
  photoOriginScreen: 'counting',
  selectedLocation: 'New York',
  submittedSummary: null,
  toast: null,
}

interface DemoAppProps {
  presentMode?: boolean
}

export default function DemoApp({ presentMode = false }: DemoAppProps = {}) {
  const [state, setState] = useState<DemoState>(INITIAL)

  // Auto-dismiss toast after 3s.
  useEffect(() => {
    if (!state.toast) return
    const t = setTimeout(() => setState(s => ({ ...s, toast: null })), 3000)
    return () => clearTimeout(t)
  }, [state.toast])

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
    setState(s => ({
      ...s,
      photoItemId: itemId,
      photoOriginScreen: s.screen === 'photo' ? s.photoOriginScreen : s.screen,
      screen: 'photo',
      direction: 'forward',
      overlay: null,
    }))
  }

  function closePhoto() {
    // Return to wherever photo capture was invoked from so in-progress flag
    // state (MissingItems, ConditionCheck) is preserved.
    setState(s => ({ ...s, photoItemId: null, screen: s.photoOriginScreen, direction: 'back' }))
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
          onOpenSettings={() => setState(s => ({ ...s, overlay: null, screen: 'settings', direction: 'forward' }))}
        />
      )}
      {overlay === 'profile' && <ProfileSheet onClose={() => setOverlay(null)} />}
      {overlay === 'create-new' && (
        <CreateNewSheet
          onClose={() => setOverlay(null)}
          onSelect={(type) => {
            if (type === 'delivery') selectShipment('DEL-2401')
            else if (type === 'pre-return') selectShipment('RET-1892')
            else if (type === 'reservation') {
              // Reserve-future flow isn't built yet for the demo — drop user into
              // the closest approximation (a RESERVED delivery) so the demo has
              // no dead-ends and announce the shortcut.
              setState(s => ({ ...s, overlay: null, toast: 'Reservation flow opens a RESERVED delivery in the demo' }))
              setTimeout(() => selectShipment('DEL-00791'), 180)
            } else if (type === 'return') {
              // Same story for an "arriving now" return — route to the open PRE-RETURN.
              setState(s => ({ ...s, overlay: null, toast: 'Return flow opens a PRE-RETURN in the demo' }))
              setTimeout(() => selectShipment('RET-1892'), 180)
            } else {
              setOverlay(null)
            }
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

  // ── Presentation script - Jobs as a UX designer ───────────────────────────
  const presenterSegments: Segment[] = [
    {
      id: 'open',
      action: () => reset(),
      image: '/present/yard-opening.png',
      text: "Imagine a yard worker. Six in the morning. It's raining. Gloves on. There's a truck, and a clipboard, and about three hundred pieces of scaffolding to count. Today, they count it on paper. Then they walk back to the office. Then they type it into a computer. We thought - they shouldn't have to.",
    },
    {
      id: 'list-overview',
      action: () => reset(),
      target: 'app-header',
      text: "So this is what they open. There's no dashboard. No banner. No welcome screen. We fought hard to keep this empty. Because at six in the morning, a yard worker doesn't want a tutorial. They want the list.",
    },
    {
      id: 'location-bar',
      target: 'location-bar',
      text: "One branch, one scope. We could have put a location picker on every screen. We didn't. Because asking someone to re-pick their location twelve times a day is not a design choice. It's a tax.",
    },
    {
      id: 'filters',
      target: 'filter-chips',
      text: "All first. Because on a busy Monday morning, you don't want to start filtered.",
    },
    {
      id: 'discrepancy',
      target: 'card-RET-00829',
      padding: 10,
      text: "This card is red. Something went wrong. What came off the truck didn't match what was sent. And we had an argument about what to do here. Do we show the variances? Let them fix it? We said no. Because fixing a discrepancy is an office job. A phone on a loading dock is not the place to reconcile inventory. So the card says one thing. Resolve on desktop. And we step out of the way.",
    },
    {
      id: 'needs-count',
      target: 'card-DEL-00791',
      padding: 10,
      text: "This one's amber. Needs your count. Three words, doing the work of a paragraph.",
    },
    {
      id: 'detail-open',
      action: () => selectShipment('DEL-00791'),
      text: "Tap in. A delivery. From a branch, to a job site, on a date. We started this screen with fifteen fields. Cut it to nine. Cut it to six. Ended at four. Because the yard worker doesn't need the billing address before they load the truck.",
    },
    {
      id: 'sticky-cta-detail',
      target: 'sticky-cta',
      text: "And this button. Start loading. It stays pinned. Always visible. Always ready. A yard worker has a phone in one hand and a clipboard in the other. They don't have time to hunt for the next step.",
    },
    {
      id: 'counting-open',
      action: () => goTo('counting'),
      text: "And here's the heart of it. The counting screen. A typical shipment is three hundred parts. Some are four. This one screen is the reason the app exists.",
    },
    {
      id: 'counting-row',
      action: () => {
        const sh = SHIPMENTS.find(s => s.id === 'DEL-00791')
        if (sh) setState(s => ({ ...s, items: sh.items.map(i => ({ ...i })) }))
      },
      target: 'counting-row-d1a',
      text: "Every row - one item. One count box. We tested these at thirty-two pixels. Gloves missed. We tested at forty-four. Still too small. Fifty-six pixels - that's what worked.",
    },
    {
      id: 'keypad-open',
      action: () => {
        const first = SHIPMENTS.find(s => s.id === 'DEL-00791')?.items[0]
        if (first) openKeypad(first.id)
      },
      target: 'keypad',
      text: "Tap the count box. You get this. A real keypad. Not plus-minus buttons. Try tapping plus ninety-six times, in the cold. We did. It's not a count - it's a punishment.",
    },
    {
      id: 'tabs',
      action: () => closeKeypad(),
      target: 'counting-tabs',
      text: "All. Pending. Done. Flagged. That's it. Search is behind an icon - because search is the exception. And when it's the exception, it shouldn't take space.",
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
      text: "Things break. Things go missing. Things get scrapped. So when a count doesn't match, this opens. Four destinations. Loaded, damaged, scrapped, lost. These aren't our words. They're Quantify's words. We checked.",
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
      text: "When it's done, you review. Three numbers. Everything else, in a list underneath.",
    },
    {
      id: 'rent-info',
      target: 'rent-info',
      text: "And this one sentence. This is the most important line in the entire app. Before we wrote it, workers thought submit meant done. It didn't. The office still had to confirm. Billing hadn't started. This sentence makes that honest. It's the kind of thing a designer writes in thirty seconds - and quietly prevents a month of support tickets.",
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
      text: "Submit. And the shipment moves into a state called To Be Received. The yard's done their part. Now it's the office's turn. Two stages of trust - honest about where the work sits at every moment.",
    },
    {
      id: 'closing',
      action: () => goTo('list', 'back'),
      text: "What's not in here. No void. No billing. No consumables. No prorate. None of the things the desktop already does. Faster. Because the fastest way to make a mobile app feel bad - is to ask it to do everything.",
    },
    {
      id: 'questions',
      text: "A few things I still need your input on. What we call this interim state. Whether customer pickup belongs in version one. Whether video capture does. Those aren't decisions I can make alone. They're conversations.",
    },
  ]

  const toastEl = state.toast ? (
    <div
      className="absolute left-4 right-4 z-[60] pointer-events-none flex justify-center"
      style={{ top: 52, animation: 'fadeIn 180ms ease-out forwards' }}
    >
      <div
        className="bg-[#0A0A0A] text-white text-[13px] font-semibold px-4 py-2.5 rounded-full shadow-lg max-w-full text-center"
        style={{ boxShadow: '0 8px 24px rgba(10,13,30,0.25)' }}
      >
        {state.toast}
      </div>
    </div>
  ) : null

  return (
    <>
    <PhoneFrame overlay={overlays} floating={toastEl}>
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

        {screen === 'settings' && <Settings onBack={() => goTo('list', 'back')} />}
      </div>
    </PhoneFrame>
    {presentMode && <PresenterMode segments={presenterSegments} autoStart={false} />}
    </>
  )
}

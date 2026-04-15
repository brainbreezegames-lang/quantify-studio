import { useState } from 'react'
import { SHIPMENTS, Shipment, ShipmentItem, ItemFlag } from './data'
import PhoneFrame from './PhoneFrame'
import ShipmentList from './screens/ShipmentList'
import ShipmentDetail from './screens/ShipmentDetail'
import CountingScreen from './screens/CountingScreen'
import MissingItems from './screens/MissingItems'
import ConditionCheck from './screens/ConditionCheck'
import ReviewScreen from './screens/ReviewScreen'
import './demo.css'

export type Screen = 'list' | 'detail' | 'counting' | 'missing' | 'condition' | 'review' | 'done'

export interface DemoState {
  screen: Screen
  direction: 'forward' | 'back'
  shipment: Shipment | null
  items: ShipmentItem[]
  activeItemId: string | null   // item whose keypad is open
  keypadValue: string
  flaggingItemId: string | null // item open in missing/condition screen
}

const INITIAL: DemoState = {
  screen: 'list',
  direction: 'forward',
  shipment: null,
  items: [],
  activeItemId: null,
  keypadValue: '',
  flaggingItemId: null,
}

export default function DemoApp() {
  const [state, setState] = useState<DemoState>(INITIAL)

  function goTo(screen: Screen, dir: 'forward' | 'back' = 'forward') {
    setState(s => ({ ...s, screen, direction: dir }))
  }

  function selectShipment(id: string) {
    const shipment = SHIPMENTS.find(s => s.id === id)!
    setState(s => ({
      ...s,
      shipment,
      items: shipment.items.map(i => ({ ...i })),
      screen: 'detail',
      direction: 'forward',
    }))
  }

  function startCounting() {
    goTo('counting')
  }

  // ── Keypad ──────────────────────────────────────────────────────────────────

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
      const next = s.keypadValue + digit
      // Max 4 digits
      if (next.length > 4) return s
      return { ...s, keypadValue: next }
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
        // If count changed and there was a flag, reset it
        const sameCount = item.counted === counted
        return {
          ...item,
          counted,
          flag: sameCount ? item.flag : null,
        }
      })
      return { ...s, items, activeItemId: null, keypadValue: '' }
    })
  }

  function closeKeypad() {
    setState(s => ({ ...s, activeItemId: null, keypadValue: '' }))
  }

  // ── Flag ────────────────────────────────────────────────────────────────────

  function openFlag(itemId: string) {
    const targetScreen = state.shipment?.type === 'PRE-RETURN' ? 'condition' : 'missing'
    setState(s => ({ ...s, flaggingItemId: itemId, screen: targetScreen, direction: 'forward' }))
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

  // ── Review ──────────────────────────────────────────────────────────────────

  function goToReview() {
    goTo('review')
  }

  function confirmSubmit() {
    goTo('done')
  }

  function reset() {
    setState(INITIAL)
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  const { screen, direction, shipment, items, activeItemId, keypadValue, flaggingItemId } = state
  const screenKey = screen  // changing key re-mounts with animation

  const flaggingItem = items.find(i => i.id === flaggingItemId) ?? null

  return (
    <PhoneFrame>
      <div key={screenKey} className={direction === 'forward' ? 'screen-enter' : 'screen-enter-back'} style={{ height: '100%' }}>

        {screen === 'list' && (
          <ShipmentList
            shipments={SHIPMENTS}
            onSelect={selectShipment}
          />
        )}

        {screen === 'detail' && shipment && (
          <ShipmentDetail
            shipment={shipment}
            onBack={() => goTo('list', 'back')}
            onStart={startCounting}
          />
        )}

        {screen === 'counting' && shipment && (
          <CountingScreen
            shipment={shipment}
            items={items}
            activeItemId={activeItemId}
            keypadValue={keypadValue}
            onBack={() => goTo('detail', 'back')}
            onTapItem={openKeypad}
            onKeypadInput={keypadInput}
            onKeypadBackspace={keypadBackspace}
            onKeypadConfirm={keypadConfirm}
            onKeypadClose={closeKeypad}
            onFlag={openFlag}
            onReview={goToReview}
          />
        )}

        {screen === 'missing' && flaggingItem && (
          <MissingItems
            item={flaggingItem}
            onSave={(flag) => saveFlag(flaggingItem.id, flag)}
            onBack={closeFlag}
          />
        )}

        {screen === 'condition' && flaggingItem && (
          <ConditionCheck
            item={flaggingItem}
            onSave={(flag) => saveFlag(flaggingItem.id, flag)}
            onBack={closeFlag}
          />
        )}

        {screen === 'review' && shipment && (
          <ReviewScreen
            shipment={shipment}
            items={items}
            onBack={() => goTo('counting', 'back')}
            onConfirm={confirmSubmit}
          />
        )}

        {screen === 'done' && (
          <DoneScreen onReset={reset} />
        )}

      </div>
    </PhoneFrame>
  )
}

function DoneScreen({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-white px-8 text-center gap-6">
      <div className="w-20 h-20 rounded-full bg-[#DCFCE7] flex items-center justify-center">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <div>
        <p className="text-2xl font-semibold text-[#0A0A0A]" style={{ fontFamily: 'Switzer, sans-serif' }}>Count submitted</p>
        <p className="text-sm text-[#737373] mt-2" style={{ fontFamily: 'Switzer, sans-serif' }}>The office will review and confirm. Rent doesn't start until they approve.</p>
      </div>
      <button
        onClick={onReset}
        className="mt-4 px-6 py-3 rounded-xl bg-[#1E3FFF] text-white text-sm font-semibold"
        style={{ fontFamily: 'Switzer, sans-serif' }}
      >
        Back to shipments
      </button>
    </div>
  )
}

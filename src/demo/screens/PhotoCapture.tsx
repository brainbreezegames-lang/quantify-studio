import { useState } from 'react'
import { X, Check } from 'lucide-react'

interface Props {
  itemName: string
  shipmentId: string
  onClose: () => void
}

export default function PhotoCapture({ itemName, shipmentId, onClose }: Props) {
  const [captured, setCaptured] = useState(false)

  return (
    <div className="absolute inset-0 flex flex-col bg-black">
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3 bg-gradient-to-b from-black/70 to-transparent absolute top-0 left-0 right-0 z-10">
        <button onClick={onClose} className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center no-select pressable">
          <X size={18} color="#fff" strokeWidth={2} />
        </button>
        <div className="text-center">
          <p className="text-white text-sm font-semibold">Photo for</p>
          <p className="text-white/70 text-xs">{itemName} · {shipmentId}</p>
        </div>
        <div className="w-9" />
      </div>

      {/* Viewfinder */}
      <div className="flex-1 relative overflow-hidden">
        {!captured ? (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 30%, #0f3460 60%, #1a1a2e 100%)',
            }}
          >
            {/* Simulated yard/warehouse scene */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[#8B7355] to-transparent" />
              <div className="absolute bottom-1/3 left-1/4 w-16 h-24 bg-[#555] rounded-sm" style={{ transform: 'perspective(200px) rotateY(-10deg)' }} />
              <div className="absolute bottom-1/3 left-1/3 w-20 h-20 bg-[#666] rounded-sm" />
              <div className="absolute bottom-1/3 right-1/3 w-24 h-16 bg-[#444] rounded-sm" />
            </div>
            {/* Corner guides */}
            <div className="relative w-64 h-64">
              {['top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0'].map((pos, i) => (
                <div key={i} className={`absolute w-6 h-6 ${pos}`}>
                  <div className={`absolute ${i < 2 ? 'top-0' : 'bottom-0'} ${i % 2 === 0 ? 'left-0' : 'right-0'} w-5 h-0.5 bg-white`} />
                  <div className={`absolute ${i < 2 ? 'top-0' : 'bottom-0'} ${i % 2 === 0 ? 'left-0' : 'right-0'} w-0.5 h-5 bg-white`} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="w-full h-full bg-[#3D3D3D] flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3">
                <Check size={32} color="#fff" strokeWidth={2} />
              </div>
              <p className="text-white text-base font-semibold">Photo captured</p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom controls */}
      <div className="bg-gradient-to-t from-black to-transparent pt-8 pb-10 px-6">
        {/* Tags */}
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          {[shipmentId, itemName.split(' ').slice(0, 2).join(' '), 'Damaged'].map(tag => (
            <span key={tag} className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold">{tag}</span>
          ))}
        </div>

        {/* Controls */}
        {!captured ? (
          <div className="flex items-center justify-center gap-8">
            <div className="w-10 h-10" />
            {/* Shutter */}
            <button
              onClick={() => setCaptured(true)}
              className="rounded-full border-4 border-white flex items-center justify-center no-select pressable"
              style={{ width: 72, height: 72 }}
            >
              <div className="rounded-full bg-white" style={{ width: 56, height: 56 }} />
            </button>
            <div className="w-10 h-10" />
          </div>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={() => setCaptured(false)}
              className="flex-1 h-12 rounded-2xl bg-white/20 text-white text-sm font-semibold no-select pressable"
            >
              Retake
            </button>
            <button
              onClick={onClose}
              className="flex-1 h-12 rounded-2xl bg-white text-[#0A0A0A] text-sm font-semibold no-select pressable"
            >
              Use photo
            </button>
          </div>
        )}

        {!captured && (
          <p className="text-white/50 text-xs text-center mt-3">Tags auto-attached. Just tap.</p>
        )}
      </div>
    </div>
  )
}

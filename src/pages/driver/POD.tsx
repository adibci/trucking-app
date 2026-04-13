import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Camera, Upload, PenLine, CheckCircle, Package, X, Image } from 'lucide-react'

export default function POD() {
  const navigate = useNavigate()
  const [photos, setPhotos] = useState<string[]>([])
  const [signed, setSigned] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [receiverName, setReceiverName] = useState('')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [drawing, setDrawing] = useState(false)
  const [hasSignature, setHasSignature] = useState(false)

  const addPhoto = () => {
    setPhotos(p => [...p, `photo_${p.length + 1}`])
  }

  const startDraw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setDrawing(true)
    setHasSignature(true)
    const ctx = canvasRef.current?.getContext('2d')
    if (ctx) {
      const rect = canvasRef.current!.getBoundingClientRect()
      ctx.beginPath()
      ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top)
    }
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawing) return
    const ctx = canvasRef.current?.getContext('2d')
    if (ctx) {
      const rect = canvasRef.current!.getBoundingClientRect()
      ctx.lineWidth = 2
      ctx.strokeStyle = '#1A3C5E'
      ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top)
      ctx.stroke()
    }
  }

  const clearSig = () => {
    const ctx = canvasRef.current?.getContext('2d')
    if (ctx) {
      ctx.clearRect(0, 0, 300, 100)
      setHasSignature(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center py-8 px-4">
      <div className="w-[390px] bg-surface rounded-[44px] overflow-hidden shadow-2xl border border-black/10">
        {/* Status bar */}
        <div className="flex justify-between items-center px-8 py-4 bg-brand text-white text-xs font-mono">
          <span>9:41</span>
          <span>●●● WiFi ■</span>
        </div>

        {/* Header */}
        <div className="bg-brand px-6 py-4 flex items-center justify-between">
          <button onClick={() => navigate('/driver/active-job')} className="text-white/60"><ChevronLeft size={22} /></button>
          <div className="text-white font-semibold">Proof of Delivery</div>
          <div className="w-8" />
        </div>

        <div className="px-5 py-4 space-y-4 overflow-y-auto" style={{ maxHeight: 680 }}>
          {!submitted ? (
            <>
              {/* Order ref */}
              <div className="bg-white rounded-2xl border border-gray-100 p-3 flex items-center gap-3">
                <div className="w-8 h-8 bg-em-green-soft rounded-xl flex items-center justify-center">
                  <Package size={14} className="text-em-green" />
                </div>
                <div>
                  <div className="text-xs text-text3">Delivery</div>
                  <div className="text-sm font-bold text-text1">ORD-441 · Port Botany Terminal</div>
                </div>
                <div className="ml-auto text-xs text-em-green font-semibold">Arrived</div>
              </div>

              {/* Photos */}
              <div>
                <div className="text-xs font-semibold text-text2 uppercase tracking-wide mb-2">
                  Delivery Photos <span className="text-em-red">*</span>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {photos.map((p, i) => (
                    <div key={p} className="relative aspect-square bg-brand-light rounded-xl flex items-center justify-center overflow-hidden">
                      <Image size={20} className="text-brand-mid" />
                      <div className="absolute top-1 right-1">
                        <button
                          className="w-5 h-5 bg-em-red rounded-full flex items-center justify-center"
                          onClick={() => setPhotos(ps => ps.filter((_, j) => j !== i))}
                        >
                          <X size={10} className="text-white" />
                        </button>
                      </div>
                      <div className="absolute bottom-1 left-1 text-xs text-brand-mid/70 font-mono">Photo {i + 1}</div>
                    </div>
                  ))}
                  {photos.length < 6 && (
                    <button
                      onClick={addPhoto}
                      className="aspect-square border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-1 hover:border-brand/30"
                    >
                      <Camera size={18} className="text-text3" />
                      <span className="text-xs text-text3">Add Photo</span>
                    </button>
                  )}
                </div>
                <div className="text-xs text-text3">Take photos of cargo unloading, delivery area, and any damage if present</div>
              </div>

              {/* Receiver info */}
              <div>
                <div className="text-xs font-semibold text-text2 uppercase tracking-wide mb-2">
                  Receiver Information
                </div>
                <input
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm outline-none focus:border-brand-mid bg-white mb-2"
                  placeholder="Receiver's full name"
                  value={receiverName}
                  onChange={e => setReceiverName(e.target.value)}
                />
                <input
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm outline-none focus:border-brand-mid bg-white"
                  placeholder="Receiver's role / position"
                />
              </div>

              {/* Signature */}
              <div>
                <div className="text-xs font-semibold text-text2 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                  <PenLine size={13} />
                  Receiver Signature <span className="text-em-red">*</span>
                  <button onClick={clearSig} className="ml-auto text-xs text-em-red font-normal">Clear</button>
                </div>
                <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl overflow-hidden">
                  <canvas
                    ref={canvasRef}
                    width={350}
                    height={100}
                    className="w-full touch-none cursor-crosshair"
                    onMouseDown={startDraw}
                    onMouseMove={draw}
                    onMouseUp={() => setDrawing(false)}
                    onMouseLeave={() => setDrawing(false)}
                  />
                </div>
                {!hasSignature && (
                  <div className="text-xs text-text3 mt-1 text-center">Sign above using your finger or mouse</div>
                )}
              </div>

              {/* Notes */}
              <div>
                <label className="text-xs font-medium text-text2 mb-1.5 block">Delivery Notes</label>
                <textarea
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm outline-none focus:border-brand-mid resize-none bg-white"
                  rows={2}
                  placeholder="Any issues or notes..."
                />
              </div>

              <button
                className={`w-full py-4 rounded-2xl font-bold text-base shadow-lg transition-all ${
                  photos.length > 0 && hasSignature && receiverName
                    ? 'bg-brand text-white active:scale-95'
                    : 'bg-gray-100 text-text3 cursor-not-allowed'
                }`}
                onClick={() => {
                  if (photos.length > 0 && hasSignature && receiverName) {
                    setSubmitted(true)
                  }
                }}
              >
                Submit Proof of Delivery
              </button>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-em-green-soft rounded-3xl flex items-center justify-center mx-auto mb-5">
                <CheckCircle size={36} className="text-em-green" />
              </div>
              <h3 className="text-xl font-bold text-text1 mb-2">POD Submitted!</h3>
              <p className="text-text3 text-sm mb-1">ORD-441 delivery confirmed.</p>
              <p className="text-text3 text-sm mb-6">Invoice has been automatically generated.</p>

              <div className="bg-em-green-soft border border-em-green/20 rounded-2xl p-4 mb-5 text-left">
                <div className="text-xs text-text3 mb-1">Your earnings for this trip</div>
                <div className="text-3xl font-bold text-em-green font-mono">$185.00</div>
                <div className="text-xs text-text3 mt-1">Will be processed within 24 hours</div>
              </div>

              <div className="space-y-2">
                <button
                  className="w-full py-3.5 rounded-2xl bg-brand text-white font-bold"
                  onClick={() => navigate('/driver/home')}
                >
                  Back to Dashboard
                </button>
                <button className="w-full py-3.5 rounded-2xl border border-gray-200 text-text2 font-semibold">
                  <Upload size={14} className="inline mr-2" />
                  Download POD Receipt
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

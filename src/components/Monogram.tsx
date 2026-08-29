import { useRef, type PointerEvent as ReactPointerEvent } from 'react'

export function Monogram() {
  const signalRef = useRef<HTMLDivElement>(null)

  const updatePointer = (event: ReactPointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2
    signalRef.current?.style.setProperty('--signal-x', x.toFixed(3))
    signalRef.current?.style.setProperty('--signal-y', y.toFixed(3))
  }

  const resetPointer = () => {
    signalRef.current?.style.setProperty('--signal-x', '0')
    signalRef.current?.style.setProperty('--signal-y', '0')
  }

  return (
    <div className="identity-signal" ref={signalRef} onPointerMove={updatePointer} onPointerLeave={resetPointer} aria-hidden="true">
      <div className="identity-signal__current">
        <span className="identity-signal__ring identity-signal__ring--one" />
        <span className="identity-signal__ring identity-signal__ring--two" />
        <span className="identity-signal__ring identity-signal__ring--three" />
        <svg className="identity-signal__wave" viewBox="0 0 620 620">
          <path d="M4 357C101 247 181 437 285 313s186-69 331-151" />
          <path d="M3 382c110-93 190 74 290-51s188-62 324-130" />
        </svg>
      </div>

      <div className="identity-signal__portrait">
        <img src="/media/profile/pablo-schefer-avatar.webp" alt="" width="512" height="512" />
        <span className="identity-signal__portrait-shade" />
        <span className="identity-signal__scan" />
      </div>

      <span className="identity-signal__node identity-signal__node--community"><i />COMMUNITY</span>
      <span className="identity-signal__node identity-signal__node--code"><i />CODE</span>
      <span className="identity-signal__node identity-signal__node--product"><i />PRODUCT</span>
      <span className="identity-signal__node identity-signal__node--live"><i />LIVE</span>

      <div className="identity-signal__nameplate">
        <span>PS / 00</span>
        <strong>PAPI<span>GE</span>GAMER</strong>
        <small>COMMUNITY · PRODUCT · CODE</small>
      </div>
      <span className="identity-signal__coordinate">SPAIN / UTC+02</span>
    </div>
  )
}

import { useId } from 'react'

type Props = {
  active: number
  overdue: number
}

export function QueueIllustration({ active, overdue }: Props) {
  const id = useId()

  return (
    <div className="hero-art" aria-hidden="true">
      <svg className="orbit-art" viewBox="0 0 480 340" fill="none">
        <defs>
          <linearGradient id={`${id}-sage`} x1="140" y1="50" x2="355" y2="307" gradientUnits="userSpaceOnUse">
            <stop stopColor="#e0e9ce" /><stop offset="1" stopColor="#c8dbb8" />
          </linearGradient>
          <linearGradient id={`${id}-lilac`} x1="285" y1="30" x2="430" y2="213" gradientUnits="userSpaceOnUse">
            <stop stopColor="#e6e2ec" /><stop offset="1" stopColor="#f0e9df" />
          </linearGradient>
        </defs>
        <path d="M201 51C257 20 326 50 352 106c26 56 19 109-25 153-44 44-119 54-170 13-51-41-42-97-23-144 19-47 26-54 67-77Z" fill={`url(#${id}-sage)`} />
        <path d="M335 37c37-8 73 14 84 47s-2 76-35 92-65-5-81-36-5-95 32-103Z" fill={`url(#${id}-lilac)`} />
        <ellipse cx="243" cy="171" rx="185" ry="76" transform="rotate(-29 243 171)" stroke="#819b73" strokeOpacity=".6" strokeWidth="1" />
        <ellipse cx="243" cy="171" rx="153" ry="102" transform="rotate(32 243 171)" stroke="#819b73" strokeOpacity=".3" strokeWidth="1" />
        <path d="M89 224c40 31 102 17 157-22s113-92 111-138" stroke="#69865e" strokeOpacity=".45" strokeWidth="1" strokeDasharray="3 7" />
        <circle cx="90" cy="223" r="7" fill="#326548" />
        <circle cx="390" cy="99" r="5" fill="#b79879" />
        <circle cx="336" cy="276" r="4" fill="#8d85a2" />
        <path d="m148 47 3 10 10 3-10 3-3 10-3-10-10-3 10-3 3-10Z" fill="#7e9770" />
        <path d="m372 228 3 10 10 3-10 3-3 10-3-10-10-3 10-3 3-10Z" fill="#a69ab8" />
      </svg>
      <span className="art-lettering">Room for<br /><em>good work.</em></span>
      <div className="floating-note note-active">
        <span className="note-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="m6 12 4 4 8-8" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </span>
        <span><strong>{active} things in motion</strong><small>One focused step at a time</small></span>
      </div>
      <div className="floating-note note-attention">
        <span className="attention-dot" /><span>{overdue} need a little nudge</span>
      </div>
      <span className="art-date">THURSDAY, OCTOBER 29</span>
    </div>
  )
}

import { useEffect, useRef, useState } from 'react'
import { HomePage } from './components/HomePage.tsx'
import { QueueIllustration } from './components/QueueIllustration.tsx'
import { RequestForm } from './components/RequestForm.tsx'
import { RequestBoard } from './components/RequestBoard.tsx'
import { DEMO_NOW, DEMO_REQUESTS } from './data/requests.ts'
import { getDashboardStats } from './domain/triage.ts'
import type { Category, Priority, ServiceRequest } from './domain/types.ts'
import './App.css'

function App() {
  const [hash, setHash] = useState(() => window.location.hash)
  const isHomePage = hash !== '#overview' && hash !== '#requests'
  const [requests, setRequests] = useState<ServiceRequest[]>([...DEMO_REQUESTS])
  const [isFormOpen, setFormOpen] = useState(false)
  const [announcement, setAnnouncement] = useState('')
  const nextId = useRef(1050)
  const newRequestButton = useRef<HTMLButtonElement>(null)
  const stats = getDashboardStats(requests, DEMO_NOW)

  useEffect(() => {
    function onHashChange() {
      setHash(window.location.hash)
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  useEffect(() => {
    document.title = isHomePage ? 'ServiceDesk Lite | Meet your workspace' : 'ServiceDesk Lite | Workspace'
    const target = document.getElementById(hash.slice(1) || 'home')
    if (!hash || hash === '#home' || hash === '#overview') {
      window.scrollTo({ top: 0, left: 0 })
    } else {
      target?.scrollIntoView({ block: 'start' })
    }
    target?.focus({ preventScroll: true })
  }, [hash, isHomePage])

  function closeForm() {
    setFormOpen(false)
    newRequestButton.current?.focus()
  }

  function addRequest(title: string, category: Category, priority: Priority) {
    const id = `SR-${nextId.current++}`
    setRequests((current) => [
      ...current,
      { id, title, category, priority, status: 'open', createdAt: DEMO_NOW.toISOString() },
    ])
    setAnnouncement(`${id} created. Changes last until you reload or reset the demo.`)
    closeForm()
  }

  function advanceRequest(id: string) {
    const request = requests.find((item) => item.id === id)
    if (!request) throw new Error(`Request ${id} was not found.`)
    const nextStatus = request.status === 'open' ? 'in-progress' : 'resolved'
    setRequests((current) =>
      current.map((item) => item.id === id ? { ...item, status: nextStatus } : item),
    )
    setAnnouncement(`${id} marked ${nextStatus === 'resolved' ? 'resolved' : 'in progress'}.`)
  }

  function resetDemo() {
    setRequests([...DEMO_REQUESTS])
    nextId.current = 1050
    setFormOpen(false)
    setAnnouncement('Demo data reset. All eight synthetic requests have been restored.')
  }

  return (
    <div className="app-shell">
      <a className="skip-link" href={isHomePage ? '#home' : '#overview'}>Skip to content</a>
      <header className="site-header">
        <a className="brand" href="#home" aria-label="ServiceDesk Lite home">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 32 32" fill="none">
              <path d="M22 9h-8a5 5 0 0 0 0 10h4a5 5 0 0 1 0 10" transform="translate(0 -3)" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              <circle cx="23" cy="23" r="2" fill="currentColor" />
            </svg>
          </span>
          <span>servicedesk<span className="brand-lite">lite</span></span>
        </a>
        <nav aria-label="Workspace navigation">
          <a className="nav-link" href="#home" aria-current={isHomePage ? 'page' : undefined}>Home</a>
          <a className="nav-link" href="#overview" aria-current={!isHomePage && hash !== '#requests' ? 'page' : undefined}>Workspace</a>
          <a className="nav-link" href="#requests" aria-current={hash === '#requests' ? 'location' : undefined}>
            The queue <span className="nav-count">{stats.active}</span>
          </a>
        </nav>
        <div className="header-actions">
          <span className="environment-badge"><span className="live-dot" /> Local demo</span>
          {isHomePage ? <a className="button header-workspace-link" href="#overview">Open workspace <span aria-hidden="true">&rarr;</span></a> : <button className="reset-button" onClick={resetDemo} aria-label="Reset demo data">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <path d="M4 10a8 8 0 1 1 1.4 7M4 4v6h6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Reset data</span>
          </button>
          }
          <span className="workspace-avatar" aria-label="Demo workspace">sd</span>
        </div>
      </header>

      <main id="main">
        {isHomePage && <HomePage active={stats.active} overdue={stats.overdue} />}
        <div className="main-content" id="overview" hidden={isHomePage} tabIndex={-1}>
          <section className="page-heading" aria-labelledby="page-title">
            <div className="hero-copy">
              <p className="eyebrow"><span /> A LITTLE CLARITY GOES A LONG WAY</p>
              <h1 id="page-title">Less noise.<br /><span>More flow.</span></h1>
              <p className="page-description">A thoughtful space for your team's everyday requests.<br className="desktop-break" /> Find your focus. Move the right work forward.</p>
              <div className="heading-actions">
                <button
                  className="button button-primary"
                  ref={newRequestButton}
                  onClick={() => setFormOpen((open) => !open)}
                  aria-expanded={isFormOpen}
                  aria-controls="new-request-panel"
                >
                  <span className="button-plus" aria-hidden="true">+</span> New request
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                    <path d="M5 12h14m-6-6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <span className="hero-caption">Clear priorities.<br />Calmer handoffs.</span>
              </div>
            </div>
            <QueueIllustration active={stats.active} overdue={stats.overdue} />
          </section>

          <section className="stats-grid" aria-label="Queue summary">
            <div className="stat-card">
              <span>Active requests</span><strong>{stats.active.toString().padStart(2, '0')}</strong>
              <p><span className="stat-dot teal" /> Ready for the next step</p>
            </div>
            <div className="stat-card stat-card-alert">
              <span>Past SLA</span><strong>{stats.overdue.toString().padStart(2, '0')}</strong>
              <p><span className="stat-dot coral" /> Needs a closer look</p>
            </div>
            <div className="stat-card">
              <span>Critical priority</span><strong>{stats.critical.toString().padStart(2, '0')}</strong>
              <p><span className="stat-dot amber" /> High-impact, active work</p>
            </div>
            <div className="stat-card">
              <span>Resolved</span><strong>{stats.resolved.toString().padStart(2, '0')}</strong>
              <p><span className="stat-dot slate" /> A little less on the list</p>
            </div>
          </section>

          <div className="clock-note">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />
            </svg>
            <span><strong>A moment, held still.</strong> Demo clock: Oct 29, 2026, 14:00 UTC.</span>
            <span className="clock-divider" />
            <span>Synthetic data. In-memory changes only.</span>
          </div>

          {isFormOpen && <RequestForm onCreate={addRequest} onCancel={closeForm} />}
          <p className="announcement" role="status">{announcement}</p>

          <RequestBoard requests={requests} now={DEMO_NOW} onAdvance={advanceRequest} />

          <section className="workflow-note" aria-labelledby="workflow-title">
            <div className="workflow-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                <path d="m8 7-5 5 5 5m8-10 5 5-5 5m-3-13-2 16" />
              </svg>
            </div>
            <div>
              <h2 id="workflow-title">A little help. Always your call.</h2>
              <p>Explore, build, and review with a little less friction. Copilot assists; you review and approve.</p>
            </div>
            <span className="workflow-tag"><span className="live-dot" /> YOUR COPILOT DEMO LAB</span>
          </section>
          <footer className="page-footer">
            <span>ServiceDesk Lite / Demo lab</span>
            <span>Sample SLA targets: P1 1h / P2 4h / P3 24h / P4 72h. Not an operational policy.</span>
          </footer>
        </div>
      </main>
    </div>
  )
}

export default App

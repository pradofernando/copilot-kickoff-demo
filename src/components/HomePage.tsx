import { DEMO_REQUESTS } from '../data/requests.ts'
import { SLA_HOURS } from '../domain/triage.ts'
import { CATEGORIES, PRIORITY_OPTIONS, SORT_OPTIONS, isSortOrder } from '../domain/types.ts'
import type { Category, Priority } from '../domain/types.ts'
import { QueueIllustration } from './QueueIllustration.tsx'
import './HomePage.css'

type Props = {
  active: number
  overdue: number
}

const CATEGORY_DESCRIPTIONS: Record<Category, string> = {
  Access: 'Workspaces, shared folders, and permissions.',
  Hardware: 'Laptops, docks, and shared devices.',
  Software: 'Build tools and everyday applications.',
  Network: 'VPN connections and network access.',
}

const PRIORITY_DESCRIPTIONS: Record<Priority, string> = {
  critical: 'High-impact work that needs the earliest attention.',
  high: 'Important work with a shorter turnaround.',
  normal: 'Everyday requests with a little more breathing room.',
  low: 'Lower-urgency improvements and maintenance.',
}

const TRACKED_FIELDS = [
  { name: 'Request ID', example: 'SR-1043', source: 'Recorded', why: 'A unique reference so you can find the same piece of work without relying on its title.' },
  { name: 'Request title', example: 'Recover the nightly build runner', source: 'Recorded', why: 'A short description of the work needed. It answers what the request is about and makes the queue searchable.' },
  { name: 'Category', example: 'Software', source: 'Recorded', why: 'Groups the type of work: Access, Hardware, Software, or Network. It provides context and another way to search.' },
  { name: 'Priority', example: 'P2 / High', source: 'Recorded', why: 'Captures the urgency you select. It drives priority sorting and determines its sample SLA time window.' },
  { name: 'Current status', example: 'In progress', source: 'Recorded', why: 'Shows whether work is still Open, has been started, or is Resolved. It keeps active and completed work distinct.' },
  { name: 'Creation time', example: 'Oct 29, 10:00 UTC', source: 'Recorded', why: 'Marks when a request entered the queue. It anchors newest-first ordering and the SLA calculation.' },
  { name: 'SLA deadline', example: 'Oct 29, 14:00 UTC', source: 'Calculated', why: 'Creation time plus the priority time window. It gives the app a clear point at which active work becomes overdue.' },
  { name: 'SLA status & time remaining', example: 'Overdue at 14:00 UTC', source: 'Calculated', why: 'Compares the deadline with the reference clock, making time-sensitive work visible without changing its selected priority.' },
]

const DEMO_STEPS = [
  { title: 'Understand the code', text: 'Use Ask, file context, inline suggestions, or the CLI to get oriented.' },
  { title: 'Compare the trade-offs', text: 'Ask two models how priority-based and deadline-based sorting differ.' },
  { title: 'Shape a pull request', text: 'Explain a small change, draft its summary, and review the test evidence.' },
  { title: 'Catch a real logic bug', text: 'Review an exact-deadline regression and verify the finding with a failing test.' },
  { title: 'Make good habits reusable', text: 'Explore repository instructions, the test-writer agent, and the triage skill.' },
  { title: 'Keep a human in the loop', text: 'Inspect the diff, run the checks, and decide what is ready to merge.' },
]

export function HomePage({ active, overdue }: Props) {
  return (
    <div className="main-content home-page" id="home" tabIndex={-1}>
      <section className="page-heading home-hero" aria-labelledby="home-title">
        <div className="hero-copy">
          <p className="eyebrow"><span /> SERVICE REQUEST TRACKING, MADE CLEAR</p>
          <h1 id="home-title">A clear queue.<br /><span>A calmer team.</span></h1>
          <p className="page-description">
            Track everyday support work, from VPN problems and laptop setup to
            software issues and access requests. See what is open, what needs
            attention next, and what has been resolved.
          </p>
          <div className="home-hero-actions">
            <a className="button button-primary" href="#overview">
              Explore the workspace <span aria-hidden="true">&rarr;</span>
            </a>
            <a className="home-text-link" href="#how-it-works">See how it works <span aria-hidden="true">&darr;</span></a>
          </div>
          <p className="home-hero-note"><span className="live-dot" /> A working demo. Entirely synthetic data.</p>
        </div>
        <QueueIllustration active={active} overdue={overdue} />
      </section>

      <dl className="home-facts" aria-label="About this demo">
        <div><dt>Ready to explore</dt><dd>{DEMO_REQUESTS.length} <span>starter requests</span></dd></div>
        <div><dt>A little perspective</dt><dd>{PRIORITY_OPTIONS.length} <span>priority levels</span></dd></div>
        <div><dt>Nothing to connect</dt><dd>0 <span>backends or API keys</span></dd></div>
      </dl>

      <nav className="home-section-nav" aria-label="On this page">
        <span>TAKE A CLOSER LOOK</span>
        <a href="#what-we-track">What's tracked</a>
        <a href="#why-it-matters">Why it matters</a>
        <a href="#how-it-works">The workflow</a>
        <a href="#capabilities">What you can do</a>
        <a href="#priorities">Priorities &amp; SLA</a>
        <a href="#demo-lab">The demo lab</a>
        <a href="#questions">Good to know</a>
      </nav>

      <section className="home-section home-introduction" aria-labelledby="introduction-title">
        <div>
          <p className="eyebrow">THE SHORT VERSION</p>
          <h2 id="introduction-title">One place for the work<br /><em>between the work.</em></h2>
        </div>
        <div className="home-prose">
          <p>
            A laptop needs a dock. A teammate needs folder access. The VPN stops
            connecting. Small requests add up, and the hardest part is often
            knowing what to tackle next.
          </p>
          <p>
            ServiceDesk Lite is a service-request tracker, not a chat app, asset
            inventory, or people tracker. It models how an internal support team
            brings those pieces of work into one searchable queue.
            Each has an ID, a short title, a category, a priority, a status, and a
            creation time. The app turns that information into clear next steps
            and a live summary of the queue.
          </p>
          <ul className="home-category-list" aria-label="Request categories">
            {CATEGORIES.map((category) => (
              <li key={category}>
                <span className={`request-symbol symbol-${category.toLowerCase()}`} aria-hidden="true">{category.slice(0, 1)}</span>
                <span><strong>{category}</strong><span>{CATEGORY_DESCRIPTIONS[category]}</span></span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="home-section home-tracking-section" id="what-we-track" tabIndex={-1} aria-labelledby="tracking-title">
        <div className="home-section-heading">
          <p className="eyebrow">WHAT ACTUALLY GETS TRACKED</p>
          <h2 id="tracking-title">Six facts about the work.<br /><em>Two useful signals.</em></h2>
          <p>Each request records six fields in memory. The app calculates its deadline
            and SLA status from those fields; they are not extra information you
            need to enter. Here is an example using the starter request SR-1043.</p>
        </div>
        <dl className="home-field-list">
          {TRACKED_FIELDS.map((field) => (
            <div className="home-field-row" key={field.name}>
              <dt><strong>{field.name}</strong><span>{field.source}</span></dt>
              <dd><span className="home-field-example">{field.example}</span><p>{field.why}</p></dd>
            </div>
          ))}
        </dl>
        <p className="home-tracking-note">This is a starter-record example, not a live audit log.
          Status changes update the current record; the app does not record who changed
          it, when it was resolved, or a full history of edits.</p>
      </section>

      <section className="home-section home-purpose-section" id="why-it-matters" tabIndex={-1} aria-labelledby="purpose-title">
        <div className="home-section-heading">
          <p className="eyebrow">WHY KEEP TRACK OF ALL THIS?</p>
          <h2 id="purpose-title">Less guessing.<br /><em>Better next steps.</em></h2>
          <p>The point is not to collect more data. It is to make three everyday
            decisions easier: what still needs doing, what should come next, and what is done.</p>
        </div>
        <ol className="home-outcomes">
          <li><span>01</span><div><h3>Keep requests from disappearing.</h3>
            <p>A visible queue is easier to revisit than scattered messages.
              IDs, titles, categories, and the Active view make unfinished work easy to find.</p></div></li>
          <li><span>02</span><div><h3>Separate urgent work from recent work.</h3>
            <p>The newest request is not always the most important. Priority and
              SLA indicators help you distinguish urgency from age and spot work that needs follow-up.</p></div></li>
          <li><span>03</span><div><h3>See progress without a status meeting.</h3>
            <p>Open, In progress, and Resolved tell you where each request stands.
              The summary shows the current workload and completed items, not individual productivity or historical trends.</p></div></li>
        </ol>
      </section>

      <section className="home-section" id="how-it-works" tabIndex={-1} aria-labelledby="how-title">
        <div className="home-section-heading">
          <p className="eyebrow">A SIMPLE LITTLE RHYTHM</p>
          <h2 id="how-title">From a request to <em>a little relief.</em></h2>
          <p>Three steps. No complicated setup, hidden handoffs, or sprawling forms.</p>
        </div>
        <ol className="home-steps">
          <li>
            <span className="home-step-number">01</span>
            <h3>Capture what is needed.</h3>
            <p>Create a request with a clear 6-120 character title, choose its
              category, and select a priority. The app gives it an ID and adds it to the queue.</p>
          </li>
          <li>
            <span className="home-step-number">02</span>
            <h3>Find the right next thing.</h3>
            <p>Search, filter, and sort the queue. Read the SLA indicators alongside
              priority to understand both urgency and the time remaining.</p>
          </li>
          <li>
            <span className="home-step-number">03</span>
            <h3>Keep the work moving.</h3>
            <p>Choose Start work to move an Open request to In progress, then
              Resolve when it is done. The summary updates immediately.</p>
          </li>
        </ol>
      </section>

      <section className="home-section home-capabilities-section" id="capabilities" tabIndex={-1} aria-labelledby="capabilities-title">
        <div className="home-section-heading">
          <p className="eyebrow">SMALL DETAILS. LESS FRICTION.</p>
          <h2 id="capabilities-title">Everything you need to <em>find your focus.</em></h2>
        </div>
        <div className="home-capabilities">
          <article>
            <span className="home-feature-label">01 / FIND IT</span>
            <h3>A queue you can actually navigate.</h3>
            <p>Search by request ID, title, or category. Searches ignore case and
              surrounding spaces. Switch between Active, All requests, and Resolved
              to choose how much of the story you want to see.</p>
          </article>
          <article>
            <span className="home-feature-label">02 / ORDER IT</span>
            <h3>More than one way to see the work.</h3>
            <p>The available sort options are {SORT_OPTIONS.map((option) => option.label).join(', ')}.
              Newest starts with the most recently created request. Priority starts
              with the most urgent level, then older work. Stable ID tie-breaks
              keep the order predictable.</p>
          </article>
          <article>
            <span className="home-feature-label">03 / UNDERSTAND IT</span>
            <h3>The big picture, without the noise.</h3>
            <p>Four summary numbers reflect the whole queue, not just your current
              search. Active counts Open and In progress work; Past SLA counts overdue
              active work; Critical priority counts active P1 requests; Resolved counts completed work.</p>
          </article>
          <article>
            <span className="home-feature-label">04 / TRY IT</span>
            <h3>Room to explore. An easy way back.</h3>
            <p>Create a synthetic request, change its status, and watch the totals
              respond. Your work stays in memory as you move between Home and Workspace.
              Reset data or reload the browser to restore the starter requests.</p>
          </article>
        </div>
      </section>

      <section className="home-section home-sla-section" id="priorities" tabIndex={-1} aria-labelledby="sla-title">
        <div className="home-sla-intro">
          <p className="eyebrow">TWO SIGNALS. A CLEARER DECISION.</p>
          <h2 id="sla-title">Priority is urgency.<br /><em>SLA is the clock.</em></h2>
          <p>A service-level agreement (SLA) defines a time target. Here, each
            priority has a sample window measured from the request's creation time.
            Starting work does not restart that clock.</p>
          <p>These are teaching examples, not your team's real service commitments.</p>
        </div>
        <dl className="home-priorities" aria-label="Sample SLA targets">
          {PRIORITY_OPTIONS.map((option) => (
            <div className="home-priority-row" key={option.value}>
              <dt><span className={`priority-badge priority-${option.value}`}>{option.label}</span></dt>
              <dd>
                <strong>{SLA_HOURS[option.value]} {SLA_HOURS[option.value] === 1 ? 'hour' : 'hours'}</strong>
                <span>{PRIORITY_DESCRIPTIONS[option.value]}</span>
              </dd>
            </div>
          ))}
        </dl>
        <div className="home-sla-signals">
          <div><span className="home-signal signal-overdue" /><strong>Overdue</strong><p>At or past the deadline.</p></div>
          <div><span className="home-signal signal-soon" /><strong>Due soon</strong><p>More than zero and up to one hour left.</p></div>
          <div><span className="home-signal signal-track" /><strong>On track</strong><p>More than one hour remaining.</p></div>
          <div><span className="home-signal signal-resolved" /><strong>Resolved</strong><p>Done, and excluded from active SLA totals.</p></div>
        </div>
      </section>

      <aside className="home-boundary-example" aria-labelledby="example-title">
        <span className="home-example-mark" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><circle cx="12" cy="12" r="9" /><path d="M12 6v6l4 2" strokeLinecap="round" /></svg>
        </span>
        <div>
          <p className="eyebrow">ONE DETAIL WORTH NOTICING</p>
          <h3 id="example-title">Exactly on the deadline still means overdue.</h3>
          <p>A high-priority request created at 10:00 UTC has a four-hour target.
            At 14:00 UTC it is overdue, not due soon. The fixed demo clock makes
            this boundary easy to see, test, and explain.</p>
        </div>
      </aside>

      <section className="home-section home-demo-section" id="demo-lab" tabIndex={-1} aria-labelledby="demo-title">
        <div className="home-demo-intro">
          <p className="eyebrow">A SMALL APP. A BIGGER LEARNING STORY.</p>
          <h2 id="demo-title">Built to explore.<br /><em>And to explain.</em></h2>
          <p>This repo is a hands-on GitHub Copilot lab for presentation slides 9-14.
            The app stays deliberately small so the development workflow can take center stage.</p>
          <p>The website itself does not call an AI model. The Copilot demonstrations
            happen in your editor, terminal, and GitHub, with the appropriate account access.</p>
          <a className="home-text-link" href="#overview">Meet your demo workspace <span aria-hidden="true">&rarr;</span></a>
        </div>
        <ol className="home-demo-steps">
          {DEMO_STEPS.map((step, index) => (
            <li key={step.title}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <div><h3>{step.title}</h3><p>{step.text}</p></div>
            </li>
          ))}
        </ol>
      </section>

      <section className="home-section home-questions" id="questions" tabIndex={-1} aria-labelledby="questions-title">
        <div>
          <p className="eyebrow">BEFORE YOU DIVE IN</p>
          <h2 id="questions-title">A few things<br /><em>good to know.</em></h2>
          <p>Clear expectations make for a calmer demo.</p>
        </div>
        <div className="home-faq-list">
          <details>
            <summary>Is this connected to real systems?<span aria-hidden="true">+</span></summary>
            <p>No. The app uses synthetic requests and needs no backend, database,
              sign-in, API keys, or cloud subscription. Do not enter real or sensitive
              information. Copilot and GitHub features separately require their supported service access.</p>
          </details>
          <details>
            <summary>What happens to the changes I make?<span aria-hidden="true">+</span></summary>
            <p>Requests and statuses stay in this browser session's memory, including
              when you visit Home and come back. Nothing is saved to a server or browser
              storage. Reloading or choosing Reset data restores all eight starter requests.</p>
          </details>
          <details>
            <summary>Why does the clock stay still?<span aria-hidden="true">+</span></summary>
            <p>The reference time is fixed at October 29, 2026, 14:00 UTC.
              Rehearsals stay repeatable, SLA labels do not drift mid-presentation,
              and boundary tests do not depend on the machine's current time.</p>
          </details>
          <details>
            <summary>Can I sort by the SLA deadline?<span aria-hidden="true">+</span></summary>
            <p>{isSortOrder('sla')
              ? 'Yes. This demo currently includes SLA deadline first: active work before resolved requests, earlier deadlines first, with deterministic tie-breaks.'
              : 'The baseline offers newest and priority sorting. The repo also includes a prepared SLA-first sorting feature for the pull-request demo; it is not enabled in the baseline workspace.'}</p>
          </details>
          <details>
            <summary>What does this app deliberately not track?<span aria-hidden="true">+</span></summary>
            <p>It does not collect requester identities or contact details, assign
              work to people, track employee performance, manage an asset inventory,
              or store comments, attachments, and an audit history. It also does not
              send reminders, escalate requests, or synchronize with a real ticketing system.
              The counters are a snapshot of the current demo queue, not a report of
              resolution times or support-team performance.</p>
          </details>
          <details>
            <summary>Is this ready for production?<span aria-hidden="true">+</span></summary>
            <p>No. It is a teaching starter, not a real service desk. It intentionally
              omits authentication, durable storage, external integrations, and operational
              controls. The sample SLA targets are not an organizational policy.</p>
          </details>
        </div>
      </section>

      <section className="home-closing" aria-labelledby="closing-title">
        <div><p className="eyebrow">YOUR NEXT STEP IS A SMALL ONE</p><h2 id="closing-title">A little more clarity <em>starts here.</em></h2>
          <p>Open the queue. Try a request. Make a little room for good work.</p></div>
        <a className="button button-primary" href="#overview">Open the workspace <span aria-hidden="true">&rarr;</span></a>
      </section>
      <footer className="page-footer home-footer">
        <span>ServiceDesk Lite / Synthetic data, thoughtful workflows.</span>
        <span>Copilot assists; you review and approve.</span>
        <a href="#home">Back to top <span aria-hidden="true">&uarr;</span></a>
      </footer>
    </div>
  )
}

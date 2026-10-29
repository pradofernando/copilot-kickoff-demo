import { useState } from 'react'
import { filterRequests, getSlaLabel, getSlaStatus, sortRequests } from '../domain/triage.ts'
import { isSortOrder, PRIORITY_OPTIONS, SORT_OPTIONS } from '../domain/types.ts'
import type { RequestStatus, RequestView, ServiceRequest, SortOrder } from '../domain/types.ts'

type Props = {
  requests: readonly ServiceRequest[]
  now: Date
  onAdvance: (id: string) => void
}

const STATUS_LABELS: Record<RequestStatus, string> = {
  open: 'Open',
  'in-progress': 'In progress',
  resolved: 'Resolved',
}

const VIEWS: readonly { value: RequestView; label: string }[] = [
  { value: 'active', label: 'Active' },
  { value: 'all', label: 'All requests' },
  { value: 'resolved', label: 'Resolved' },
]

export function RequestBoard({ requests, now, onAdvance }: Props) {
  const [query, setQuery] = useState('')
  const [view, setView] = useState<RequestView>('active')
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest')
  const visibleRequests = sortRequests(filterRequests(requests, query, view), sortOrder)

  return (
    <section className="board" id="requests" aria-labelledby="queue-title">
      <div className="board-heading">
        <div><p className="eyebrow">MAKE SPACE FOR WHAT MATTERS</p>
          <h2 id="queue-title">Your team's rhythm <span className="count-pill">{requests.length}</span></h2>
        </div>
        <span className="board-label">One queue. A little more headspace.</span>
      </div>
      <div className="board-toolbar">
        <div className="view-tabs" role="group" aria-label="Request view">
          {VIEWS.map((option) => (
            <button key={option.value} aria-pressed={view === option.value} onClick={() => setView(option.value)}>
              {option.label}
            </button>
          ))}
        </div>
        <div className="board-controls">
          <label className="search-field">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 4 4" />
            </svg>
            <input aria-label="Search requests" type="search" placeholder="Search requests..." value={query} onChange={(event) => setQuery(event.currentTarget.value)} />
          </label>
          <label className="sort-field">
            <span className="visually-hidden">Sort requests</span>
            <select
              value={sortOrder}
              onChange={(event) => {
                const value = event.currentTarget.value
                if (!isSortOrder(value)) throw new Error(`Unknown sort order: ${value}`)
                setSortOrder(value)
              }}
            >
              {SORT_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </label>
        </div>
      </div>
      <div className="table-scroll">
        <table>
          <caption className="visually-hidden">Synthetic service requests and their SLA status</caption>
          <thead><tr><th scope="col">REQUEST</th><th scope="col">PRIORITY</th><th scope="col">STATUS</th><th scope="col">SLA TARGET</th><th scope="col"><span className="visually-hidden">Action</span></th></tr></thead>
          <tbody>
            {visibleRequests.map((request) => {
              const slaStatus = getSlaStatus(request, now)
              const priority = PRIORITY_OPTIONS.find((option) => option.value === request.priority)
              if (!priority) throw new Error(`Unknown priority for ${request.id}.`)
              return (
                <tr key={request.id}>
                  <th scope="row">
                    <div className="request-identity">
                      <span className={`request-symbol symbol-${request.category.toLowerCase()}`} aria-hidden="true">{request.category.slice(0, 1)}</span>
                      <div>
                        <span className="request-title">{request.title}</span>
                        <span className="request-meta">{request.id}<span aria-hidden="true"> / </span>{request.category}</span>
                      </div>
                    </div>
                  </th>
                  <td><span className={`priority-badge priority-${request.priority}`}><span className="priority-dot" />{priority.label}</span></td>
                  <td><span className={`status-badge status-${request.status}`}><span className="status-dot" />{STATUS_LABELS[request.status]}</span></td>
                  <td><span className={`sla-label sla-${slaStatus}`}>{getSlaLabel(request, now)}</span></td>
                  <td className="action-cell">
                    {request.status === 'resolved' ? <span className="completed-mark">Done</span> : (
                      <button className="row-action" aria-label={`${request.status === 'open' ? 'Start' : 'Resolve'} ${request.id}`} onClick={() => onAdvance(request.id)}>
                        {request.status === 'open' ? 'Start work' : 'Resolve'} <span aria-hidden="true">&rarr;</span>
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {visibleRequests.length === 0 && (
          <div className="empty-state"><strong>A little breathing room.</strong><p>No requests match this view. Try another search or filter.</p></div>
        )}
      </div>
      <div className="board-footer"><span role="status">{visibleRequests.length} {visibleRequests.length === 1 ? 'request' : 'requests'} in this view</span><span>Made for a focused demo, not production use.</span></div>
    </section>
  )
}

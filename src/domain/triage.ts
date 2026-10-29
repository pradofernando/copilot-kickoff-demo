import type {
  Priority,
  RequestView,
  ServiceRequest,
  SlaStatus,
  SortOrder,
} from './types.ts'

const HOUR_MS = 60 * 60 * 1000
const SLA_HOURS: Record<Priority, number> = { critical: 1, high: 4, normal: 24, low: 72 }
const PRIORITY_RANK: Record<Priority, number> = { critical: 4, high: 3, normal: 2, low: 1 }

export function getDeadline(request: ServiceRequest): number {
  const createdAt = Date.parse(request.createdAt)
  if (!Number.isFinite(createdAt)) throw new RangeError(`Invalid createdAt for ${request.id}.`)
  return createdAt + SLA_HOURS[request.priority] * HOUR_MS
}

export function getSlaStatus(request: ServiceRequest, now: Date): SlaStatus {
  if (!Number.isFinite(now.getTime())) throw new RangeError('The SLA clock must be a valid date.')
  if (request.status === 'resolved') return 'resolved'
  const deadline = getDeadline(request)
  if (deadline <= now.getTime()) return 'overdue'
  if (deadline - now.getTime() <= HOUR_MS) return 'due-soon'
  return 'on-track'
}

export function getSlaLabel(request: ServiceRequest, now: Date): string {
  const status = getSlaStatus(request, now)
  if (status === 'resolved') return 'Completed'
  const difference = getDeadline(request) - now.getTime()
  if (difference === 0) return 'Overdue now'
  const minutes = Math.ceil(Math.abs(difference) / 60_000)
  const duration = minutes >= 60 ? `${Math.ceil(minutes / 60)}h` : `${minutes}m`
  return status === 'overdue' ? `${duration} overdue` : `Due in ${duration}`
}

export function filterRequests(
  requests: readonly ServiceRequest[],
  query: string,
  view: RequestView,
): ServiceRequest[] {
  const search = query.trim().toLowerCase()
  return requests.filter((request) => {
    const matchesView = view === 'all'
      || (view === 'resolved' ? request.status === 'resolved' : request.status !== 'resolved')
    return matchesView
      && `${request.id} ${request.title} ${request.category}`.toLowerCase().includes(search)
  })
}

export function sortRequests(
  requests: readonly ServiceRequest[],
  sortOrder: SortOrder,
): ServiceRequest[] {
  return [...requests].sort((left, right) => {
    if (sortOrder === 'priority') {
      return PRIORITY_RANK[right.priority] - PRIORITY_RANK[left.priority]
        || Date.parse(left.createdAt) - Date.parse(right.createdAt)
        || left.id.localeCompare(right.id)
    }
    return Date.parse(right.createdAt) - Date.parse(left.createdAt)
      || left.id.localeCompare(right.id)
  })
}

export function getDashboardStats(requests: readonly ServiceRequest[], now: Date) {
  return {
    active: requests.filter((request) => request.status !== 'resolved').length,
    overdue: requests.filter((request) => getSlaStatus(request, now) === 'overdue').length,
    critical: requests.filter((request) =>
      request.priority === 'critical' && request.status !== 'resolved',
    ).length,
    resolved: requests.filter((request) => request.status === 'resolved').length,
  }
}

export function validateRequestTitle(title: string): string | null {
  const length = title.trim().length
  if (length < 6) return 'Use at least 6 characters to describe the request.'
  if (length > 120) return 'Keep the request title to 120 characters or fewer.'
  return null
}

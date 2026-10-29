export const PRIORITY_OPTIONS = [
  { value: 'critical', label: 'P1 / Critical' },
  { value: 'high', label: 'P2 / High' },
  { value: 'normal', label: 'P3 / Normal' },
  { value: 'low', label: 'P4 / Low' },
] as const

export const CATEGORIES = ['Access', 'Hardware', 'Software', 'Network'] as const

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'priority', label: 'Priority first' },
] as const

export type Priority = (typeof PRIORITY_OPTIONS)[number]['value']
export type Category = (typeof CATEGORIES)[number]
export type SortOrder = (typeof SORT_OPTIONS)[number]['value']
export type RequestStatus = 'open' | 'in-progress' | 'resolved'
export type RequestView = 'active' | 'all' | 'resolved'
export type SlaStatus = 'overdue' | 'due-soon' | 'on-track' | 'resolved'

export type ServiceRequest = Readonly<{
  id: string
  title: string
  category: Category
  priority: Priority
  status: RequestStatus
  createdAt: string
}>

export function isPriority(value: string): value is Priority {
  return PRIORITY_OPTIONS.some((option) => option.value === value)
}

export function isCategory(value: string): value is Category {
  return CATEGORIES.some((category) => category === value)
}

export function isSortOrder(value: string): value is SortOrder {
  return SORT_OPTIONS.some((option) => option.value === value)
}

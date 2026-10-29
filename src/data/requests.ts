import type { ServiceRequest } from '../domain/types.ts'

export const DEMO_NOW = new Date('2026-10-29T14:00:00.000Z')

export const DEMO_REQUESTS: readonly ServiceRequest[] = [
  {
    id: 'SR-1042',
    title: 'Restore shared network access',
    category: 'Network',
    priority: 'critical',
    status: 'open',
    createdAt: '2026-10-29T09:00:00.000Z',
  },
  {
    id: 'SR-1043',
    title: 'Recover the nightly build runner',
    category: 'Software',
    priority: 'high',
    status: 'in-progress',
    createdAt: '2026-10-29T10:00:00.000Z',
  },
  {
    id: 'SR-1044',
    title: 'Connect a replacement laptop dock',
    category: 'Hardware',
    priority: 'high',
    status: 'open',
    createdAt: '2026-10-29T12:30:00.000Z',
  },
  {
    id: 'SR-1045',
    title: 'Grant access to the project workspace',
    category: 'Access',
    priority: 'normal',
    status: 'open',
    createdAt: '2026-10-28T16:00:00.000Z',
  },
  {
    id: 'SR-1046',
    title: 'Refresh the shared knowledge base',
    category: 'Software',
    priority: 'low',
    status: 'in-progress',
    createdAt: '2026-10-28T14:00:00.000Z',
  },
  {
    id: 'SR-1047',
    title: 'Reconnect the team VPN',
    category: 'Network',
    priority: 'critical',
    status: 'open',
    createdAt: '2026-10-29T13:30:00.000Z',
  },
  {
    id: 'SR-1048',
    title: 'Update the meeting room display',
    category: 'Hardware',
    priority: 'normal',
    status: 'resolved',
    createdAt: '2026-10-27T12:00:00.000Z',
  },
  {
    id: 'SR-1049',
    title: 'Restore the shared folder permissions',
    category: 'Access',
    priority: 'high',
    status: 'resolved',
    createdAt: '2026-10-28T08:00:00.000Z',
  },
]

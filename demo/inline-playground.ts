export type DemoRequest = {
  title: string
  status: 'open' | 'resolved'
}

export const sampleRequest: DemoRequest = {
  title: 'Connect the demo laptop',
  status: 'open',
}

export function formatRequestLabel(request: DemoRequest): string {
  const label = request.title
  return label
}

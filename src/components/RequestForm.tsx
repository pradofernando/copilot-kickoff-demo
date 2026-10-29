import { useState } from 'react'
import type { FormEvent } from 'react'
import { CATEGORIES, isCategory, isPriority, PRIORITY_OPTIONS } from '../domain/types.ts'
import type { Category, Priority } from '../domain/types.ts'
import { validateRequestTitle } from '../domain/triage.ts'

type Props = {
  onCreate: (title: string, category: Category, priority: Priority) => void
  onCancel: () => void
}

export function RequestForm({ onCreate, onCancel }: Props) {
  const [title, setTitle] = useState('')
  const [error, setError] = useState<string | null>(null)

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const titleError = validateRequestTitle(title)
    if (titleError) {
      setError(titleError)
      return
    }
    const data = new FormData(event.currentTarget)
    const category = data.get('category')
    const priority = data.get('priority')
    if (typeof category !== 'string' || !isCategory(category)
      || typeof priority !== 'string' || !isPriority(priority)) {
      setError('Choose a valid category and priority.')
      return
    }
    onCreate(title.trim(), category, priority)
  }

  return (
    <section className="request-form-panel" id="new-request-panel" aria-labelledby="new-request-title">
      <div className="section-heading">
        <div><p className="eyebrow">LET'S GET IT MOVING</p><h2 id="new-request-title">New service request</h2></div>
        <span className="muted">Synthetic data only</span>
      </div>
      <form onSubmit={submit} noValidate>
        <div className="form-grid">
          <label className="title-field" htmlFor="request-title">
            Request title
            <input
              id="request-title"
              name="title"
              value={title}
              onChange={(event) => { setTitle(event.currentTarget.value); setError(null) }}
              placeholder="What needs a little attention?"
              autoFocus
              aria-invalid={Boolean(error)}
              aria-describedby={error ? 'request-error' : 'title-hint'}
            />
            <span className="field-hint" id="title-hint">6-120 characters. Do not enter real or sensitive information.</span>
          </label>
          <label htmlFor="request-category">
            Category
            <select id="request-category" name="category" defaultValue="Access">
              {CATEGORIES.map((category) => <option key={category}>{category}</option>)}
            </select>
          </label>
          <label htmlFor="request-priority">
            Priority
            <select id="request-priority" name="priority" defaultValue="normal">
              {PRIORITY_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </label>
        </div>
        {error && <p className="form-error" id="request-error" role="alert">{error}</p>}
        <div className="form-actions">
          <button className="button button-secondary" type="button" onClick={onCancel}>Cancel</button>
          <button className="button button-primary" type="submit">Create request</button>
        </div>
      </form>
    </section>
  )
}

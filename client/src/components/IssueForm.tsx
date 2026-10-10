import { useState } from 'react';
import type { FormEvent } from 'react';
import type { CreateIssuePayload, Issue, IssueStatus, IssuePriority } from '../types/issue';
import { FormField, inputCls, inputErrCls } from './ui/FormField';
import { Spinner } from './ui/Spinner';

const STATUS_OPTIONS: IssueStatus[]   = ['Open', 'In Progress', 'Closed'];
const PRIORITY_OPTIONS: IssuePriority[] = ['Low', 'Medium', 'High', 'Critical'];

type FieldErrors = Partial<Record<keyof CreateIssuePayload, string>>;

interface IssueFormProps {
  /** Pre-populated values for edit mode */
  initial?: Partial<Issue>;
  onSubmit: (payload: CreateIssuePayload) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
}

function parseLabels(raw: string): string[] {
  return raw
    .split(',')
    .map((l) => l.trim())
    .filter(Boolean);
}

export function IssueForm({ initial, onSubmit, onCancel, submitLabel = 'Save' }: IssueFormProps) {
  const [title,       setTitle]       = useState(initial?.title       ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [status,      setStatus]      = useState<IssueStatus>(initial?.status     ?? 'Open');
  const [priority,    setPriority]    = useState<IssuePriority>(initial?.priority ?? 'Low');
  const [labelsRaw,   setLabelsRaw]   = useState((initial?.labels ?? []).join(', '));

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [saving,      setSaving]      = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFieldErrors({});
    setSubmitError(null);

    // Client-side guard: title required
    if (!title.trim()) {
      setFieldErrors({ title: 'Title is required.' });
      return;
    }

    const payload: CreateIssuePayload = {
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      labels: parseLabels(labelsRaw),
    };

    setSaving(true);
    try {
      await onSubmit(payload);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Something went wrong.';
      // If server returned field-level details, they'd be parsed here; for now surface as banner
      setSubmitError(msg);
    } finally {
      setSaving(false);
    }
  }

  const selectCls = `${inputCls} cursor-pointer`;

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      {submitError && (
        <div className="rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          {submitError}
        </div>
      )}

      <FormField label="Title" htmlFor="issue-title" error={fieldErrors.title} required>
        <input
          id="issue-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={100}
          placeholder="Short, descriptive title"
          className={fieldErrors.title ? inputErrCls : inputCls}
          autoFocus
        />
      </FormField>

      <FormField label="Description" htmlFor="issue-desc" error={fieldErrors.description}>
        <textarea
          id="issue-desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={500}
          rows={3}
          placeholder="Optional details…"
          className={`${fieldErrors.description ? inputErrCls : inputCls} resize-none`}
        />
      </FormField>

      <div className="grid grid-cols-2 gap-3">
        <FormField label="Status" htmlFor="issue-status">
          <select
            id="issue-status"
            value={status}
            onChange={(e) => setStatus(e.target.value as IssueStatus)}
            className={selectCls}
          >
            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </FormField>

        <FormField label="Priority" htmlFor="issue-priority">
          <select
            id="issue-priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as IssuePriority)}
            className={selectCls}
          >
            {PRIORITY_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </FormField>
      </div>

      <FormField label="Labels" htmlFor="issue-labels" error={fieldErrors.labels}>
        <input
          id="issue-labels"
          type="text"
          value={labelsRaw}
          onChange={(e) => setLabelsRaw(e.target.value)}
          placeholder="bug, frontend, auth  (comma-separated)"
          className={fieldErrors.labels ? inputErrCls : inputCls}
        />
      </FormField>

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="rounded border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-1.5 rounded bg-neutral-800 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 transition-colors disabled:opacity-50"
        >
          {saving && <Spinner size="sm" className="border-white/30 border-t-white" />}
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

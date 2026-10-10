import { useState } from 'react';
import type { FormEvent } from 'react';
import type { CreateProjectPayload, Project } from '../types/issue';
import { FormField, inputCls, inputErrCls } from './ui/FormField';
import { Spinner } from './ui/Spinner';

interface ProjectFormProps {
  initial?: Partial<Project>;
  onSubmit: (payload: CreateProjectPayload) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
}

export function ProjectForm({ initial, onSubmit, onCancel, submitLabel = 'Save' }: ProjectFormProps) {
  const [name,        setName]        = useState(initial?.name        ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [nameError,   setNameError]   = useState('');
  const [submitError, setSubmitError] = useState('');
  const [saving,      setSaving]      = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setNameError('');
    setSubmitError('');

    if (!name.trim()) {
      setNameError('Project name is required.');
      return;
    }

    setSaving(true);
    try {
      await onSubmit({ name: name.trim(), description: description.trim() });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      {submitError && (
        <div className="rounded border border-red-800 bg-red-950/50 px-3 py-2 text-xs text-red-400">
          {submitError}
        </div>
      )}

      <FormField label="Name" htmlFor="project-name" error={nameError} required>
        <input
          id="project-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={80}
          placeholder="e.g. API Gateway"
          className={nameError ? inputErrCls : inputCls}
          autoFocus
        />
      </FormField>

      <FormField label="Description" htmlFor="project-desc">
        <textarea
          id="project-desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={300}
          rows={3}
          placeholder="Optional — what does this project track?"
          className={`${inputCls} resize-none`}
        />
      </FormField>

      <div className="flex justify-end gap-2 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="rounded border border-neutral-700 bg-neutral-800 px-4 py-2 text-sm font-medium text-neutral-300 hover:bg-neutral-700 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-1.5 rounded bg-neutral-600 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-500 transition-colors disabled:opacity-50"
        >
          {saving && <Spinner size="sm" className="border-white/30 border-t-white" />}
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

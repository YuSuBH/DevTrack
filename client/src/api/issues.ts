import type {
  Issue,
  IssueFilters,
  IssueStats,
  CreateIssuePayload,
  UpdateIssuePayload,
} from '../types/issue';

const BASE = '/api/issues';

/** Throw a structured error from a non-OK response. Never swallows failures. */
async function handleResponse<T>(res: Response): Promise<T> {
  if (res.ok) {
    const json = await res.json();
    return json.data as T;
  }

  let message = `Request failed with status ${res.status}`;
  try {
    const json = await res.json();
    if (json.error) message = json.error;
  } catch {
    // response body wasn't JSON — keep the default message
  }
  throw new Error(message);
}

export async function fetchIssues(filters: Partial<IssueFilters> = {}): Promise<Issue[]> {
  const params = new URLSearchParams();
  if (filters.search?.trim()) params.set('search', filters.search.trim());
  if (filters.status) params.set('status', filters.status);
  if (filters.priority) params.set('priority', filters.priority);

  const query = params.toString() ? `?${params.toString()}` : '';
  const res = await fetch(`${BASE}${query}`);
  return handleResponse<Issue[]>(res);
}

export async function fetchStats(): Promise<IssueStats> {
  const res = await fetch(`${BASE}/stats`);
  return handleResponse<IssueStats>(res);
}

export async function fetchIssueById(id: string): Promise<Issue> {
  const res = await fetch(`${BASE}/${id}`);
  return handleResponse<Issue>(res);
}

export async function createIssue(payload: CreateIssuePayload): Promise<Issue> {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse<Issue>(res);
}

export async function updateIssue(id: string, payload: UpdateIssuePayload): Promise<Issue> {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse<Issue>(res);
}

export async function deleteIssue(id: string): Promise<void> {
  const res = await fetch(`${BASE}/${id}`, { method: 'DELETE' });
  if (!res.ok) {
    let message = `Request failed with status ${res.status}`;
    try {
      const json = await res.json();
      if (json.error) message = json.error;
    } catch { /* keep default */ }
    throw new Error(message);
  }
}

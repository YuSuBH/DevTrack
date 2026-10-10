import type { Project, CreateProjectPayload, UpdateProjectPayload } from '../types/issue';

const BASE = '/api/projects';

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
    // non-JSON body — keep default message
  }
  throw new Error(message);
}

export async function fetchProjects(): Promise<Project[]> {
  const res = await fetch(BASE);
  return handleResponse<Project[]>(res);
}

export async function fetchProjectById(id: string): Promise<Project> {
  const res = await fetch(`${BASE}/${id}`);
  return handleResponse<Project>(res);
}

export async function createProject(payload: CreateProjectPayload): Promise<Project> {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse<Project>(res);
}

export async function updateProject(
  id: string,
  payload: UpdateProjectPayload
): Promise<Project> {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse<Project>(res);
}

export async function deleteProject(id: string): Promise<void> {
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

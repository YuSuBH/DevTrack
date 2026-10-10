// ── Project ────────────────────────────────────────────────────────────────

export interface Project {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateProjectPayload = {
  name: string;
  description?: string;
};

export type UpdateProjectPayload = Partial<CreateProjectPayload>;

// ── Issue ──────────────────────────────────────────────────────────────────

export type IssueStatus = 'Open' | 'In Progress' | 'Closed';
export type IssuePriority = 'Low' | 'Medium' | 'High' | 'Critical';

export interface Issue {
  _id: string;
  project: string;       // Project _id
  title: string;
  description: string;
  status: IssueStatus;
  priority: IssuePriority;
  labels: string[];
  createdAt: string;
  updatedAt: string;
}

export interface IssueStats {
  total: number;
  open: number;
  inProgress: number;
  closed: number;
}

export interface IssueFilters {
  search: string;
  status: IssueStatus | '';
  priority: IssuePriority | '';
}

export type CreateIssuePayload = {
  title: string;
  description: string;
  status: IssueStatus;
  priority: IssuePriority;
  labels: string[];
};

export type UpdateIssuePayload = Partial<CreateIssuePayload>;

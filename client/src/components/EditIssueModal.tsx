import { useIssues } from '../context/IssueContext';
import type { CreateIssuePayload, Issue } from '../types/issue';
import { Modal } from './ui/Modal';
import { IssueForm } from './IssueForm';

interface EditIssueModalProps {
  issue: Issue | null;
  onClose: () => void;
}

export function EditIssueModal({ issue, onClose }: EditIssueModalProps) {
  const { updateIssue } = useIssues();

  async function handleSubmit(payload: CreateIssuePayload) {
    if (!issue) return;
    await updateIssue(issue._id, payload);
    onClose();
  }

  return (
    <Modal open={!!issue} onClose={onClose} title="Edit Issue">
      {issue && (
        <IssueForm
          initial={issue}
          onSubmit={handleSubmit}
          onCancel={onClose}
          submitLabel="Save Changes"
        />
      )}
    </Modal>
  );
}

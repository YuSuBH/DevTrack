import { useIssues } from '../context/IssueContext';
import type { CreateIssuePayload } from '../types/issue';
import { Modal } from './ui/Modal';
import { IssueForm } from './IssueForm';

interface CreateIssueModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateIssueModal({ open, onClose }: CreateIssueModalProps) {
  const { createIssue } = useIssues();

  async function handleSubmit(payload: CreateIssuePayload) {
    await createIssue(payload);
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="New Issue">
      {/* Remount form on open so state resets cleanly */}
      {open && (
        <IssueForm
          onSubmit={handleSubmit}
          onCancel={onClose}
          submitLabel="Create Issue"
        />
      )}
    </Modal>
  );
}

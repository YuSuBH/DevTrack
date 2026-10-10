import { useProjects } from '../context/ProjectContext';
import type { CreateProjectPayload } from '../types/issue';
import { Modal } from './ui/Modal';
import { ProjectForm } from './ProjectForm';

interface CreateProjectModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateProjectModal({ open, onClose }: CreateProjectModalProps) {
  const { createProject } = useProjects();

  async function handleSubmit(payload: CreateProjectPayload) {
    await createProject(payload);
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="New Project">
      {open && (
        <ProjectForm
          onSubmit={handleSubmit}
          onCancel={onClose}
          submitLabel="Create Project"
        />
      )}
    </Modal>
  );
}

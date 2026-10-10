import { useProjects } from '../context/ProjectContext';
import type { CreateProjectPayload, Project } from '../types/issue';
import { Modal } from './ui/Modal';
import { ProjectForm } from './ProjectForm';

interface EditProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export function EditProjectModal({ project, onClose }: EditProjectModalProps) {
  const { updateProject } = useProjects();

  async function handleSubmit(payload: CreateProjectPayload) {
    if (!project) return;
    await updateProject(project._id, payload);
    onClose();
  }

  return (
    <Modal open={!!project} onClose={onClose} title="Edit Project">
      {project && (
        <ProjectForm
          initial={project}
          onSubmit={handleSubmit}
          onCancel={onClose}
          submitLabel="Save Changes"
        />
      )}
    </Modal>
  );
}

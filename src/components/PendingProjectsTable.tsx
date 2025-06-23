import { Project } from "../types";

interface PendingProjectsTableProps {
  projects: Project[];
  onApprove: (projectId: number) => void;
  onReject: (projectId: number) => void;
  onView: (project: Project) => void;
}

const PendingProjectsTable: React.FC<PendingProjectsTableProps> = ({
  projects,
  onApprove,
  onReject,
  onView
}) => (
  <div className="overflow-x-auto">
    <table className="min-w-full bg-white border border-gray-200 rounded-lg">
      <thead>
        <tr className="bg-gray-100 border-b">
          <th className="py-2 px-4 text-left">Title</th>
          <th className="py-2 px-4 text-left">Goal</th>
          <th className="py-2 px-4 text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        {projects.map((project) => (
          <tr key={project.id} className="border-b">
            <td className="py-2 px-4">{project.title}</td>
            <td className="py-2 px-4">${project.goalAmount}</td>
            <td className="py-2 px-4 flex space-x-2">
              <button
                onClick={() => onView(project)}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              >
                View
              </button>
              <button
                onClick={() => onApprove(project.id)}
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
              >
                Approve
              </button>
              <button
                onClick={() => onReject(project.id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Reject
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default PendingProjectsTable;

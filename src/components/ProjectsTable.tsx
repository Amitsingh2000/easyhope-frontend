import { Project } from "../types";

const ProjectsTable: React.FC<{ 
  projects: Project[], 
  onDelete: (id: number) => void 
}> = ({ projects, onDelete }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full bg-white border border-gray-200 rounded-lg">
      <thead>
        <tr className="bg-gray-100 border-b">
          <th className="py-2 px-4 text-left">Project Name</th>
          <th className="py-2 px-4 text-left">Raised Amount</th>
          <th className="py-2 px-4 text-left">Goal Amount</th>
          <th className="py-2 px-4 text-left">Owner</th>
          <th className="py-2 px-4 text-left">Status</th>
          <th className="py-2 px-4 text-center">Actions</th> {/* ✅ New column for actions */}
        </tr>
      </thead>
      <tbody>
        {projects.map((project) => (
          <tr key={project.id} className="border-b">
            <td className="py-2 px-4">{project.title}</td>
            <td className="py-2 px-4">{project.raisedAmount}</td>
            <td className="py-2 px-4">{project.goalAmount}</td>
            <td className="py-2 px-4">{project.creatorName}</td>
            <td className="py-2 px-4">{project.status}</td>
            <td className="py-2 px-4 text-center"><button onClick={() => onDelete(project.id)} className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition">Delete</button></td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default ProjectsTable;

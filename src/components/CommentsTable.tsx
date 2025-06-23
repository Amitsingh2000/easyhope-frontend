import React, { useState } from "react";
import { Comment } from "../types";

interface CommentsTableProps {
  comments: Comment[];
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
}

const CommentsTable: React.FC<CommentsTableProps> = ({ comments, setComments }) => {
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);

  const filteredComments = selectedProjectId
    ? comments.filter((comment) => comment.projectId === selectedProjectId)
    : comments;

  // 🚀 Handle Delete Comment
  const handleDelete = async (commentId: number) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this comment?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:8080/api/comments/${commentId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Remove the deleted comment from state
        setComments((prevComments) => prevComments.filter((comment) => comment.id !== commentId));
      } else {
        alert("Failed to delete comment.");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert("An error occurred while deleting the comment.");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Project Comments</h2>

      {/* Project ID Filter Dropdown */}
      <select
        value={selectedProjectId || ""}
        onChange={(e) => setSelectedProjectId(e.target.value ? Number(e.target.value) : null)}
        className="border border-gray-300 rounded-md px-4 py-2 mb-4 w-full"
      >
        <option value="">-- Show All Comments --</option>
        {Array.from(new Set(comments.map((comment) => comment.projectId))).map((projectId) => (
          <option key={`project-${projectId}`} value={projectId}>
            Project ID: {projectId}
          </option>
        ))}
      </select>

      {/* Comments Table */}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">Comment ID</th>
            <th className="border border-gray-300 px-4 py-2">User</th>
            <th className="border border-gray-300 px-4 py-2">Comment</th>
            <th className="border border-gray-300 px-4 py-2">Project ID</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredComments.map((comment) => (
            <tr key={`comment-${comment.id}`} className="text-center">
              <td className="border border-gray-300 px-4 py-2">{comment.id}</td>
              <td className="border border-gray-300 px-4 py-2">{comment.userId}</td>
              <td className="border border-gray-300 px-4 py-2">{comment.text}</td>
              <td className="border border-gray-300 px-4 py-2">{comment.projectId}</td>
              <td className="border border-gray-300 px-4 py-2">
                <button
                  onClick={() => handleDelete(comment.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md"
                >
                  ❌ Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CommentsTable;

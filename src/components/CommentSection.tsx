import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Comment } from "../types";

interface CommentSectionProps {
  projectId: string;
  comments: Comment[];
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
}

const CommentSection: React.FC<CommentSectionProps> = ({ projectId, comments, setComments }) => {
  const { user } = useAuth(); // Get logged-in user
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setError("You must be logged in to comment.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:8080/api/comments/${projectId}/comments`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: newComment,
          userId: user.id,
        }),
      });

      if (!response.ok) throw new Error("Failed to add comment");

      const newCommentData = await response.json();

      // Ensure new comment follows the Comment interface
      const formattedNewComment: Comment = {
        id: newCommentData.id,
        text: newCommentData.text,
        userId: user.id,
        projectId: parseInt(projectId), // Convert string projectId to number
        userName: user.name, // Use logged-in user's name
        profileImage:
          user.image || "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg", // Default image
      };

      // Update comments list
      setComments((prev) => [...prev, formattedNewComment]);
      setNewComment(""); // Clear input
    } catch (err) {
      setError("Failed to post comment. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-4">Comments ({comments.length})</h3>

      {/* If user not logged in */}
      {!user ? (
        <div className="p-4 bg-gray-100 text-gray-700 rounded-md text-center">
          <p>You must be logged in to comment.</p>
          <a
            href="/login"
            className="mt-2 inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Login to Comment
          </a>
        </div>
      ) : (
        <>
          {/* Comment Form */}
          <form onSubmit={handleCommentSubmit} className="mb-4">
            <textarea
              className="w-full p-3 border border-gray-300 rounded-md"
              placeholder="Write your comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              required
              disabled={loading}
            />
            <button
              type="submit"
              className={`mt-2 px-4 py-2 rounded-md text-white ${
                loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
              }`}
              disabled={loading}
            >
              {loading ? "Posting..." : "Post Comment"}
            </button>
          </form>
          {error && <p className="text-red-500">{error}</p>}
        </>
      )}

      {/* Comment List */}
      <div className="space-y-4">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="p-3 border border-gray-200 rounded-md flex items-start space-x-3"
            >
              <img
                src={`http://localhost:8080${comment.profileImage}`} // ✅ updated to profileImage
                alt={comment.userName} // ✅ updated to userName
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="text-sm font-semibold">{comment.userName}</p> {/* ✅ */}
                <p className="text-gray-700">{comment.text}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No comments yet. Be the first to comment!</p>
        )}
      </div>
    </div>
  );
};

export default CommentSection;

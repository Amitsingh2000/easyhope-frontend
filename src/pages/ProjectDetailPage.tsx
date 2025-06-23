import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Share2, Calendar, User, Flag } from "lucide-react";
import ProgressBar from "../components/ProgressBar";
import DonationForm from "../components/DonationForm";
import CommentSection from "../components/CommentSection";
import { Project, Comment } from "../types";

const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"story" | "comments">("story");
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    let isMounted = true;

    const loadProject = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8080/api/projects/${id}`);
        if (!response.ok) throw new Error("Project not found");

        const projectData = await response.json();
        if (isMounted) setProject(projectData);

        const commentsResponse = await fetch(`http://localhost:8080/api/comments/${id}`);
        if (commentsResponse.ok) {
          const commentsData = await commentsResponse.json();
          const formattedComments = commentsData.map((comment: any) => ({
            id: comment.id,
            userName: comment.user?.name || "Anonymous",
            profileImage: comment.user?.image || "",
            text: comment.text,
          }));
          if (isMounted) setComments(formattedComments);
          console.log(formattedComments);
        }
      } catch (err) {
        if (isMounted) setError("Failed to load project details.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadProject();

    return () => {
      isMounted = false;
    };
  }, [id]);

  // ✅ Update raised amount after successful donation
  const handleDonationSuccess = (newRaisedAmount: number) => {
    setProject((prevProject) =>
      prevProject ? { ...prevProject, raisedAmount: newRaisedAmount } : prevProject
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-4 text-red-600">Project Not Found</h1>
        <p className="text-gray-600 mb-6">
          {error || "The project you're looking for doesn't exist or was removed."}
        </p>
        <Link
          to="/explore"
          className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition"
        >
          Explore Other Projects
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(project.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16 px-6">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="flex-grow">
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            {/* Project Image */}
            <div className="h-96 overflow-hidden">
              {project.images && project.images.length > 0 ? (
                <img
                  src={project.images} // ✅ Fix: Use first image from array
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                  No Image Available
                </div>
              )}
            </div>

            {/* Project Details */}
            <div className="p-6">
              <div className="flex items-center space-x-2 mb-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">
                  {project.category}
                </span>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded ${project.status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : project.raisedAmount >= project.goalAmount
                      ? "bg-red-100 text-red-800"
                      : "bg-green-100 text-green-800"
                    }`}
                >
                  {project.status === "pending"
                    ? "Pending"
                    : project.raisedAmount >= project.goalAmount
                      ? "Closed"
                      : "Active"}
                </span>

              </div>

              <h1 className="text-3xl font-bold mb-4">{project.title}</h1>

              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Created on {formattedDate}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">by {project.creatorName}</span>
                </div>
              </div>

              <ProgressBar current={project.raisedAmount} goal={project.goalAmount} />

              <div className="flex gap-4 mt-6">
                <button className="flex items-center space-x-1 px-4 py-2 bg-gray-100 rounded-md text-gray-700 hover:bg-gray-200 transition">
                  <Share2 className="h-4 w-4" />
                  <span>Share</span>
                </button>
                <button className="flex items-center space-x-1 px-4 py-2 bg-gray-100 rounded-md text-gray-700 hover:bg-gray-200 transition">
                  <Flag className="h-4 w-4" />
                  <span>Report</span>
                </button>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200 mt-6">
                <nav className="flex space-x-8">
                  {["story", "comments"].map((tab) => (
                    <button
                      key={tab}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                      onClick={() => setActiveTab(tab as "story" | "comments")}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}{" "}
                      {tab === "comments" ? `(${comments.length})` : ""}
                    </button>
                  ))}
                </nav>
              </div>

              {activeTab === "story" && <p className="text-gray-700 leading-relaxed">{project.description}</p>}
              {activeTab === "comments" && <CommentSection projectId={project.id.toString()} comments={comments} setComments={setComments} />}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-96 flex-shrink-0">
          <div className="sticky top-24">
            {project && project.status === "pending" ? (
              <div className="p-4 bg-yellow-100 text-yellow-800 text-center rounded-md">
                <p><strong>Project Pending Approval</strong></p>
                <p>This project is not open for donations yet.</p>
              </div>
            ) : project.raisedAmount >= project.goalAmount ? (
              <div className="p-4 bg-red-100 text-red-700 text-center rounded-md">
                <p><strong>Funding Goal Reached!</strong></p>
                <p>This project is now closed for donations.</p>
              </div>
            ) : (
              <DonationForm
                projectId={project.id.toString()}
                projectTitle={project.title}
                onDonationSuccess={handleDonationSuccess}
              />
            )}

          </div>
        </div>

      </div>
    </div>
  );
};

export default ProjectDetailPage;

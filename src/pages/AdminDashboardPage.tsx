import React, { useState, useEffect } from 'react';
import { Users, FileText, CreditCard, AlertTriangle, MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Comment, Donation, Project, User } from '../types';
import UsersTable from '../components/UsersTable';
import ProjectsTable from '../components/ProjectsTable';
import DonationsTable from '../components/DonationsTable';
import CommentsTable from '../components/CommentsTable';
import { toast } from 'react-toastify';


const AdminDashboardPage: React.FC = () => {
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [pendingProjects, setPendingProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProjects: 0,
    totalDonations: 0,
    pendingApprovals: 0
  });
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [transactions, setTransactions] = useState<Donation[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  


  // Redirect non-admin users
  if (!isAdmin) {
    return <Navigate to="/dashboard" />;
  }

  // 1️⃣ Fetch Stats & Pending Projects (Runs on Mount + Every 30s)
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsResponse, pendingProjectsResponse] = await Promise.all([
          fetch('http://localhost:8080/api/admin/stats', { credentials: 'include' }),
          fetch('http://localhost:8080/api/admin/pending-projects', { credentials: 'include' })
        ]);

        if (!statsResponse.ok) throw new Error('Failed to fetch stats');
        if (!pendingProjectsResponse.ok) throw new Error('Failed to fetch pending projects');

        setStats(await statsResponse.json());
        setPendingProjects(await pendingProjectsResponse.json());
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();

    // Re-fetch every 30 seconds (optional)
    const interval = setInterval(fetchDashboardData, 5000);
    return () => clearInterval(interval); // Cleanup on unmount
  }, []); // Runs once on mount

  // 2️⃣ Fetch Tab-Specific Data (Runs When `activeTab` Changes)
  useEffect(() => {
    const fetchData = async () => {
      try {
        let response;
        switch (activeTab) {
          case 'users':
            response = await fetch('http://localhost:8080/api/admin/users', { credentials: 'include' });
            if (!response.ok) throw new Error('Failed to fetch users');
            setUsers(await response.json());
            break;

          case 'projects':
            response = await fetch('http://localhost:8080/api/admin/projects', { credentials: 'include' });
            if (!response.ok) throw new Error('Failed to fetch projects');
            setProjects(await response.json());
            break;

          case 'transactions':
            response = await fetch('http://localhost:8080/api/donations', { credentials: 'include' });
            if (!response.ok) throw new Error('Failed to fetch transactions');
            //console.log(response.json());
            setTransactions(await response.json());
            break;

          case 'comments':
              try {
                const response = await fetch('http://localhost:8080/api/admin/comments', { credentials: 'include' });
                if (!response.ok) throw new Error('Failed to fetch comments');
                setComments(await response.json());
                //console.log(comments);
              } catch (error) {
                console.error('Error fetching comments:', error);
              }
            break;

          default:
            break;
        }
      } catch (error) {
        console.error(`Error fetching ${activeTab} data:`, error);
      }
    };

    fetchData();
  }, [activeTab]); // Runs when `activeTab` changes



  const approveProject = async (projectId: string | number) => {
    try {
      //console.log("Approving Project ID:", projectId); // Debug Log
      const response = await fetch(`http://localhost:8080/api/admin/approve-project/${projectId}`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to approve project");
      toast.success("Project Approved successfully")
      setPendingProjects(pendingProjects.filter(project => project.id !== projectId));
    } catch (error) {
      console.error("Error approving project:", error);
    }
  };

  const rejectProject = async (projectId: string | number) => {
    try {
      //console.log("Rejecting Project ID:", projectId); // Debug Log
      const response = await fetch(`http://localhost:8080/api/admin/reject-project/${projectId}`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to reject project");
      toast.success("Project Rejected successfully")
      setPendingProjects(pendingProjects.filter(project => project.id !== projectId));
    } catch (error) {
      console.error("Error rejecting project:", error);
    }
  };

  const deleteProject = async (projectId: number) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;

    try {
      const response = await fetch(`http://localhost:8080/api/admin/delete-project/${projectId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to delete project");
      toast.success("Project Deleted successfully!");
      setProjects((prev) => prev.filter(project => project.id !== projectId));
      
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const deleteUser = async (userId: number) => {
    try {
      const response = await fetch(`http://localhost:8080/api/users/delete-user/${userId}`, {
        method: "DELETE",
      });
  
      if (!response.ok) {
        throw new Error("Failed to delete user");
      }
  
      toast.success("User deleted successfully");
      setUsers((prev) => prev.filter(user => user.id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Error deleting user");
    }
  };
  

  // Render Pending Projects Table
  <PendingProjectsTable projects={pendingProjects} onApprove={approveProject} onReject={rejectProject} />


  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage users, projects, and transactions</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <nav className="p-4">
                <ul className="space-y-2">
                  {['overview', 'projects', 'users', 'transactions', 'comments'].map(tab => (
                    <li key={tab}>
                      <button
                        className={`w-full flex items-center space-x-3 px-4 py-2 rounded-md ${activeTab === tab ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        onClick={() => setActiveTab(tab)}
                      >
                        {tab === 'overview' && <FileText className="h-5 w-5" />}
                        {tab === 'projects' && <FileText className="h-5 w-5" />}
                        {tab === 'users' && <Users className="h-5 w-5" />}
                        {tab === 'transactions' && <CreditCard className="h-5 w-5" />}
                        {tab === 'comments' && <MessageSquare className="h-5 w-5" />}
                        {/* {tab === 'reports' && <AlertTriangle className="h-5 w-5" />} */}
                        <span>{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-grow">
            <div className="bg-white rounded-lg shadow-md p-6">
              {activeTab === 'overview' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard label="Total Users" value={stats.totalUsers} icon={<Users className="h-10 w-10 text-blue-500" />} />
                    <StatCard label="Total Projects" value={stats.totalProjects} icon={<FileText className="h-10 w-10 text-green-500" />} />
                    <StatCard label="Total Donations" value={`₹${stats.totalDonations}`} icon={<CreditCard className="h-10 w-10 text-purple-500" />} />
                    <StatCard label="Pending Approvals" value={stats.pendingApprovals} icon={<AlertTriangle className="h-10 w-10 text-yellow-500" />} />
                  </div>

                  <PendingProjectsTable
                    projects={pendingProjects}
                    onApprove={approveProject}
                    onReject={rejectProject}
                  />
                </div>
              )}

              {/* Render Tab Data */}
              {activeTab === 'users' && <UsersTable users={users} onDeleteUser={deleteUser} />}
              {activeTab === 'projects' && <ProjectsTable projects={projects} onDelete={deleteProject} />}
              {activeTab === 'transactions' && <DonationsTable transactions={transactions} />}
              {activeTab === 'comments' && <CommentsTable comments={comments} setComments={setComments} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

};

// Components
const StatCard: React.FC<{ label: string; value: number | string; icon: JSX.Element }> = ({ label, value, icon }) => (
  <div className="bg-gray-50 p-6 rounded-lg">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600 font-medium">{label}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
      {icon}
    </div>
  </div>
);

const PendingProjectsTable: React.FC<{
  projects: Project[];
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
}> = ({ projects, onApprove, onReject }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold mb-4">Pending Projects</h3>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">Project Name</th>
            <th className="border border-gray-300 px-4 py-2">Creator</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.length > 0 ? (
            projects.map((project) => (
              <tr key={project.id} className="text-center">
                <td className="border border-gray-300 px-4 py-2">{project.title}</td>
                <td className="border border-gray-300 px-4 py-2">{project.creatorName}</td>
                <td className="border border-gray-300 px-4 py-2 flex justify-center space-x-3">
                  {/* Approve Button */}
                  <button
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded transition duration-200 ease-in-out"
                    onClick={() => onApprove(project.id)}
                  >
                    ✅ Approve
                  </button>

                  {/* Reject Button */}
                  <button
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded transition duration-200 ease-in-out"
                    onClick={() => onReject(project.id)}
                  >
                    ❌ Reject
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="text-gray-500 text-center py-4">
                No pending projects
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};


export default AdminDashboardPage;
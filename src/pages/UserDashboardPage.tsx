import React, { useEffect, useState } from 'react';
import { User, FileText, LogOut } from 'lucide-react';
import ProjectCard from '../components/ProjectCard';
import { useAuth } from '../context/AuthContext';
import { Donation, Project } from '../types';
import DonationsTable from '../components/DonationsTable';
import { toast } from 'react-toastify';


const UserDashboardPage: React.FC = () => {
  const { user, setUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('profile');
  const [userProjects, setUserProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [donations, setDonations] = useState<Donation[]>([]);
  



  // Profile Update Fields
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const BASE_URL = "http://localhost:8080"; // Adjust as per backend
const [previewImage, setPreviewImage] = useState<string | null>(
  user?.image ? `${BASE_URL}${user.image}` : null
);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  

  useEffect(() => {
    const fetchProjects = async () => {
      console.log("User Data:", user); // ✅ Debug User Data
  
      const token = localStorage.getItem("token"); // 🔥 Get token from localStorage
      if (!user?.id || !token) return; // Ensure user & token are available
  
      try {
        const response = await fetch(`http://localhost:8080/api/projects/user/${user.id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // ✅ Use token from localStorage
            "Content-Type": "application/json",
          },
        });
  
        if (response.status === 404) {
          console.warn("No projects found for this user."); // ✅ Log Warning
          setUserProjects([]); // ✅ Set empty array instead of throwing error
          return;
        }
  
        if (!response.ok) throw new Error(`Failed to fetch user projects: ${response.status}`);
  
        const data = await response.json();
        console.log("Fetched Projects:", data); // ✅ Debug API response
  
        setUserProjects(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchProjects();
  }, [user]);
  
  
  
  

  useEffect(() => {
    const fetchDonations = async () => {
      if (!user || !user.id) return;
      //console.log(user.id)
      try {
        const response = await fetch(`http://localhost:8080/api/donations/user/${user.id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Failed to fetch donations");

        const data = await response.json();
        setDonations(data);
      } catch (error) {
        console.error("Error fetching donations:", error);
      }
    };

    fetchDonations();
  }, [user]);

  // Handle Image Upload Preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      setPreviewImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  // Handle Profile Update
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
  
    const formData = new FormData();
    formData.append("id", String(user?.id)); // ✅ ADD THIS LINE
    formData.append("name", name);
    formData.append("email", email);
    if (password) formData.append("password", password);
    if (image) formData.append("image", image);
  
    try {
      const response = await fetch("http://localhost:8080/api/users/update", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
        body: formData,
      });
  
      if (!response.ok) throw new Error("Failed to update profile");
  
      const updatedUser = await response.json();
      setUser(updatedUser); // Update context
      toast.success("Profile updated successfully!"); // ✅ Toast success
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile"); // ✅ Toast error
    } finally {
      setIsUpdating(false);
    }
  };
  
  
  

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col items-center">
                  {previewImage ? (
                    <img src={previewImage} alt={name} className="h-20 w-20 rounded-full object-cover mb-4" />
                  ) : (
                    <div className="h-20 w-20 rounded-full bg-gray-300 flex items-center justify-center mb-4">
                      <User className="h-10 w-10 text-gray-500" />
                    </div>
                  )}
                  <h2 className="text-xl font-semibold">{user?.name}</h2>
                  <p className="text-gray-600 text-sm">{user?.email}</p>
                </div>
              </div>

              <nav className="p-4">
                <ul className="space-y-2">
                  <li>
                    <button
                      className={`w-full flex items-center space-x-3 px-4 py-2 rounded-md ${activeTab === 'profile' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      onClick={() => setActiveTab('profile')}
                    >
                      <User className="h-5 w-5" />
                      <span>Profile</span>
                    </button>
                  </li>
                  <li>
                    <button
                      className={`w-full flex items-center space-x-3 px-4 py-2 rounded-md ${activeTab === 'projects' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      onClick={() => setActiveTab('projects')}
                    >
                      <FileText className="h-5 w-5" />
                      <span>My Projects</span>
                    </button>
                  </li>
                  <li>
                    <button
                      className={`w-full flex items-center space-x-3 px-4 py-2 rounded-md ${activeTab === 'donations' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      onClick={() => setActiveTab('donations')}
                    >
                      <FileText className="h-5 w-5" />
                      <span>My Donations</span>
                    </button>
                  </li>


                  <li>
                    <button
                      className="w-full flex items-center space-x-3 px-4 py-2 rounded-md text-red-600 hover:bg-red-100"
                      onClick={logout}
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Logout</span>
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'profile' && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4">Edit Profile</h2>
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div>
                    <label className="block font-medium">Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block font-medium">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block font-medium">New Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="Leave blank to keep current password"
                    />
                  </div>

                  <div>
                    <label className="block font-medium">Profile Image</label>
                    <input type="file" onChange={handleImageChange} className="w-full" />
                  </div>

                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                    disabled={isUpdating}
                  >
                    {isUpdating ? 'Updating...' : 'Save Changes'}
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'projects' && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4">My Projects</h2>

                {loading ? (
                  <p>Loading projects...</p>
                ) : userProjects.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userProjects.map((project) => (
                      <ProjectCard key={project.id} project={project} />
                    ))}
                  </div>
                ) : (
                  <p>No projects found.</p>
                )}
              </div>
            )}
            {activeTab === 'donations' && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4">My Donations</h2>
                {donations.length === 0 ? (
                  <p>No donations found.</p>
                ) : (
                  <DonationsTable transactions={donations} />
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardPage;
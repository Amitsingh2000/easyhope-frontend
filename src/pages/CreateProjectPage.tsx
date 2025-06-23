import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const categories: string[] = [
  "Technology",
  "Education",
  "Health",
  "Environment",
  "Community",
  "Arts & Culture",
  "Social Causes"
];

const CreateProjectPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    imageUrl: '',
    description: '',
    category: '',
    goalAmount: '',
    endDate: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=start-campaign');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.imageUrl.trim()) newErrors.imageUrl = 'Image URL is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (formData.description.length < 100) newErrors.description = 'Description should be at least 100 characters';
    if (!formData.category) newErrors.category = 'Please select a category';
    if (!formData.goalAmount) newErrors.goalAmount = 'Goal amount is required';
    if (isNaN(Number(formData.goalAmount)) || Number(formData.goalAmount) <= 0) newErrors.goalAmount = 'Please enter a valid amount';
    if (!formData.endDate) newErrors.endDate = 'Please select an end date';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("Form submitted!"); // This is already showing
    
    //if (!validateForm()) return;
  
    setIsSubmitting(true);
  
    const projectData = {
      title: formData.title,
      images: formData.imageUrl,
      description: formData.description,
      category: formData.category,
      goalAmount: parseFloat(formData.goalAmount),
      creatorId: user?.id,
      creatorName: user?.name,
      creatorImage: user?.image
    };
  
    console.log("Sending project data:", projectData); // Check if data is correct
  
    try {
      const response = await fetch('http://localhost:8080/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(projectData),
      });
  
      console.log("Response received:", response); // Log response details
  
      if (!response.ok) {
        throw new Error("Failed to create project");
      }
  
      await response.json();
      toast.success("Project created successfully")

  
      navigate('/dashboard?tab=projects&status=success');
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Create a Campaign</h1>
        <p className="text-gray-600">Start raising funds for your cause</p>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mt-6">
          {/* Title */}
          <label className="block mb-2">Campaign Title*</label>
          <input type="text" name="title" className="w-full px-3 py-2 border rounded-md" value={formData.title} onChange={handleChange} />

          {/* Image URL */}
          <label className="block mt-4 mb-2">Image URL*</label>
          <input type="text" name="imageUrl" className="w-full px-3 py-2 border rounded-md" value={formData.imageUrl} onChange={handleChange} />

          {/* Description */}
          <label className="block mt-4 mb-2">Campaign Description*</label>
          <textarea name="description" rows={6} className="w-full px-3 py-2 border rounded-md" value={formData.description} onChange={handleChange}></textarea>

          {/* Category */}
          <label className="block mt-4 mb-2">Category*</label>
          <select name="category" className="w-full px-3 py-2 border rounded-md" value={formData.category} onChange={handleChange}>
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          {/* Goal Amount */}
          <label className="block mt-4 mb-2">Funding Goal ($)*</label>
          <input type="number" name="goalAmount" className="w-full px-3 py-2 border rounded-md" value={formData.goalAmount} onChange={handleChange} />

          {/* End Date */}
          <label className="block mt-4 mb-2">End Date*</label>
          <input type="date" name="endDate" className="w-full px-3 py-2 border rounded-md" value={formData.endDate} onChange={handleChange} />

          {/* Submit */}
          <button type="submit" className="mt-6 w-full py-2 bg-blue-600 text-white rounded-md">
            {isSubmitting ? 'Submitting...' : 'Submit Campaign'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectPage;

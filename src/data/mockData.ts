import { Project, Donation, Comment } from '../types';

const API_URL = "http://localhost:8080/api";

// Function to fetch projects from the backend
export const fetchProjects = async (): Promise<Project[]> => {
  try {
    const response = await fetch(`${API_URL}/projects`, {
      method: 'GET',
      credentials: 'include', // ✅ Ensures session cookies are sent
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error("Failed to fetch projects");

    return await response.json();
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
};

// Function to fetch donations from the backend
export const fetchDonations = async (): Promise<Donation[]> => {
  try {
    const response = await fetch(`${API_URL}/donations`);
    if (!response.ok) throw new Error("Failed to fetch donations");
    return await response.json();
  } catch (error) {
    console.error("Error fetching donations:", error);
    return [];
  }
};

// Function to fetch comments for a specific project
export const fetchComments = async (projectId: string): Promise<Comment[]> => {
  try {
    const response = await fetch(`${API_URL}/comments/${projectId}`);
    if (!response.ok) throw new Error("Failed to fetch comments");
    return await response.json();
  } catch (error) {
    console.error(`Error fetching comments for project ${projectId}:`, error);
    return [];
  }
};

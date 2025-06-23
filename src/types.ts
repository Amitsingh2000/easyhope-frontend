export interface User {
  token: any;
  id: number;
  name: string;
  email: string;
  image?: string;
  role:string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  goalAmount: number;
  raisedAmount: number;
  category: string;
  creatorId: number;
  creatorName: string;
  creatorImage?: string;
  images?: string;
  status: 'pending' | 'approved' | 'completed' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface Donation {
  id: number;
  projectId: number;
  projectTitle: string;
  userId: number;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  createdAt: string;
}

export interface Comment {
  id: number;
  text: string;
  userId:number;
  projectId:number;
  userName: string;
  profileImage:string;
}

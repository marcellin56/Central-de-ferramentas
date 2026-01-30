export type ToolStatus = 'active' | 'maintenance' | 'beta' | 'coming_soon';
export type ToolType = 'iframe' | 'redirect';

export interface Tool {
  id: string;
  name: string;
  description: string;
  url: string;
  icon: string;
  image?: string; // New field for preview image
  category: string;
  type: ToolType;
  status: ToolStatus;
  isFavorite?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  avatar: string;
}

export interface Category {
  id: string;
  label: string;
}

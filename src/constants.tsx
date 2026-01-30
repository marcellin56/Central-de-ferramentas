import { Tool, User, Category } from './types';
import { 
  Calculator,
  PlusCircle,
  BarChart3, 
  Users, 
  Mail, 
  FileText, 
  Settings, 
  Cloud, 
  Database, 
  Shield, 
  CreditCard, 
  MessageSquare 
} from 'lucide-react';

export const CURRENT_USER: User = {
  id: 'u1',
  name: 'Alex Mercer',
  email: 'alex.mercer@nexushub.com',
  role: 'admin',
  avatar: 'https://picsum.photos/100/100',
};

export const CATEGORIES: Category[] = [
  { id: 'all', label: 'Todos' },
];

export const MOCK_TOOLS: Tool[] = [
  {
    id: '1',
    name: 'Calculadora Cashback',
    description: 'Ferramenta avançada para cálculo e projeção de retornos de cashback.',
    url: 'https://calculadora-cashback.vercel.app/',
    icon: 'Calculator',
    image: 'https://i.imgur.com/1C8pyQq.png',
    category: 'finance',
    type: 'iframe',
    status: 'active',
  },
  {
    id: 'coming-soon',
    name: 'Em breve',
    description: 'Novas ferramentas estão sendo preparadas para integração.',
    url: '#',
    icon: 'PlusCircle',
    image: 'https://placehold.co/600x400/f1f5f9/94a3b8?text=Em+Breve',
    category: 'all',
    type: 'redirect',
    status: 'coming_soon',
  },
];

export const ICON_MAP: Record<string, any> = {
  Calculator,
  PlusCircle,
  BarChart3,
  Users,
  Mail,
  FileText,
  Settings,
  Cloud,
  Database,
  Shield,
  CreditCard,
  MessageSquare
};
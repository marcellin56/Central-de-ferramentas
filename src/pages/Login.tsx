import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { LayoutGrid, ArrowRight } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onLogin(); // Update parent state if needed
      navigate('/dashboard'); // Go to dashboard
    }, 1000);
  };

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans">
      
      <div className="m-auto w-full max-w-md bg-white p-8 md:p-12 rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100">
        
        <div className="text-center mb-10">
            <div className="w-14 h-14 bg-brand-500 rounded-2xl flex items-center justify-center text-white mx-auto shadow-lg shadow-brand-500/30 mb-5">
                <LayoutGrid size={28} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">NexusHub</h1>
            <p className="text-slate-500 text-sm mt-2">Centralize sua produtividade.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
            <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Email Corporativo</label>
                <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all font-medium"
                    placeholder="voce@empresa.com"
                />
            </div>

            <div>
                 <div className="flex justify-between items-center mb-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">Senha</label>
                    <a href="#" className="text-xs text-brand-600 hover:text-brand-700 font-bold hover:underline">Esqueceu?</a>
                 </div>
                <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all font-medium"
                    placeholder="••••••••"
                />
            </div>

            <Button type="submit" className="w-full py-3.5 mt-4 rounded-xl shadow-lg shadow-brand-500/25" isLoading={isLoading}>
                Entrar na Central <ArrowRight size={16} className="ml-2" />
            </Button>
        </form>

        <div className="mt-8 pt-8 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-400 leading-relaxed">
                Acesso restrito a colaboradores autorizados.
                <br/>&copy; 2024 NexusHub Enterprise.
            </p>
        </div>
      </div>
    </div>
  );
};
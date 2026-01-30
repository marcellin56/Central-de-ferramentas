import React, { useState, useMemo, useEffect } from 'react';
import { Tool, User } from '../types';
import { MOCK_TOOLS, CATEGORIES, ICON_MAP } from '../constants';
import { ToolCard } from '../components/ToolCard';
import { Search, LayoutGrid, X, ExternalLink, RefreshCw, AlertCircle, Sparkles, Bell, Moon, Sun, Plus, Save, Globe } from 'lucide-react';
import { Button } from '../components/ui/Button';

interface DashboardProps {
  user: User;
}

export const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [activeTool, setActiveTool] = useState<Tool | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [iframeKey, setIframeKey] = useState(0); 
  const [isToolLoading, setIsToolLoading] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const [customTools, setCustomTools] = useState<Tool[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newToolForm, setNewToolForm] = useState({ name: '', url: '', description: '' });

  useEffect(() => {
    const savedTools = localStorage.getItem('nexus_custom_tools');
    if (savedTools) {
        try {
            setCustomTools(JSON.parse(savedTools));
        } catch (e) {
            console.error("Failed to parse custom tools", e);
        }
    }
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
    );
  };

  const allTools = useMemo(() => {
      return [...customTools, ...MOCK_TOOLS];
  }, [customTools]);

  const filteredTools = useMemo(() => {
    return allTools.filter(tool => {
      const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            tool.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory || tool.category === 'all';
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, allTools]);

  const handleOpenTool = (tool: Tool) => {
    if (tool.status === 'coming_soon') return;
    setIsToolLoading(true);
    setIframeKey(prev => prev + 1);
    setActiveTool(tool);
  };

  const closeTool = () => {
    setActiveTool(null);
  };

  const handleSaveTool = (e: React.FormEvent) => {
      e.preventDefault();
      
      const newTool: Tool = {
          id: `custom-${Date.now()}`,
          name: newToolForm.name,
          description: newToolForm.description || 'Ferramenta personalizada adicionada pelo usuário.',
          url: newToolForm.url.startsWith('http') ? newToolForm.url : `https://${newToolForm.url}`,
          category: 'all',
          type: 'iframe', 
          status: 'active',
          icon: 'Globe',
          image: `https://placehold.co/600x400/1e293b/FFF?text=${encodeURIComponent(newToolForm.name.substring(0,2).toUpperCase())}`, 
      };

      const updatedTools = [newTool, ...customTools];
      setCustomTools(updatedTools);
      localStorage.setItem('nexus_custom_tools', JSON.stringify(updatedTools));
      
      setNewToolForm({ name: '', url: '', description: '' });
      setIsAddModalOpen(false);
  };

  const AddToolModal = () => {
      if (!isAddModalOpen) return null;

      return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsAddModalOpen(false)}></div>
            
            <div className="relative bg-white dark:bg-slate-800 w-full max-w-md rounded-3xl shadow-2xl border border-white/20 p-8 animate-slide-up">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Adicionar Ferramenta</h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Insira o link da aplicação web.</p>
                    </div>
                    <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
                        <X size={20} className="text-slate-500" />
                    </button>
                </div>

                <form onSubmit={handleSaveTool} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-2">Nome da Aplicação</label>
                        <input 
                            required
                            type="text" 
                            placeholder="Ex: Painel de Vendas"
                            value={newToolForm.name}
                            onChange={e => setNewToolForm({...newToolForm, name: e.target.value})}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-2">URL (Link Web)</label>
                        <div className="relative">
                            <Globe size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input 
                                required
                                type="text" 
                                placeholder="https://..."
                                value={newToolForm.url}
                                onChange={e => setNewToolForm({...newToolForm, url: e.target.value})}
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-white"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-2">Descrição (Opcional)</label>
                        <textarea 
                            rows={3}
                            placeholder="Para que serve esta ferramenta?"
                            value={newToolForm.description}
                            onChange={e => setNewToolForm({...newToolForm, description: e.target.value})}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-white resize-none"
                        />
                    </div>

                    <div className="pt-4 flex gap-3">
                        <Button type="button" variant="ghost" className="flex-1" onClick={() => setIsAddModalOpen(false)}>Cancelar</Button>
                        <Button type="submit" className="flex-1 shadow-lg shadow-brand-500/20">
                            <Save size={16} className="mr-2" /> Salvar Ferramenta
                        </Button>
                    </div>
                </form>
            </div>
        </div>
      );
  };

  const ExpandedToolView = () => {
    if (!activeTool) return null;
    const Icon = ICON_MAP[activeTool.icon] || Globe;

    return (
      <div className="fixed inset-0 z-[100] flex flex-col animate-fade-in">
         <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={closeTool}></div>

        <div className="relative flex-1 flex flex-col bg-white/95 dark:bg-slate-900/95 w-full h-full animate-slide-up shadow-2xl transition-colors duration-300">
            <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 md:px-8 py-3 flex items-center justify-between shadow-sm z-20 h-18">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-brand-400 to-brand-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-brand-500/20 ring-4 ring-brand-50 dark:ring-brand-900/30">
                        <Icon size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-none">{activeTool.name}</h2>
                        <div className="flex items-center gap-2 mt-1.5">
                            <span className="flex h-2 w-2 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
                            </span>
                            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Conexão Segura Estabelecida</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => {
                            setIsToolLoading(true);
                            setIframeKey(k => k + 1);
                        }}
                        title="Recarregar Frame"
                        className="text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400"
                    >
                        <RefreshCw size={20} />
                    </Button>
                    
                    <Button 
                        variant="secondary" 
                        size="sm" 
                        onClick={() => window.open(activeTool.url, '_blank')}
                        title="Abrir em Nova Janela"
                        className="hidden sm:flex dark:bg-slate-800 dark:text-white dark:border-slate-700 dark:hover:border-brand-500"
                    >
                        <ExternalLink size={18} className="mr-2"/> Abrir Externamente
                    </Button>
                    
                    <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-2"></div>
                    
                    <button 
                        onClick={closeTool}
                        className="group flex items-center gap-2 pl-2 pr-4 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 transition-colors border border-transparent hover:border-red-100 dark:hover:border-red-900/30"
                    >
                        <div className="bg-slate-100 dark:bg-slate-800 group-hover:bg-red-200 dark:group-hover:bg-red-900/50 group-hover:text-red-600 text-slate-500 dark:text-slate-400 rounded-full p-1 transition-colors">
                            <X size={16} />
                        </div>
                        <span className="text-sm font-bold">Encerrar</span>
                    </button>
                </div>
            </div>

            <div className="flex-1 relative w-full h-full bg-slate-50 dark:bg-black overflow-hidden">
                {isToolLoading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white dark:bg-slate-900 z-10 transition-colors duration-300">
                        <div className="relative w-16 h-16">
                             <div className="absolute top-0 left-0 w-full h-full border-4 border-slate-100 dark:border-slate-800 rounded-full"></div>
                             <div className="absolute top-0 left-0 w-full h-full border-4 border-brand-500 rounded-full animate-spin border-t-transparent"></div>
                        </div>
                        <p className="text-slate-500 dark:text-slate-300 font-bold mt-4 animate-pulse">Inicializando aplicação...</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Aguardando resposta do servidor</p>
                    </div>
                )}
                
                <iframe 
                    key={iframeKey}
                    src={activeTool.url} 
                    className="w-full h-full border-0"
                    title={activeTool.name}
                    sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals"
                    onLoad={() => setIsToolLoading(false)}
                    onError={() => setIsToolLoading(false)}
                />
            </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0f172a] flex flex-col font-sans text-slate-600 dark:text-slate-300 relative overflow-x-hidden transition-colors duration-500">
      
      <AddToolModal />

      <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand-200/40 dark:bg-brand-900/20 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen opacity-70 animate-pulse transition-all duration-1000"></div>
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-200/40 dark:bg-blue-900/20 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen opacity-70 transition-all duration-1000"></div>
      </div>

      {activeTool && <ExpandedToolView />}

      <header className="fixed top-6 left-0 right-0 z-40 flex justify-center px-4 sm:px-6 pointer-events-none">
        <div className="pointer-events-auto w-full max-w-7xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/50 dark:border-slate-700/50 shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)] rounded-full h-[5rem] flex items-center justify-between pl-3 pr-3 sm:pl-6 sm:pr-4 transition-all duration-500 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:bg-white/90 dark:hover:bg-slate-800/90">
            
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-3 group cursor-pointer pl-2">
                    <div className="w-11 h-11 bg-gradient-to-tr from-brand-400 to-brand-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-brand-500/30 transform group-hover:rotate-12 transition-transform duration-500">
                        <LayoutGrid size={22} strokeWidth={2.5} />
                    </div>
                    <div className="hidden md:block">
                        <span className="block font-bold text-slate-900 dark:text-white text-lg leading-none tracking-tight">NexusHub</span>
                    </div>
                </div>

                <div className="hidden md:block h-8 w-px bg-slate-200/60 dark:bg-slate-700/60"></div>

                <nav className="hidden md:flex items-center gap-1">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wide transition-all duration-300 ${
                                selectedCategory === cat.id 
                                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md' 
                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-700/50'
                            }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </nav>
            </div>

            <div className="flex items-center gap-4">
                <div className="hidden lg:flex relative group">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-brand-500 transition-colors" size={18} />
                    <input 
                        type="text" 
                        placeholder="Buscar..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-5 py-2.5 bg-slate-100/50 dark:bg-slate-900/50 border border-transparent focus:bg-white dark:focus:bg-slate-900 focus:border-brand-300 focus:ring-4 focus:ring-brand-500/10 rounded-full text-sm w-32 xl:w-56 transition-all outline-none text-slate-800 dark:text-white"
                    />
                </div>

                <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-full shadow-lg shadow-brand-500/20 transition-all transform active:scale-95"
                    title="Adicionar Nova Ferramenta"
                >
                    <Plus size={18} strokeWidth={3} />
                    <span className="hidden sm:inline font-bold text-xs uppercase tracking-wide">Novo</span>
                </button>

                <button 
                    onClick={toggleTheme}
                    className="p-2.5 text-slate-400 dark:text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-slate-700/50 rounded-full transition-colors"
                >
                    {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </button>

                <div className="flex items-center gap-3 pl-2 sm:pl-4 sm:border-l sm:border-slate-200/60 dark:sm:border-slate-700/60">
                    <div className="relative group cursor-pointer">
                        <img src={user.avatar} alt="User" className="w-11 h-11 rounded-full bg-slate-200 object-cover ring-4 ring-white dark:ring-slate-700 shadow-md transition-transform group-hover:scale-105" />
                        <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-brand-500 border-2 border-white dark:border-slate-800 rounded-full"></span>
                    </div>
                </div>
            </div>
        </div>
      </header>

      <main className="relative flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-40 pb-12 z-10">
        
        <div className="mb-12 flex flex-col items-center justify-center text-center gap-4">
            <div>
                 <div className="flex items-center justify-center gap-2 mb-3">
                    <span className="w-8 h-1 bg-gradient-to-r from-brand-400 to-brand-600 rounded-full"></span>
                    <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">Espaço de Trabalho</span>
                    <span className="w-8 h-1 bg-gradient-to-l from-brand-400 to-brand-600 rounded-full"></span>
                 </div>
                <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
                    Central de Ferramentas Web
                </h1>
                <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-lg">
                    Sua plataforma totalmente WEB para acessar aplicações integradas em um único ambiente seguro e otimizado.
                </p>
            </div>
        </div>

        {favorites.length > 0 && searchQuery === '' && selectedCategory === 'all' && (
            <div className="mb-14 animate-slide-up">
                <div className="flex items-center justify-center gap-3 mb-6">
                    <div className="bg-amber-100/50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 p-2 rounded-xl border border-amber-200/50 dark:border-amber-700/50 backdrop-blur-sm">
                        <Sparkles size={16} fill="currentColor" className="text-amber-500" /> 
                    </div>
                    <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Acesso Rápido</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                     {allTools.filter(t => favorites.includes(t.id)).map(tool => (
                        <ToolCard 
                            key={tool.id} 
                            tool={tool} 
                            isFavorite={true}
                            onToggleFavorite={toggleFavorite}
                            onOpen={handleOpenTool}
                        />
                     ))}
                </div>
                <div className="h-px bg-gradient-to-r from-transparent via-slate-300/50 dark:via-slate-700/50 to-transparent w-full mt-12"></div>
            </div>
        )}

        <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
             {favorites.length > 0 && searchQuery === '' && (
                 <h2 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-8 flex items-center justify-center gap-3">
                    <div className="p-1.5 bg-slate-200/50 dark:bg-slate-800/50 rounded-lg"><LayoutGrid size={14} /></div>
                    Catálogo de Aplicações
                </h2>
             )}

            {filteredTools.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {filteredTools.map(tool => (
                        <ToolCard 
                            key={tool.id} 
                            tool={tool} 
                            isFavorite={favorites.includes(tool.id)}
                            onToggleFavorite={toggleFavorite}
                            onOpen={handleOpenTool}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-24 bg-white/40 dark:bg-slate-800/40 backdrop-blur-md rounded-[2rem] border border-white/60 dark:border-slate-700/50 shadow-xl mx-auto max-w-2xl">
                    <div className="bg-slate-50/80 dark:bg-slate-900/80 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner dark:shadow-none dark:ring-1 dark:ring-white/10">
                        <AlertCircle size={40} className="text-slate-300 dark:text-slate-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Nada encontrado</h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-8">Não encontramos ferramentas com o termo "{searchQuery}".</p>
                    <Button 
                        variant="ghost" 
                        size="md" 
                        className="text-brand-600 bg-brand-50/50 hover:bg-brand-100 hover:text-brand-700 dark:bg-brand-900/30 dark:text-brand-400 dark:hover:bg-brand-900/50 px-8 rounded-xl"
                        onClick={() => {setSearchQuery(''); setSelectedCategory('all');}}
                    >
                        Limpar Filtros de Busca
                    </Button>
                </div>
            )}
        </div>
      </main>

      <footer className="py-10 border-t border-white/50 dark:border-slate-700/50 bg-white/40 dark:bg-slate-800/40 backdrop-blur-md mt-auto relative z-10 transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-xs text-slate-400 dark:text-slate-500 font-medium">
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-brand-500 rounded-full shadow-[0_0_10px_#13DA87]"></div>
                <p>&copy; 2024 NexusHub Enterprise System. v2.0</p>
            </div>
            <div className="flex gap-8 mt-4 md:mt-0">
                <a href="#" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Termos de Uso</a>
                <a href="#" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Privacidade</a>
                <a href="#" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Suporte</a>
            </div>
        </div>
      </footer>

    </div>
  );
};
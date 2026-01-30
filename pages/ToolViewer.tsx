import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_TOOLS, ICON_MAP } from '../constants.tsx';
import { Button } from '../components/ui/Button.tsx';
import { ArrowLeft, ExternalLink, RefreshCw, AlertCircle } from 'lucide-react';

export const ToolViewer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [showFallback, setShowFallback] = useState(false);

  // Find the tool
  const tool = MOCK_TOOLS.find((t) => t.id === id);

  useEffect(() => {
    if (!tool) return;
    setIsLoading(true);
    setLoadError(false);
    setShowFallback(false);

    // Simulate potential loading issues or CSP blocks handled via timeout
    // In a real app, this is hard to detect cross-origin, so we often rely on user feedback
    const timer = setTimeout(() => {
        setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [tool]);

  if (!tool) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h2 className="text-xl font-bold text-slate-900">Tool not found</h2>
          <Button variant="secondary" onClick={() => navigate('/dashboard')} className="mt-4">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const Icon = ICON_MAP[tool.icon] || ICON_MAP['Database'];

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden">
      {/* Header */}
      <header className="flex-none bg-white border-b border-slate-200 px-6 py-3 shadow-sm z-10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/dashboard')}
            className="p-2 -ml-2 rounded-full text-slate-500 hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Icon size={20} />
            </div>
            <div>
              <h1 className="text-base font-semibold text-slate-900 leading-tight">{tool.name}</h1>
              <p className="text-xs text-slate-500">Running via NexusHub Secure View</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
            <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                    setIsLoading(true);
                    setLoadError(false);
                    const iframe = document.getElementById('tool-frame') as HTMLIFrameElement;
                    if(iframe) iframe.src = iframe.src;
                }}
                title="Reload Frame"
            >
                <RefreshCw size={16} />
            </Button>
          <Button 
            variant="secondary" 
            size="sm"
            onClick={() => window.open(tool.url, '_blank', 'noopener,noreferrer')}
            className="hidden sm:flex"
          >
            Open in New Tab <ExternalLink size={14} className="ml-2" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative w-full h-full bg-slate-100">
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-slate-500 font-medium animate-pulse">Establishing secure connection...</p>
          </div>
        )}

        {loadError ? (
           <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-20 p-6 text-center">
             <AlertCircle size={48} className="text-red-400 mb-4" />
             <h3 className="text-lg font-semibold text-slate-900">Connection Interrupted</h3>
             <p className="text-slate-500 max-w-md mt-2 mb-6">
               The tool refused the connection or is taking too long to respond. This often happens due to security policies (CSP) of the external tool.
             </p>
             <Button onClick={() => window.open(tool.url, '_blank', 'noopener,noreferrer')}>
               Open in New Window
             </Button>
           </div>
        ) : (
            <iframe
            id="tool-frame"
            src={tool.url}
            title={tool.name}
            className="w-full h-full border-0"
            onLoad={() => setIsLoading(false)}
            onError={() => setLoadError(true)}
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
            />
        )}
      </main>
    </div>
  );
};
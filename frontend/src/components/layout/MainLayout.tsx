import React from 'react';
import { Button } from '../ui/button';

interface MainLayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: any) => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, currentPage, onNavigate }) => {
  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <span 
              className="text-xl font-bold tracking-tight text-primary cursor-pointer"
              onClick={() => onNavigate('dashboard')}
            >
              Nubank Manager
            </span>
          </div>
          <nav className="flex items-center space-x-2">
            <Button 
              variant={currentPage === 'dashboard' ? 'secondary' : 'ghost'} 
              size="sm"
              onClick={() => onNavigate('dashboard')}
            >
              Dashboard
            </Button>
            <Button 
              variant={currentPage === 'import' ? 'secondary' : 'ghost'} 
              size="sm"
              onClick={() => onNavigate('import')}
            >
              Importar
            </Button>
            <Button 
              variant={currentPage === 'management' ? 'secondary' : 'ghost'} 
              size="sm"
              onClick={() => onNavigate('management')}
            >
              Gestão
            </Button>
          </nav>
        </div>
      </header>
      <main className="container py-8">
        {children}
      </main>
    </div>
  );
};

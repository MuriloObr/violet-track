import React from 'react';

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-primary">Nubank Manager</span>
          </div>
          <nav className="flex items-center space-x-4">
            {/* Nav items could go here */}
          </nav>
        </div>
      </header>
      <main className="container py-8">
        {children}
      </main>
    </div>
  );
};

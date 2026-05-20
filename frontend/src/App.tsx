import { useState } from 'react';
import './index.css';
import { MainLayout } from './components/layout/MainLayout';
import { Dashboard } from './pages/Dashboard';
import { Import } from './pages/Import';

type Page = 'dashboard' | 'import';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  return (
    <MainLayout>
      {currentPage === 'dashboard' ? (
        <Dashboard onAddClick={() => setCurrentPage('import')} />
      ) : (
        <Import 
          onBack={() => setCurrentPage('dashboard')} 
          onSuccess={() => setCurrentPage('dashboard')} 
        />
      )}
    </MainLayout>
  );
}

export default App;

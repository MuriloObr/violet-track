import { useState } from 'react';
import './index.css';
import { MainLayout } from './components/layout/MainLayout';
import { Dashboard } from './pages/Dashboard';
import { Import } from './pages/Import';
import { Management } from './pages/Management';

type Page = 'dashboard' | 'import' | 'management';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  return (
    <MainLayout onNavigate={setCurrentPage} currentPage={currentPage}>
      {currentPage === 'dashboard' ? (
        <Dashboard onAddClick={() => setCurrentPage('import')} />
      ) : currentPage === 'import' ? (
        <Import 
          onBack={() => setCurrentPage('dashboard')} 
          onSuccess={() => setCurrentPage('dashboard')} 
        />
      ) : (
        <Management />
      )}
    </MainLayout>
  );
}

export default App;

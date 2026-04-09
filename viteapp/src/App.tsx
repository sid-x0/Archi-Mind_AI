import { useState } from 'react';
import './App.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationsProvider } from './context/NotificationsContext';
import { BuildingProvider } from './context/BuildingContext';
import { TopNav, type Page } from './components/layout/TopNav';
import { LeftSidebar } from './components/layout/LeftSidebar';
import { ChatPanel } from './components/chat/ChatPanel';
import { BuildingVisualizer } from './components/visualizer/BuildingVisualizer';
import { StatsPanel } from './components/stats/StatsPanel';
import { ModelsPage } from './components/pages/ModelsPage';
import { DatasetsPage } from './components/pages/DatasetsPage';
import { SimulationsPage } from './components/pages/SimulationsPage';
import { ConfigurationModal } from './components/setup/ConfigurationModal';
import { LoginPage } from './components/auth/LoginPage';

function AppShell() {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isConfigured, setIsConfigured] = useState(false);

  if (loading) {
    return (
      <div style={{
        position: 'fixed', inset: 0, background: '#080810',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', gap: '1rem',
      }}>
        <div style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '0.06em', color: '#f1f5f9' }}>
          ARCHI-MIND <span style={{ color: '#06b6d4' }}>AI</span>
        </div>
        <div style={{ width: '120px', height: '2px', background: 'rgba(255,255,255,0.08)', borderRadius: '1px', overflow: 'hidden' }}>
          <div style={{ height: '100%', background: 'linear-gradient(90deg,#7c3aed,#06b6d4)', animation: 'slide 1.2s ease-in-out infinite', borderRadius: '1px' }} />
        </div>
        <style>{`@keyframes slide { 0%{width:0%;margin-left:0} 50%{width:80%;margin-left:10%} 100%{width:0%;margin-left:100%} }`}</style>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <BuildingProvider>
      <div className="app-container">
        {!isConfigured && <ConfigurationModal onComplete={() => setIsConfigured(true)} />}
        <TopNav currentPage={currentPage} onNavigate={setCurrentPage} />
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          <LeftSidebar />
          {currentPage === 'home' && (
            <>
              <ChatPanel />
              <BuildingVisualizer />
              <StatsPanel />
            </>
          )}
          {currentPage === 'models' && <ModelsPage />}
          {currentPage === 'datasets' && <DatasetsPage />}
          {currentPage === 'simulations' && <SimulationsPage />}
        </div>
      </div>
    </BuildingProvider>
  );
}

function App() {
  return (
    <ThemeProvider>
      <NotificationsProvider>
        <AuthProvider>
          <AppShell />
        </AuthProvider>
      </NotificationsProvider>
    </ThemeProvider>
  );
}

export default App;

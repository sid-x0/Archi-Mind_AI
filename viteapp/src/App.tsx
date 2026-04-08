import { useState } from 'react';
import './App.css';
import { BuildingProvider } from './context/BuildingContext';
import { TopNav, type Page } from './components/layout/TopNav';
import { LeftSidebar } from './components/layout/LeftSidebar';
import { ChatPanel } from './components/chat/ChatPanel';
import { BuildingVisualizer } from './components/visualizer/BuildingVisualizer';
import { StatsPanel } from './components/stats/StatsPanel';
import { ModelsPage } from './components/pages/ModelsPage';
import { DatasetsPage } from './components/pages/DatasetsPage';
import { SimulationsPage } from './components/pages/SimulationsPage';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  return (
    <BuildingProvider>
      <div className="app-container">
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

export default App;

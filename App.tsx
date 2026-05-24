import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy load pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profiles = lazy(() => import('./pages/Profiles'));
const JobTiers = lazy(() => import('./pages/JobTiers'));
const Organizations = lazy(() => import('./pages/Organizations'));
const DevelopmentHub = lazy(() => import('./pages/DevelopmentHub'));
const Login = lazy(() => import('./pages/Login'));
const InputData = lazy(() => import('./pages/InputData'));
const SelfRegistration = lazy(() => import('./pages/SelfRegistration'));
const CompetencyTest = lazy(() => import('./pages/CompetencyTest'));
const VerifyCompetency = lazy(() => import('./pages/VerifyCompetency'));

const LoadingFallback = () => (
  <div className="flex items-center justify-center h-full w-full">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  return (
    <HashRouter>
      <div className="flex h-screen bg-light-bg text-dark-text font-sans">
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Login route has no sidebar/header */}
            <Route path="/login" element={<Login />} />
            
            {/* Other routes have the main layout - PUBLIC BY DEFAULT */}
            <Route path="/*" element={
              <>
                <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
                <div className="flex-1 flex flex-col overflow-hidden w-full relative">
                  <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
                  {/* Overlay for mobile sidebar */}
                  {isSidebarOpen && (
                    <div 
                      className="fixed inset-0 bg-black/50 z-20 md:hidden" 
                      onClick={() => setIsSidebarOpen(false)}
                    />
                  )}
                  <main className="flex-1 overflow-x-hidden overflow-y-auto bg-light-bg p-4 md:p-8">
                    <Suspense fallback={<LoadingFallback />}>
                      <Routes>
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/profiles" element={<Profiles />} />
                        <Route path="/job-tiers" element={<JobTiers />} />
                        <Route path="/organizations" element={<Organizations />} />
                        <Route path="/development-hub" element={<DevelopmentHub />} />
                        
                        <Route path="/self-registration" element={<SelfRegistration />} />
                        
                        <Route path="/competency-test" element={<CompetencyTest />} />
                        
                        {/* Admin Routes */}
                        <Route path="/input-data" element={
                          <ProtectedRoute requireAdmin={true}>
                            <InputData />
                          </ProtectedRoute>
                        } />
                        <Route path="/verify-competency" element={
                          <ProtectedRoute requireAdmin={true}>
                            <VerifyCompetency />
                          </ProtectedRoute>
                        } />
                      </Routes>
                    </Suspense>
                  </main>
                </div>
              </>
            } />
          </Routes>
        </Suspense>
      </div>
    </HashRouter>
  );
};

export default App;
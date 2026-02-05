import { Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import QuotesListPage from './pages/QuotesListPage';
import QuoteDetailPage from './pages/QuoteDetailPage';
import IssuanceWizardPage from './pages/IssuanceWizardPage';
import PolicyDetailPage from './pages/PolicyDetailPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AppLayout } from './layouts/AppLayout';

function App() {
  return (
    <div className="app-shell bg-surface">
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/quotes" element={<QuotesListPage />} />
            <Route path="/quotes/:id" element={<QuoteDetailPage />} />
            <Route path="/issuance/:issuanceId" element={<IssuanceWizardPage />} />
            <Route path="/policies/:id" element={<PolicyDetailPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/quotes" replace />} />
      </Routes>
    </div>
  );
}

export default App;


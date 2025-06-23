import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute'; // ✅ Import ProtectedRoute
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import CreateProjectPage from './pages/CreateProjectPage';
import UserDashboardPage from './pages/UserDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ScrollToTop from './components/ScrollToTop';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ContactPage from './pages/ContactPage';
import TermsPage from './pages/TermsPage';
import CancellationRefund from './components/CancellationRefund';
function App() {
  return (
    <Router>
      <AuthProvider>
      <ScrollToTop/>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="/project/:id" element={<ProjectDetailPage />} />
              <Route path="/start-campaign" element={<CreateProjectPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/cancellation-refund" element={<CancellationRefund />} />

              {/* User Dashboard (Protected) */}
              <Route element={<ProtectedRoute requiredRole="USER" />}>
                <Route path="/dashboard" element={<UserDashboardPage />} />
              </Route>

              {/* Admin Dashboard (Protected) */}
              <Route element={<ProtectedRoute requiredRole="ADMIN" />}>
                <Route path="/admin" element={<AdminDashboardPage />} />
              </Route>
            </Routes>
          </main>
          <ToastContainer />
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;

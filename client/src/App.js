import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/js/Header';
import Landing from './pages/js/Landing';
import Main from './pages/js/Main';
import Create from './pages/js/Create';
import Preview from './pages/js/Preview';
import Order from './pages/js/Order';
import Orders from './pages/js/Orders';
import Login from './pages/js/Login';
import Register from './pages/js/Register';
import MyPage from './pages/js/MyPage';
import './App.css';
import './flowTheme.css';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
  const location = useLocation();
  const isLanding = location.pathname === '/';

  return (
    <>
      <Header />
      <main className={isLanding ? 'main-content main-content--landing' : 'main-content'}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/main" element={<PrivateRoute><Main /></PrivateRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/create" element={<PrivateRoute><Create /></PrivateRoute>} />
          <Route path="/mypage" element={<PrivateRoute><MyPage /></PrivateRoute>} />
          <Route path="/preview" element={<Preview />} />
          <Route path="/order" element={<Order />} />
          <Route path="/orders" element={<Orders />} />
        </Routes>
      </main>
    </>
  );
}

function App() {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID || ''}>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;

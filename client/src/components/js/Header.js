import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import '../css/Header.css';

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="logo">
          📚 SweetBook
        </Link>
        <nav className="nav">
          <Link to="/create" className={location.pathname === '/create' ? 'active' : ''}>
            가이드북 만들기
          </Link>
          <Link to="/orders" className={location.pathname === '/orders' ? 'active' : ''}>
            주문 내역
          </Link>
          {user ? (
            <div className="nav-user">
              <Link to="/mypage" className="nav-username">{user.name}</Link>
              <button className="btn-logout" onClick={handleLogout}>로그아웃</button>
            </div>
          ) : (
            <Link to="/login" className="btn-nav-login">로그인</Link>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;

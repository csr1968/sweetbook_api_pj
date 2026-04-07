import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import '../css/Header.css';

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isLanding = location.pathname === '/';
  const homePath = user ? '/main' : '/';

  const handleLogout = () => {
    navigate('/');
    setTimeout(logout, 0);
  };

  return (
    <header className={`header${isLanding ? ' header--landing' : ''}`}>
      <div className="header-inner">
        <Link to={homePath} className="logo">
          SweetBook
        </Link>
        {!isLanding && (
          <nav className="nav">
            {user && (
            <Link to="/orders" className={location.pathname === '/orders' ? 'active' : ''}>
              주문 내역
            </Link>
          )}
            {user ? (
              <div className="nav-user">
                <Link to="/mypage" className="nav-username">{user.name}</Link>
                <button type="button" className="btn-logout" onClick={handleLogout}>로그아웃</button>
              </div>
            ) : (
              <Link to="/login" className="btn-nav-login">로그인</Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}

export default Header;

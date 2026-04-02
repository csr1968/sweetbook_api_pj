import { Link, useLocation } from 'react-router-dom';
import './Header.css';

function Header() {
  const location = useLocation();

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
        </nav>
      </div>
    </header>
  );
}

export default Header;

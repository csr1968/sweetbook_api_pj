import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../contexts/AuthContext';
import '../css/Login.css';

function Login() {
  const { login, googleLogin, user, loading: authLoading } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && user) {
      navigate('/main', { replace: true });
    }
  }, [user, authLoading, navigate]);

  const [form, setForm]       = useState({ username: '', password: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.username, form.password);
      navigate('/main');
    } catch (err) {
      setError(err.response?.data?.error || '로그인에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError('');
    setLoading(true);
    try {
      await googleLogin(credentialResponse.credential);
      navigate('/main');
    } catch (err) {
      setError('Google 로그인에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-title">
          <span className="login-icon">📚</span>
          <h1>SweetBook</h1>
          <p>로그인 후 가이드북을 만들어보세요</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="아이디"
            autoComplete="username"
            required
          />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="비밀번호"
            autoComplete="current-password"
            required
          />
          {error && <p className="login-error">{error}</p>}
          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <div className="login-divider"><span>또는</span></div>

        <div className="google-btn-wrapper">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError('Google 로그인에 실패했습니다.')}
            width="100%"
            text="signin_with"
            locale="ko"
          />
        </div>

        <p className="login-register">
          계정이 없으신가요? <Link to="/register">회원가입</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import '../css/Login.css';
import '../css/Register.css';

function Register() {
  const { register, user, loading: authLoading } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && user) {
      navigate('/main', { replace: true });
    }
  }, [user, authLoading, navigate]);
  
  const [form, setForm] = useState({
    username: '', password: '', name: '',
    phone: '', postalCode: '', address1: '', address2: '',
  });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password || !form.name) {
      setError('아이디, 비밀번호, 이름은 필수입니다.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/main');
    } catch (err) {
      setError(err.response?.data?.error || '회원가입에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box register-box">
        <div className="login-title">
          <span className="login-icon">📚</span>
          <h1>회원가입</h1>
          <p>SweetBook에 오신 것을 환영합니다</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-section-label">계정 정보</div>
          <div className="register-row">
            <input name="username" value={form.username} onChange={handleChange} placeholder="아이디 *" required />
            <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="비밀번호 *" required />
          </div>
          <input name="name" value={form.name} onChange={handleChange} placeholder="이름 *" required />

          <div className="form-section-label">배송 정보 (선택)</div>
          <div className="register-row">
            <input name="phone" value={form.phone} onChange={handleChange} placeholder="연락처" />
            <input name="postalCode" value={form.postalCode} onChange={handleChange} placeholder="우편번호" />
          </div>
          <input name="address1" value={form.address1} onChange={handleChange} placeholder="도로명 주소" />
          <input name="address2" value={form.address2} onChange={handleChange} placeholder="상세 주소" />

          {error && <p className="login-error">{error}</p>}

          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? '가입 중...' : '회원가입'}
          </button>
        </form>

        <p className="login-register">
          이미 계정이 있으신가요? <Link to="/login">로그인</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;

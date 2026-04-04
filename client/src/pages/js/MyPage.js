import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import '../css/MyPage.css';

function MyPage() {
  const { user, updateUser } = useAuth();

  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    postalCode: user?.postalCode || '',
    address1: user?.address1 || '',
    address2: user?.address2 || '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setSuccess('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
    try {
      await updateUser(form);
      setSuccess('정보가 저장되었습니다.');
    } catch (err) {
      setError(err.response?.data?.error || '저장에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const isGoogleUser = !user?.username || user?.username?.includes('@');

  return (
    <div className="mypage-container">
      <div className="mypage-box">
        <h1 className="mypage-title">마이페이지</h1>

        {isGoogleUser && (
          <div className="mypage-badge">Google 계정으로 로그인됨</div>
        )}

        <form onSubmit={handleSubmit} className="mypage-form">
          <div className="form-group">
            <label>아이디</label>
            <input value={user?.username || '(소셜 로그인)'} disabled />
          </div>

          <div className="form-group">
            <label>이름 *</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="이름"
              required
            />
          </div>

          <div className="form-group">
            <label>전화번호</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="010-0000-0000"
            />
          </div>

          <div className="form-group">
            <label>우편번호</label>
            <input
              name="postalCode"
              value={form.postalCode}
              onChange={handleChange}
              placeholder="우편번호"
            />
          </div>

          <div className="form-group">
            <label>도로명 주소</label>
            <input
              name="address1"
              value={form.address1}
              onChange={handleChange}
              placeholder="도로명 주소"
            />
          </div>

          <div className="form-group">
            <label>상세 주소</label>
            <input
              name="address2"
              value={form.address2}
              onChange={handleChange}
              placeholder="상세 주소"
            />
          </div>

          {success && <p className="mypage-success">{success}</p>}
          {error && <p className="mypage-error">{error}</p>}

          <button type="submit" className="btn-save" disabled={loading}>
            {loading ? '저장 중...' : '저장하기'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default MyPage;

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import '../css/Landing.css';

const TRAVEL_IMAGES = [
  'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=80',
];

function Landing() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      navigate('/main', { replace: true });
    }
  }, [user, loading, navigate]);

  if (!loading && user) {
    return <div className="landing landing--redirecting" aria-busy="true" />;
  }

  if (loading) {
    return <div className="landing landing--loading" aria-busy="true" />;
  }

  const track = [...TRAVEL_IMAGES, ...TRAVEL_IMAGES];

  return (
    <div className="landing">
      <div className="landing-carousel" aria-hidden="true">
        <div className="landing-track">
          {track.map((src, i) => (
            <div key={`${src}-${i}`} className="landing-slide">
              <img src={src} alt="" loading={i < 2 ? 'eager' : 'lazy'} />
            </div>
          ))}
        </div>
        <div className="landing-scrim" />
      </div>

      <div className="landing-center">
        <p className="landing-kicker">Travel guidebook</p>
        <h1 className="landing-title">나만의 여행 가이드북</h1>
        <p className="landing-lead">
          사진과 이야기를 담아, 여행을 한 권의 책으로 남겨보세요.
        </p>
        <div className="landing-actions">
          <button
            type="button"
            className="landing-btn landing-btn-primary"
            onClick={() => navigate('/login')}
          >
            로그인
          </button>
          <button
            type="button"
            className="landing-btn landing-btn-secondary"
            onClick={() => navigate('/register')}
          >
            회원가입
          </button>
        </div>
      </div>
    </div>
  );
}

export default Landing;

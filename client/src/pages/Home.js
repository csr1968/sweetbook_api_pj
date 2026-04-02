import { useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home">
      <div className="hero">
        <h1>나만의 여행 가이드북</h1>
        <p className="hero-desc">
          여행 사진과 이야기를 업로드하면 AI가 멋진 가이드북을 만들어드려요.
          <br />
          소중한 여행을 책으로 간직하세요.
        </p>
        <button className="btn-primary btn-large" onClick={() => navigate('/create')}>
          가이드북 만들기
        </button>
      </div>

      <div className="steps">
        <div className="step">
          <div className="step-icon">📷</div>
          <h3>1. 사진 & 정보 입력</h3>
          <p>여행지, 날짜, 사진을 업로드하세요</p>
        </div>
        <div className="step-arrow">→</div>
        <div className="step">
          <div className="step-icon">✨</div>
          <h3>2. AI 콘텐츠 생성</h3>
          <p>AI가 여행 스토리를 자동으로 작성해줘요</p>
        </div>
        <div className="step-arrow">→</div>
        <div className="step">
          <div className="step-icon">📖</div>
          <h3>3. 가이드북 주문</h3>
          <p>실제 책으로 인쇄하여 받아보세요</p>
        </div>
      </div>
    </div>
  );
}

export default Home;

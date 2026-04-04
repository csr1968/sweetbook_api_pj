import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getStoredCoverId } from '../../coverStyles';
import '../css/Preview.css';

function Preview() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const hubPath = user ? '/main' : '/';

  if (!state?.content) {
    return (
      <div className="preview-empty">
        <p>생성된 가이드북이 없습니다.</p>
        <button type="button" className="btn-primary" onClick={() => navigate(hubPath)}>
          처음부터 만들기
        </button>
      </div>
    );
  }

  const { content, tripData, coverStyle: stateCover, uploadedPhotos = [] } = state;
  const coverStyle = stateCover || getStoredCoverId();
  const { title, subtitle, coverText, pages = [] } = content;

  const goOrder = () => {
    navigate('/order', { state: { content, tripData, coverStyle, uploadedPhotos } });
  };

  return (
    <div className="preview-page">
      <div className="preview-header">
        <h1 className="flow-page-title">가이드북 미리보기</h1>
        <div className="preview-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate(user ? '/main' : '/')}
          >
            표지 다시 고르기
          </button>
          <button type="button" className="btn-primary" onClick={goOrder}>
            주문하기 →
          </button>
        </div>
      </div>

      <div className={`book-cover book-cover--${coverStyle}`}>
        <div className="cover-badge">표지</div>
        <h2 className="cover-title">{title || '나의 여행 가이드북'}</h2>
        {subtitle && <p className="cover-subtitle">{subtitle}</p>}
        {coverText && <p className="cover-text">{coverText}</p>}
        <p className="cover-meta">{tripData?.destination} · {tripData?.dates}</p>
      </div>

      {uploadedPhotos.length > 0 && (
        <div className="photo-notice">
          📷 사진 {uploadedPhotos.length}장이 책에 포함됩니다
        </div>
      )}

      {pages.length > 0 && (
        <div className="pages-section">
          <h2 className="flow-page-title">내용 ({pages.length}페이지)</h2>
          <div className="pages-list">
            {pages.map((page, i) => (
              <div key={i} className="page-card flow-surface">
                <div className="page-num">P.{i + 1}</div>
                {page.title && <h3 className="page-title">{page.title}</h3>}
                <p className="page-content">{page.content}</p>
                {page.pageType && (
                  <span className="page-type-badge">{page.pageType}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="preview-footer">
        <button type="button" className="btn-primary btn-large" onClick={goOrder}>
          이 가이드북 주문하기 →
        </button>
      </div>
    </div>
  );
}

export default Preview;

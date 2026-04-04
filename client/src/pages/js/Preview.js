import { useLocation, useNavigate } from 'react-router-dom';
import '../css/Preview.css';

function Preview() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state?.content) {
    return (
      <div className="preview-empty">
        <p>생성된 가이드북이 없습니다.</p>
        <button className="btn-primary" onClick={() => navigate('/create')}>
          가이드북 만들기
        </button>
      </div>
    );
  }

  const { content, tripData } = state;
  const { title, subtitle, coverText, pages = [] } = content;

  return (
    <div className="preview-page">
      <div className="preview-header">
        <h1>가이드북 미리보기</h1>
        <div className="preview-actions">
          <button className="btn-secondary" onClick={() => navigate('/create')}>
            다시 만들기
          </button>
          <button
            className="btn-primary"
            onClick={() => navigate('/order', { state: { content, tripData } })}
          >
            주문하기 →
          </button>
        </div>
      </div>

      {/* 표지 */}
      <div className="book-cover">
        <div className="cover-badge">표지</div>
        <h2 className="cover-title">{title || '나의 여행 가이드북'}</h2>
        {subtitle && <p className="cover-subtitle">{subtitle}</p>}
        {coverText && <p className="cover-text">{coverText}</p>}
        <p className="cover-meta">{tripData?.destination} · {tripData?.dates}</p>
      </div>

      {/* 페이지들 */}
      {pages.length > 0 && (
        <div className="pages-section">
          <h2>내용 ({pages.length}페이지)</h2>
          <div className="pages-list">
            {pages.map((page, i) => (
              <div key={i} className="page-card">
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
        <button
          className="btn-primary btn-large"
          onClick={() => navigate('/order', { state: { content, tripData } })}
        >
          이 가이드북 주문하기 →
        </button>
      </div>
    </div>
  );
}

export default Preview;

import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  COVER_OPTIONS,
  COVER_STORAGE_KEY,
  COVER_PHOTO_STORAGE_KEY,
  COVER_THEMES,
  getCoverPhotosByTheme,
  getStoredCoverId,
  getStoredCoverPhotoId,
} from '../../coverStyles';
import '../css/Main.css';

function Main() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState('all');
  const [selectedCover, setSelectedCover] = useState(() => getStoredCoverId());
  const [selectedPhoto, setSelectedPhoto] = useState(() => getStoredCoverPhotoId());
  const photoSectionRef = useRef(null);

  const photoOptions = useMemo(() => getCoverPhotosByTheme(theme), [theme]);

  useEffect(() => {
    sessionStorage.setItem(COVER_STORAGE_KEY, selectedCover);
  }, [selectedCover]);

  useEffect(() => {
    sessionStorage.setItem(COVER_PHOTO_STORAGE_KEY, selectedPhoto);
  }, [selectedPhoto]);

  const handleSelectCover = (id) => {
    setSelectedCover(id);
    // 톤을 고르면 바로 사진 선택(선택사항)으로 자연스럽게 내려가기
    setTimeout(() => {
      photoSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const handleStart = () => {
    const cover = selectedCover;
    const photo = selectedPhoto || 'none';
    navigate(`/create?cover=${encodeURIComponent(cover)}&photo=${encodeURIComponent(photo)}`);
  };

  return (
    <div className="main-hub">
      <header className="main-hub-header">
        <h1>표지 디자인을 골라주세요</h1>
        <p className="main-hub-desc">
          마음에 드는 분위기를 선택하면 가이드북 내용 구성을 시작할 수 있어요.
        </p>
      </header>

      <div className="main-tabs" role="tablist" aria-label="여행 테마">
        {COVER_THEMES.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={theme === t.id}
            className={`main-tab${theme === t.id ? ' is-active' : ''}`}
            onClick={() => setTheme(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <section className="main-section">
        <div className="main-section-head">
          <h2>1) 톤(색감) 선택</h2>
          <p>전체 분위기를 먼저 고르고, 원하면 표지 사진을 더해보세요.</p>
        </div>

        <div className="cover-shelf cover-shelf--tone" aria-label="표지 톤">
          {COVER_OPTIONS.map((opt) => {
            const active = selectedCover === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                className={`cover-card${active ? ' is-selected' : ''}`}
                onClick={() => handleSelectCover(opt.id)}
                aria-pressed={active}
              >
                <div className="cover-card-spine" style={{ background: opt.thumb }} aria-hidden />
                <div className="cover-card-face" style={{ background: opt.thumb }}>
                  <span className="cover-card-gloss" />
                  <span className="cover-card-label">{opt.name}</span>
                  <span className="cover-card-sub">{opt.subtitle}</span>
                  {active && <span className="cover-card-check" aria-hidden>선택됨</span>}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="main-section" ref={photoSectionRef}>
        <div className="main-section-head">
          <h2>2) 표지 사진 (선택)</h2>
          <p>업로드는 나중에도 가능해요. 지금은 분위기만 고르고 넘어가도 됩니다.</p>
        </div>

        <div className="photo-grid" aria-label="표지 사진 선택">
          <button
            type="button"
            className={`photo-card photo-card--none${selectedPhoto === 'none' ? ' is-selected' : ''}`}
            onClick={() => setSelectedPhoto('none')}
            aria-pressed={selectedPhoto === 'none'}
          >
            <div className="photo-none">
              <span className="photo-none-title">사진 없이 진행</span>
              <span className="photo-none-sub">톤만 적용</span>
            </div>
          </button>

          {photoOptions.map((p) => {
            const active = selectedPhoto === p.id;
            return (
              <button
                key={p.id}
                type="button"
                className={`photo-card${active ? ' is-selected' : ''}`}
                onClick={() => setSelectedPhoto(p.id)}
                aria-pressed={active}
              >
                <img src={p.src} alt={p.name} loading="lazy" />
                <div className="photo-meta">
                  <span className="photo-name">{p.name}</span>
                </div>
                {active && <span className="photo-card-check" aria-hidden>선택됨</span>}
              </button>
            );
          })}
        </div>

        <div className="main-cta">
          <button type="button" className="btn-primary btn-large" onClick={handleStart}>
            가이드북 만들기 →
          </button>
        </div>
      </section>
    </div>
  );
}

export default Main;

import { useNavigate } from 'react-router-dom';
import { COVER_OPTIONS, COVER_STORAGE_KEY } from '../../coverStyles';
import '../css/Main.css';

function Main() {
  const navigate = useNavigate();

  const selectCover = (id) => {
    sessionStorage.setItem(COVER_STORAGE_KEY, id);
    navigate(`/create?cover=${id}`);
  };

  return (
    <div className="main-hub">
      <header className="main-hub-header">
        <h1>표지 디자인을 골라주세요</h1>
        <p className="main-hub-desc">
          마음에 드는 분위기를 선택하면 가이드북 내용 구성을 시작할 수 있어요.
        </p>
      </header>

      <div className="cover-shelf">
        {COVER_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            className="cover-card"
            onClick={() => selectCover(opt.id)}
          >
            <div
              className="cover-card-spine"
              style={{ background: opt.thumb }}
              aria-hidden
            />
            <div
              className="cover-card-face"
              style={{ background: opt.thumb }}
            >
              <span className="cover-card-gloss" />
              <span className="cover-card-label">{opt.name}</span>
              <span className="cover-card-sub">{opt.subtitle}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default Main;

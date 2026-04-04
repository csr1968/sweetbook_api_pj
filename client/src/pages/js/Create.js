import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { uploadPhotos, generateContent } from '../../services/api';
import { COVER_STORAGE_KEY, getStoredCoverId, isValidCoverId } from '../../coverStyles';
import '../css/Create.css';

function Create() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(1); // 1: 정보입력, 2: 생성중
  const [form, setForm] = useState({
    destination: '',
    dates: '',
    description: '',
    requirements: '',
  });
  const [photos, setPhotos] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const q = searchParams.get('cover');
    if (q && isValidCoverId(q)) {
      sessionStorage.setItem(COVER_STORAGE_KEY, q);
    }
  }, [searchParams]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    setPhotos(files);
    const urls = files.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.destination || !form.dates) {
      setError('여행지와 날짜는 필수입니다.');
      return;
    }
    setError('');
    setStep(2);

    try {
      // 1. 사진 업로드
      let uploadedPhotos = [];
      if (photos.length > 0) {
        const res = await uploadPhotos(photos);
        uploadedPhotos = res.data.files || [];
      }

      // 2. LLM 콘텐츠 생성
      const res = await generateContent({
        ...form,
        photos: uploadedPhotos,
      });

      // Preview 페이지로 이동 (생성된 콘텐츠 전달)
      const coverStyle = getStoredCoverId();
      navigate('/preview', { state: { content: res.data, tripData: form, coverStyle, uploadedPhotos } });
    } catch (err) {
      setError(err.response?.data?.error || '오류가 발생했습니다. 다시 시도해주세요.');
      setStep(1);
    }
  };

  if (step === 2) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <h2 className="flow-page-title">AI가 가이드북을 만들고 있어요...</h2>
        <p className="flow-page-desc">잠시만 기다려주세요 ✨</p>
      </div>
    );
  }

  return (
    <div className="create-page">
      <h1 className="flow-page-title">여행 가이드북 만들기</h1>
      <p className="page-desc flow-page-desc">여행 정보를 입력하면 AI가 가이드북 콘텐츠를 자동으로 작성해줘요.</p>

      <form onSubmit={handleSubmit} className="create-form flow-surface">
        <div className="form-group">
          <label>여행지 *</label>
          <input
            name="destination"
            value={form.destination}
            onChange={handleChange}
            placeholder="예: 도쿄, 파리, 제주도"
            required
          />
        </div>

        <div className="form-group">
          <label>여행 날짜 *</label>
          <input
            name="dates"
            value={form.dates}
            onChange={handleChange}
            placeholder="예: 2026-04-01 ~ 2026-04-07"
            required
          />
        </div>

        <div className="form-group">
          <label>여행 한 줄 소개</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="예: 봄 벚꽃을 보러 떠난 도쿄 여행"
            rows={3}
          />
        </div>

        <div className="form-group">
          <label>특별 요청사항</label>
          <textarea
            name="requirements"
            value={form.requirements}
            onChange={handleChange}
            placeholder="예: 맛집 위주로, 감성적인 문체로 작성해줘"
            rows={2}
          />
        </div>

        <div className="form-group">
          <label>사진 업로드 (선택, 최대 20장)</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handlePhotoChange}
            className="file-input"
          />
          {previews.length > 0 && (
            <div className="photo-preview-grid">
              {previews.map((url, i) => (
                <img key={i} src={url} alt={`preview-${i}`} />
              ))}
            </div>
          )}
        </div>

        {error && <p className="error-msg">{error}</p>}

        <button type="submit" className="btn-primary btn-large btn-full">
          가이드북 생성하기 ✨
        </button>
      </form>
    </div>
  );
}

export default Create;

import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createBook, estimateOrder, createOrder, getTemplates } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import '../css/Order.css';

function Order() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [shipping, setShipping] = useState({
    recipientName: user?.name || '',
    recipientPhone: user?.phone || '',
    postalCode: user?.postalCode || '',
    address1: user?.address1 || '',
    address2: user?.address2 || '',
  });
  const [status, setStatus] = useState('idle'); 
  const [templates, setTemplates] = useState({ cover: null, content: null });
  const [estimate, setEstimate] = useState(null);
  const [bookUid, setBookUid] = useState(null);
  const [orderResult, setOrderResult] = useState(null);
  const [error, setError] = useState('');

  // 템플릿 목록 자동 조회 (A4 소프트커버 기준)
  useEffect(() => {
    getTemplates()
      .then((res) => {
        const list = res.data?.data?.templates || [];
        const TARGET_SPEC = 'PHOTOBOOK_A4_SC';
        const coverTpl = list.find(
          (t) => t.templateKind === 'cover' && t.bookSpecUid === TARGET_SPEC
        );
        const contentTpl = list.find(
          (t) => t.templateKind === 'content' && t.bookSpecUid === TARGET_SPEC
        );
        if (coverTpl && contentTpl) {
          setTemplates({ cover: coverTpl.templateUid, content: contentTpl.templateUid });
        }
      })
      .catch(() => {});
  }, []);

  // bookUid 세팅 후 수량 변경 시 자동 재조회
  useEffect(() => {
    if (!bookUid) return;
    estimateOrder(bookUid, quantity)
      .then((res) => setEstimate(res.data))
      .catch(() => {});
  }, [bookUid, quantity]);

  if (!state?.content) {
    return (
      <div className="order-empty">
        <p>주문할 가이드북이 없습니다.</p>
        <button type="button" className="btn-primary" onClick={() => navigate(user ? '/main' : '/')}>
          가이드북 만들기
        </button>
      </div>
    );
  }

  const { content, tripData, uploadedPhotos = [] } = state;

  const handleShippingChange = (e) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  const handleEstimate = async () => {
    if (!templates.cover || !templates.content) {
      setError('템플릿 정보를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.');
      return;
    }
    setError('');
    setStatus('estimating');
    try {
      // 1. 책 생성
      const bookRes = await createBook({
        title: content.title || '나의 여행 가이드북',
        guidebookContent: content,
        tripData,
        uploadedPhotos,
        coverTemplateUid: templates.cover,
        contentTemplateUid: templates.content,
      });
      const createdBookUid = bookRes.data.bookUid;
      setBookUid(createdBookUid);

      // 2. 견적 조회
      const estRes = await estimateOrder(createdBookUid, quantity);
      setEstimate(estRes.data);
      setStatus('idle');
    } catch (err) {
      setError(err.response?.data?.error || '견적 조회에 실패했습니다.');
      setStatus('idle');
    }
  };

  const handleOrder = async () => {
    if (!shipping.recipientName.trim() || !shipping.recipientPhone.trim() || !shipping.postalCode.trim() || !shipping.address1.trim()) {
      setError('받는 분 이름, 연락처, 우편번호, 도로명 주소는 필수입니다.');
      return;
    }
    if (!bookUid) return;

    setError('');
    setStatus('ordering');
    try {
      const res = await createOrder(bookUid, quantity, shipping, content.title || '나의 여행 가이드북');
      setOrderResult(res.data);
      setStatus('done');
    } catch (err) {
      setError(err.response?.data?.error || '주문에 실패했습니다.');
      setStatus('idle');
    }
  };

  if (status === 'done' && orderResult) {
    return (
      <div className="order-done">
        <div className="done-icon">🎉</div>
        <h2 className="flow-page-title">주문이 완료되었습니다!</h2>
        <p>주문번호: <strong>{orderResult.orderUid || orderResult.uid || orderResult.id}</strong></p>
        <p className="done-desc">
          가이드북 인쇄가 시작되었습니다. 배송까지 영업일 기준 5~7일 소요됩니다.
        </p>
        <div className="done-actions">
          <button type="button" className="btn-secondary" onClick={() => navigate('/orders')}>
            주문 내역 보기
          </button>
          <button type="button" className="btn-primary" onClick={() => navigate(user ? '/main' : '/')}>
            새 가이드북 만들기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="order-page">
      <h1 className="flow-page-title">주문하기</h1>
      <p className="page-desc flow-page-desc">가이드북을 실제 책으로 인쇄하여 받아보세요.</p>

      <div className="order-summary flow-surface flow-accent-border">
        <h3>📖 {content.title || '나의 여행 가이드북'}</h3>
        <p>{tripData?.destination} · {tripData?.dates}</p>
        <p className="pages-count">{(content.pages || []).length}페이지</p>
      </div>

      <div className="order-form flow-surface">
        {/* 수량 */}
        <div className="form-group">
          <label>수량</label>
          <div className="quantity-control">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)}>+</button>
          </div>
        </div>

        {/* 배송 정보 */}
        <div className="form-section-title">배송 정보</div>

        <div className="form-row">
          <div className="form-group">
            <label>받는 분 이름 *</label>
            <input
              name="recipientName"
              value={shipping.recipientName}
              onChange={handleShippingChange}
              placeholder="홍길동"
            />
          </div>
          <div className="form-group">
            <label>연락처 *</label>
            <input
              name="recipientPhone"
              value={shipping.recipientPhone}
              onChange={handleShippingChange}
              placeholder="010-1234-5678"
            />
          </div>
        </div>

        <div className="form-group">
          <label>우편번호 *</label>
          <input
            name="postalCode"
            value={shipping.postalCode}
            onChange={handleShippingChange}
            placeholder="08504"
            style={{ maxWidth: 160 }}
          />
        </div>

        <div className="form-group">
          <label>도로명 주소 *</label>
          <input
            name="address1"
            value={shipping.address1}
            onChange={handleShippingChange}
            placeholder="서울특별시 금천구 서부샛길 123"
          />
        </div>

        <div className="form-group">
          <label>상세 주소</label>
          <input
            name="address2"
            value={shipping.address2}
            onChange={handleShippingChange}
            placeholder="210동 401호"
          />
        </div>

        {error && <p className="error-msg">{error}</p>}

        {!estimate ? (
          <button
            className="btn-primary btn-large"
            onClick={handleEstimate}
            disabled={status === 'estimating'}
          >
            {status === 'estimating' ? '책 생성 & 견적 조회 중...' : '가격 견적 조회'}
          </button>
        ) : (
          <div className="estimate-result">
            <div className="estimate-info flow-estimate-bg">
              <span>예상 금액</span>
              <strong>{estimate.totalAmount?.toLocaleString() || '—'}원</strong>
            </div>
            <button
              className="btn-primary btn-large"
              onClick={handleOrder}
              disabled={status === 'ordering'}
            >
              {status === 'ordering' ? '주문 처리 중...' : `${quantity}권 주문하기`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Order;

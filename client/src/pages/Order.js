import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createBook, estimateOrder, createOrder } from '../services/api';
import './Order.css';

function Order() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [address, setAddress] = useState('');
  const [status, setStatus] = useState('idle'); // idle | estimating | ordering | done
  const [estimate, setEstimate] = useState(null);
  const [orderResult, setOrderResult] = useState(null);
  const [error, setError] = useState('');

  if (!state?.content) {
    return (
      <div className="order-empty">
        <p>주문할 가이드북이 없습니다.</p>
        <button className="btn-primary" onClick={() => navigate('/create')}>
          가이드북 만들기
        </button>
      </div>
    );
  }

  const { content, tripData } = state;

  const handleEstimate = async () => {
    setError('');
    setStatus('estimating');
    try {
      // 먼저 책 생성
      const bookRes = await createBook({
        title: content.title,
        description: content.subtitle || '',
        content,
      });
      const bookUid = bookRes.data.uid;

      // 견적 조회
      const estRes = await estimateOrder(bookUid, quantity);
      setEstimate({ ...estRes.data, bookUid });
      setStatus('idle');
    } catch (err) {
      setError(err.response?.data?.error || '견적 조회에 실패했습니다.');
      setStatus('idle');
    }
  };

  const handleOrder = async () => {
    if (!address.trim()) {
      setError('배송 주소를 입력해주세요.');
      return;
    }
    if (!estimate?.bookUid) return;

    setError('');
    setStatus('ordering');
    try {
      const res = await createOrder(estimate.bookUid, quantity, address);
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
        <h2>주문이 완료되었습니다!</h2>
        <p>주문번호: <strong>{orderResult.uid || orderResult.id}</strong></p>
        <p className="done-desc">
          가이드북 인쇄가 시작되었습니다. 배송까지 영업일 기준 5~7일 소요됩니다.
        </p>
        <div className="done-actions">
          <button className="btn-secondary" onClick={() => navigate('/orders')}>
            주문 내역 보기
          </button>
          <button className="btn-primary" onClick={() => navigate('/create')}>
            새 가이드북 만들기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="order-page">
      <h1>주문하기</h1>
      <p className="page-desc">가이드북을 실제 책으로 인쇄하여 받아보세요.</p>

      {/* 가이드북 요약 */}
      <div className="order-summary">
        <h3>📖 {content.title || '나의 여행 가이드북'}</h3>
        <p>{tripData?.destination} · {tripData?.dates}</p>
        <p className="pages-count">{(content.pages || []).length}페이지</p>
      </div>

      <div className="order-form">
        <div className="form-group">
          <label>수량</label>
          <div className="quantity-control">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)}>+</button>
          </div>
        </div>

        <div className="form-group">
          <label>배송 주소</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="배송받을 주소를 입력해주세요"
            rows={3}
          />
        </div>

        {error && <p className="error-msg">{error}</p>}

        {!estimate ? (
          <button
            className="btn-primary btn-large"
            onClick={handleEstimate}
            disabled={status === 'estimating'}
          >
            {status === 'estimating' ? '견적 조회 중...' : '가격 견적 조회'}
          </button>
        ) : (
          <div className="estimate-result">
            <div className="estimate-info">
              <span>예상 금액</span>
              <strong>{estimate.totalPrice?.toLocaleString() || '—'}원</strong>
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

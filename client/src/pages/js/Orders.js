import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOrders } from '../../services/api';
import '../css/Orders.css';

function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

useEffect(() => {
    getOrders()
      .then((res) => setOrders(res.data.orders || res.data || []))
      .catch(() => setError('주문 내역을 불러오지 못했습니다.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="orders-loading">
        <div className="spinner" />
        <p>불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-header">
        <h1>주문 내역</h1>
        <button type="button" className="btn-primary" onClick={() => navigate('/main')}>
          새 가이드북 만들기
        </button>
      </div>

      {error && <p className="error-msg">{error}</p>}

      {orders.length === 0 ? (
        <div className="orders-empty">
          <p>아직 주문 내역이 없어요.</p>
          <button type="button" className="btn-primary" onClick={() => navigate('/main')}>
            첫 번째 가이드북 만들기
          </button>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order, i) => (
            <div key={order.orderUid || i} className="order-card">
              <div className="order-card-top">
                <span className="order-id">주문번호: {order.orderUid}</span>
                <span className={`order-status status-${order.orderStatus}`}>
                  {order.orderStatusDisplay || '처리중'}
                </span>
              </div>
              <div className="order-card-body">
                {order.externalRef && <p className="order-title">{order.externalRef}</p>}
                <p>수량: {order.itemCount || '—'}권</p>
                {order.totalAmount && (
                  <p>금액: {order.totalAmount.toLocaleString()}원</p>
                )}
                {order.createdAt && (
                  <p className="order-date">
                    {new Date(order.createdAt).toLocaleDateString('ko-KR')}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;

const express = require('express');
const router = express.Router();
const client = require('../services/sweetbookApi');

// GET /api/orders - 주문 목록 조회
router.get('/', async (req, res) => {
  const orders = await client.orders.list();
  res.json(orders);
});

// GET /api/orders/:orderUid - 특정 주문 조회
router.get('/:orderUid', async (req, res) => {
  const order = await client.orders.get(req.params.orderUid);
  res.json(order);
});

// POST /api/orders/estimate - 주문 견적 조회
// body: { bookUid, quantity, shippingCountry }
router.post('/estimate', async (req, res) => {
  const { bookUid, quantity = 1, shippingCountry = 'KR' } = req.body;

  if (!bookUid) {
    return res.status(400).json({ error: 'bookUid는 필수입니다.' });
  }

  const estimate = await client.orders.estimate({
    bookUid,
    quantity,
    shippingCountry,
  });
  res.json(estimate);
});

// POST /api/orders - 주문 생성
// body: { bookUid, quantity, recipientName, phone, address, shippingCountry }
router.post('/', async (req, res) => {
  const { bookUid, quantity = 1, recipientName, phone, address, shippingCountry = 'KR' } = req.body;

  if (!bookUid || !recipientName || !address) {
    return res.status(400).json({ error: 'bookUid, recipientName, address는 필수입니다.' });
  }

  const order = await client.orders.create({
    bookUid,
    quantity,
    shipping: { recipientName, phone, address, country: shippingCountry },
  });
  res.status(201).json(order);
});

// DELETE /api/orders/:orderUid - 주문 취소
router.delete('/:orderUid', async (req, res) => {
  await client.orders.cancel(req.params.orderUid);
  res.json({ message: '주문이 취소되었습니다.' });
});

module.exports = router;

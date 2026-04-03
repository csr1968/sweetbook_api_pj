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
// body: { items: [{ bookUid, quantity }] }
router.post('/estimate', async (req, res) => {
  const { items } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'items 배열은 필수입니다.' });
  }

  const estimate = await client.orders.estimate({ items });
  res.json(estimate);
});

// POST /api/orders - 주문 생성
// body: { items: [{ bookUid, quantity }], shipping: { recipientName, recipientPhone, postalCode, address1, address2 } }
router.post('/', async (req, res) => {
  const { items, shipping, externalRef } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'items 배열은 필수입니다.' });
  }
  if (!shipping || !shipping.recipientName || !shipping.recipientPhone || !shipping.postalCode || !shipping.address1) {
    return res.status(400).json({ error: 'recipientName, recipientPhone, postalCode, address1은 필수입니다.' });
  }

  const order = await client.orders.create({ items, shipping, externalRef });
  res.status(201).json(order);
});

// DELETE /api/orders/:orderUid - 주문 취소
router.delete('/:orderUid', async (req, res) => {
  await client.orders.cancel(req.params.orderUid);
  res.json({ message: '주문이 취소되었습니다.' });
});

module.exports = router;

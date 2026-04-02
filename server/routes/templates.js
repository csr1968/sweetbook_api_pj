const express = require('express');
const router = express.Router();

const BASE_URL =
  process.env.SWEETBOOK_ENV === 'sandbox'
    ? 'https://api-sandbox.sweetbook.com/v1'
    : 'https://api.sweetbook.com/v1';

// GET /api/templates - 템플릿 목록 (SDK에 없어서 직접 호출)
router.get('/', async (req, res) => {
  const response = await fetch(`${BASE_URL}/templates`, {
    headers: { Authorization: `Bearer ${process.env.SWEETBOOK_API_KEY}` },
  });
  const data = await response.json();
  res.status(response.status).json(data);
});

module.exports = router;

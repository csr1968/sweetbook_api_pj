const express = require('express');
const router = express.Router();
const { generateGuidebookContent } = require('../services/llmService');

// POST /api/llm/generate - 가이드북 콘텐츠 생성
router.post('/generate', async (req, res) => {
  const { destination, dates, description, photos, requirements } = req.body;

  if (!destination || !dates || !description) {
    return res.status(400).json({ error: 'destination, dates, description은 필수입니다.' });
  }

  const content = await generateGuidebookContent({ destination, dates, description, photos, requirements });
  res.json(content);
});

module.exports = router;

const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');

// POST /api/upload/photos - 사진 여러 장 업로드
router.post('/photos', upload.array('photos', 20), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: '업로드된 파일이 없습니다.' });
  }
  const files = req.files.map((f) => ({
    filename: f.filename,
    originalname: f.originalname,
    mimetype: f.mimetype,
    url: `/uploads/${f.filename}`,
    size: f.size,
  }));
  res.json({ files });
});

module.exports = router;

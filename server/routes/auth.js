const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const User = require('../models/User');
const { requireAuth } = require('../middleware/authMiddleware');

function signToken(user) {
  return jwt.sign(
    { id: user._id, username: user.username, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

function userProfile(user) {
  return {
    name: user.name,
    username: user.username,
    phone: user.phone,
    postalCode: user.postalCode,
    address1: user.address1,
    address2: user.address2,
  };
}

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { username, password, name, phone, postalCode, address1, address2 } = req.body;
  if (!username || !password || !name) {
    return res.status(400).json({ error: '아이디, 비밀번호, 이름은 필수입니다.' });
  }
  try {
    const existing = await User.findOne({ username });
    if (existing) return res.status(409).json({ error: '이미 사용 중인 아이디입니다.' });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, passwordHash, name, phone, postalCode, address1, address2 });
    res.status(201).json({ token: signToken(user), user: userProfile(user) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: '아이디와 비밀번호를 입력해주세요.' });
  try {
    const user = await User.findOne({ username });
    if (!user || !user.passwordHash) return res.status(401).json({ error: '아이디 또는 비밀번호가 올바르지 않습니다.' });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: '아이디 또는 비밀번호가 올바르지 않습니다.' });

    res.json({ token: signToken(user), user: userProfile(user) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/google
router.post('/google', async (req, res) => {
  const { credential } = req.body;
  if (!credential) return res.status(400).json({ error: 'credential이 필요합니다.' });
  try {
    const { data } = await axios.get(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`
    );
    if (data.aud !== process.env.GOOGLE_CLIENT_ID) {
      return res.status(401).json({ error: '유효하지 않은 Google 토큰입니다.' });
    }

    const { sub: googleId, name, email } = data;
    const googleName = name || email;
    let user = await User.findOne({ googleId });
    if (!user) {
      const username = email || googleId;
      user = await User.create({ googleId, name: googleName, username });
    } else if (!user.name && googleName) {
      user = await User.findByIdAndUpdate(user._id, { name: googleName }, { new: true });
    }
    res.json({ token: signToken(user), user: userProfile(user) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/auth/me
router.get('/me', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');
    if (!user) return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/auth/me
router.put('/me', requireAuth, async (req, res) => {
  const { name, phone, postalCode, address1, address2 } = req.body;
  if (!name) return res.status(400).json({ error: '이름은 필수입니다.' });
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone, postalCode, address1, address2 },
      { new: true }
    ).select('-passwordHash');
    if (!user) return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
    res.json({ user: userProfile(user) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

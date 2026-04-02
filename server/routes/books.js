const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const client = require('../services/sweetbookApi');

// GET /api/books - 책 목록 조회
router.get('/', async (req, res) => {
  const books = await client.books.list();
  res.json(books);
});

// GET /api/books/:bookUid - 특정 책 조회
router.get('/:bookUid', async (req, res) => {
  const book = await client.books.get(req.params.bookUid);
  res.json(book);
});

// POST /api/books/create - 가이드북 생성 (전체 플로우)
// body: { title, guidebookContent, uploadedPhotos, bookSpecUid }
router.post('/create', async (req, res) => {
  const { title, guidebookContent, uploadedPhotos = [], bookSpecUid = 'SQUAREBOOK_HC' } = req.body;

  if (!title || !guidebookContent) {
    return res.status(400).json({ error: 'title과 guidebookContent는 필수입니다.' });
  }

  // 1. 책 생성
  const book = await client.books.create({
    bookSpecUid,
    title,
    creationType: 'TEST',
  });

  // 2. 표지 생성
  await client.covers.create(book.bookUid, {
    title,
    subtitle: guidebookContent.subtitle || '',
    description: guidebookContent.coverText || '',
  });

  // 3. 사진 업로드 및 내지 콘텐츠 삽입
  const pages = [];

  // 텍스트 페이지들 추가
  if (guidebookContent.pages) {
    for (const page of guidebookContent.pages) {
      pages.push({
        type: 'text',
        title: page.title,
        body: page.content,
      });
    }
  }

  // 사진 페이지들 추가
  for (const photo of uploadedPhotos) {
    const filePath = path.join(__dirname, '../../uploads', photo.filename);
    if (fs.existsSync(filePath)) {
      const uploaded = await client.photos.upload(book.bookUid, filePath, {
        description: photo.originalname,
      });
      pages.push({ type: 'photo', photoUid: uploaded.photoUid });
    }
  }

  // 내지 삽입
  if (pages.length > 0) {
    await client.contents.insert(book.bookUid, { pages });
  }

  // 4. 책 최종화
  const finalized = await client.books.finalize(book.bookUid);

  res.status(201).json({ book: finalized, bookUid: book.bookUid });
});

// DELETE /api/books/:bookUid - 책 삭제
router.delete('/:bookUid', async (req, res) => {
  await client.books.delete(req.params.bookUid);
  res.json({ message: '삭제되었습니다.' });
});

module.exports = router;

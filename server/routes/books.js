const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const client = require('../services/sweetbookApi');

// 여행 날짜 문자열에서 연/월 파싱 (예: "2024-03-01~03-07", "2024-03-01 ~ 2024-03-07")
function parseTripDate(dates) {
  const now = new Date();
  const match = (dates || '').match(/(\d{4})[^\d](\d{1,2})/);
  const year = match ? match[1] : String(now.getFullYear());
  const month = match ? String(parseInt(match[2])) : String(now.getMonth() + 1);
  return { year, month };
}

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];
const MONTH_COLORS = {
  '12':'#FF5BA0D0','1':'#FF5BA0D0','2':'#FF5BA0D0',
  '3':'#FFFF8B95','4':'#FFFF8B95','5':'#FFFF8B95',
  '6':'#FF5CBFBF','7':'#FF5CBFBF','8':'#FF5CBFBF',
  '9':'#FFE5A86B','10':'#FFE5A86B','11':'#FFE5A86B',
};


const LINE_IMAGE_URL = 'https://picsum.photos/seed/line/4/400';

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
// body: { title, guidebookContent, tripData, uploadedPhotos, bookSpecUid, coverTemplateUid, contentTemplateUid }
router.post('/create', async (req, res) => {

  try {
  const {
    title,
    guidebookContent,
    tripData = {},
    uploadedPhotos = [],
    bookSpecUid = 'PHOTOBOOK_A4_SC',
    coverTemplateUid,
    contentTemplateUid,
  } = req.body;

  if (!title || !guidebookContent) {
    return res.status(400).json({ error: 'title과 guidebookContent는 필수입니다.' });
  }
  if (!coverTemplateUid || !contentTemplateUid) {
    return res.status(400).json({ error: 'coverTemplateUid와 contentTemplateUid는 필수입니다.' });
  }

  // 1. 책 생성
  const book = await client.books.create({
    bookSpecUid,
    title,
    creationType: 'TEST',
  });
  const bookUid = book.bookUid || book.uid;
  console.log('1. book created: ', bookUid);

  // 표지 사진 — 로컬 URL은 외부 API에서 접근 불가하므로 공개 이미지 사용
  const firstPhotoUrl = 'https://picsum.photos/seed/travel/800/600';

  // 2. 표지 생성 — 알림장A 표지 템플릿 파라미터로 매핑
  await client.covers.create(bookUid, coverTemplateUid, {
    childName: tripData.destination || title,
    schoolName: title,
    volumeLabel: 'Vol.1',
    periodText: tripData.dates || '',
    coverPhoto: firstPhotoUrl,
  });
  console.log('2. cover created');

  // 3. 내지 삽입 (텍스트 페이지) — 알림장 내지 템플릿으로 매핑
  const { year, month } = parseTripDate(tripData.dates);
  const monthNum = month.padStart(2, '0');

  console.log('pages count: ', guidebookContent?.pages?.length, JSON.stringify(guidebookContent?.pages?.[0]));
  if (guidebookContent.pages && guidebookContent.pages.length > 0) {
    for (let i = 0; i < guidebookContent.pages.length; i++) {
      const page = guidebookContent.pages[i];
      const pageDay = String(i + 1);
      await client.contents.insert(
        bookUid,
        contentTemplateUid,
        {
          year,
          month,
          monthNum,
          monthNameCapitalized: MONTH_NAMES[parseInt(month) - 1],
          monthColor: MONTH_COLORS[month] || '#FF5BA0D0',
          bookTitle: title,
          date: `${pageDay}일`,
          dayOfWeek: '월',
          dayOfWeekX: '210',
          hasTeacherComment: 'true',
          teacherComment: `${page.title ? '【' + page.title + '】\n\n' : ''}${page.content}`,
          lineVertical: LINE_IMAGE_URL,
        },
        { breakBefore: 'page' }
      );
    }
  }

  // 4. 사진 내지 삽입 (업로드된 사진들)
  for (const photo of uploadedPhotos) {
    const filePath = path.join(__dirname, '../../uploads', photo.filename);
    if (fs.existsSync(filePath)) {
      const fileBuffer = fs.readFileSync(filePath);
      const mimeType = photo.mimetype || 'image/jpeg';
      const fileObj = new File([fileBuffer], photo.originalname || photo.filename, { type: mimeType });
      console.log('photo upload attempt - name:', fileObj.name, 'size:', fileObj.size, 'type:', fileObj.type);
      const uploaded = await client.photos.upload(bookUid, fileObj);
      const photoUid = uploaded.photoUid || uploaded.uid;

      await client.contents.insert(
        bookUid,
        contentTemplateUid,
        {
          year,
          month,
          monthNum,
          monthNameCapitalized: MONTH_NAMES[parseInt(month) - 1],
          monthColor: MONTH_COLORS[month] || '#FF5BA0D0',
          bookTitle: title,
          date: '사진',
          dayOfWeek: '월',
          dayOfWeekX: '210',
          hasTeacherComment: 'false',
          lineVertical: LINE_IMAGE_URL,
          ...(photoUid && { photos: [photoUid] }),
        },
        { breakBefore: 'page' }
      );
    }
  }

  // 4.5. 최소 페이지(24p) 충족을 위한 빈 페이지 패딩
  const totalInserted = guidebookContent.pages.length + uploadedPhotos.length;
  const paddingNeeded = Math.max(0, 24 - totalInserted);
  for (let p = 0; p < paddingNeeded; p++) {
    await client.contents.insert(
      bookUid,
      contentTemplateUid,
      {
        year,
        month,
        monthNum,
        monthNameCapitalized: MONTH_NAMES[parseInt(month) - 1],
        monthColor: MONTH_COLORS[month] || '#FF5BA0D0',
        bookTitle: title,
        date: '',
        dayOfWeek: '',
        dayOfWeekX: '210',
        hasTeacherComment: 'false',
        lineVertical: LINE_IMAGE_URL,
      },
      { breakBefore: 'page' }
    );
  }

  // 5. 책 최종화
  console.log('4. finalizing..');
  const finalized = await client.books.finalize(bookUid);

  res.status(201).json({ book: finalized, bookUid });
  } catch (err) {
    console.error('Book create error: ', err.message);
    console.error('errorCode: ', err.errorCode);
    console.error('statusCode: ', err.statusCode);
    console.error('details: ', JSON.stringify(err.details));
    console.error('full err: ', JSON.stringify(err, Object.getOwnPropertyNames(err)));
    res.status(500).json({ error: err.message, details: err.details, errorCode: err.errorCode});
  }
});

// DELETE /api/books/:bookUid - 책 삭제
router.delete('/:bookUid', async (req, res) => {
  await client.books.delete(req.params.bookUid);
  res.json({ message: '삭제되었습니다.' });
});

module.exports = router;

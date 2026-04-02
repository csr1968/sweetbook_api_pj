const Groq = require('groq-sdk');

/**
 * 여행 정보를 받아 가이드북 페이지 콘텐츠를 생성합니다.
 * @param {Object} tripData - { destination, dates, description, photos: [{name, description}], requirements }
 * @returns {Object} - { title, coverText, pages: [{pageType, content}] }
 */
async function generateGuidebookContent(tripData) {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  const { destination, dates, description, photos = [], requirements = '' } = tripData;

  const prompt = `
당신은 여행 가이드북 편집자입니다. 아래 여행 정보를 바탕으로 아름다운 여행 가이드북 콘텐츠를 JSON 형식으로 작성해주세요.

여행 정보:
- 목적지: ${destination}
- 여행 기간: ${dates}
- 여행 설명: ${description}
- 사진 목록: ${photos.map((p) => p.name + (p.description ? ` (${p.description})` : '')).join(', ') || '없음'}
- 특별 요청사항: ${requirements || '없음'}

다음 JSON 형식으로만 응답하세요 (다른 텍스트 없이):
{
  "title": "가이드북 제목 (한국어, 20자 이내)",
  "subtitle": "부제목 (한국어, 30자 이내)",
  "coverText": "표지 소개 문구 (2~3줄)",
  "pages": [
    {
      "pageType": "intro",
      "title": "여행 소개",
      "content": "여행 소개 텍스트 (200자 이내)"
    },
    {
      "pageType": "highlights",
      "title": "여행 하이라이트",
      "content": "주요 볼거리/활동 리스트 (줄바꿈으로 구분)"
    },
    {
      "pageType": "tips",
      "title": "여행 꿀팁",
      "content": "현지 팁, 주의사항 등 (200자 이내)"
    },
    {
      "pageType": "closing",
      "title": "마무리",
      "content": "여행을 마무리하는 감성적인 문구 (100자 이내)"
    }
  ]
}
`;

  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    max_tokens: 1500,
  });

  const raw = response.choices[0].message.content.trim();
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('LLM이 올바른 JSON을 반환하지 않았습니다.');

  return JSON.parse(jsonMatch[0]);
}

module.exports = { generateGuidebookContent };

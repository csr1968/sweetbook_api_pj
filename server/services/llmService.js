const Groq = require('groq-sdk');

/**
 * 여행 정보를 받아 가이드북 페이지 콘텐츠를 생성합니다.
 * @param {Object} tripData - { destination, dates, description, photos: [{name, description}], requirements }
 * @returns {Object} - { title, coverText, pages: [{pageType, content}] }
 */
async function generateGuidebookContent(tripData) {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  const { destination, dates, description, photos = [], requirements = '' } = tripData;

  const photoCount = photos.length;
  const hasPhotos = photoCount > 0;
  const isRichContent = (description?.length > 30) || (requirements?.length > 20);

  const prompt = `
당신은 여행 가이드북 편집자입니다. 아래 여행 정보를 바탕으로 아름다운 여행 가이드북 콘텐츠를 JSON 형식으로 작성해주세요.
반드시 순수한 한국어(한글)로만 작성하세요. 한자, 일본어, 중국어 등 다른 언어 문자는 절대 사용하지 마세요.

여행 정보:
- 목적지: ${destination}
- 여행 기간: ${dates}
- 여행 설명: ${description || '없음'}
- 첨부 사진: ${hasPhotos ? `${photoCount}장` : '없음'}
- 특별 요청사항: ${requirements || '없음'}

페이지 구성 규칙:
- 최소 6페이지, 최대 10페이지로 구성하세요.
- 여행 설명과 요청사항이 구체적이고 풍부하면 8~10페이지, 간단하면 6~7페이지를 생성하세요.
- "intro"(여행 소개)는 항상 첫 번째, "closing"(여행을 마치며)은 항상 마지막에 포함하세요.
- 사진이 첨부된 경우 "photospot" 페이지를 반드시 포함하세요.
- 나머지 페이지는 아래 목록에서 여행 정보에 맞게 자유롭게 선택하세요.

사용 가능한 pageType 목록:
- "intro": 여행 소개 (필수)
- "highlights": 주요 볼거리 & 명소
- "itinerary": 일자별 일정
- "food": 현지 맛집 & 먹거리
- "tips": 여행 꿀팁 (교통/날씨/예산 등)
- "culture": 현지 문화 & 역사
- "photospot": 포토스팟 추천${hasPhotos ? ' (필수)' : ''}
- "accommodation": 숙소 추천
- "closing": 여행을 마치며 (필수)

각 페이지 content 길이: 250~450자로 충분히 풍부하게 작성하세요.
현재 판단: ${isRichContent ? '내용이 풍부하므로 8~10페이지 생성' : '기본 정보이므로 6~7페이지 생성'}

다음 JSON 형식으로만 응답하세요 (다른 텍스트 없이):
{
  "title": "가이드북 제목 (20자 이내)",
  "subtitle": "부제목 (30자 이내)",
  "coverText": "표지 소개 문구 (2~3줄, 감성적으로)",
  "pages": [
    { "pageType": "intro", "title": "페이지 제목", "content": "내용" },
    { "pageType": "highlights", "title": "페이지 제목", "content": "내용" }
  ]
}
`;

  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    max_tokens: 3000,
  });

  const raw = response.choices[0].message.content.trim();
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('LLM이 올바른 JSON을 반환하지 않았습니다.');

  return JSON.parse(jsonMatch[0]);
}

module.exports = { generateGuidebookContent };

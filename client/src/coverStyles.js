export const COVER_STORAGE_KEY = 'sweetbookCover';

export const COVER_OPTIONS = [
  {
    id: 'dune',
    name: '따뜻한 모래',
    subtitle: '크림 & 테라코타',
    thumb: 'linear-gradient(145deg, #f0e4d7 0%, #c9a88a 55%, #a67c52 100%)',
  },
  {
    id: 'sunset',
    name: '노을',
    subtitle: '코랄 & 로즈',
    thumb: 'linear-gradient(145deg, #ffd4c4 0%, #e8a598 45%, #c75b7a 100%)',
  },
  {
    id: 'ocean',
    name: '바다 안개',
    subtitle: '민트 & 딥 블루',
    thumb: 'linear-gradient(145deg, #c5e8ef 0%, #7eb6c8 50%, #3d5a80 100%)',
  },
  {
    id: 'forest',
    name: '숲길',
    subtitle: '세이지 & 딥 그린',
    thumb: 'linear-gradient(145deg, #d4e4d4 0%, #7d9b76 50%, #3d5344 100%)',
  },
  {
    id: 'lavender',
    name: '라벤더',
    subtitle: '소프트 퍼플',
    thumb: 'linear-gradient(145deg, #e8e0f0 0%, #b8a9c9 50%, #6b5b7c 100%)',
  },
  {
    id: 'midnight',
    name: '밤하늘',
    subtitle: '네이비 & 골드',
    thumb: 'linear-gradient(145deg, #4a5568 0%, #2d3748 55%, #1a202c 100%)',
  },
];

export const COVER_IDS = COVER_OPTIONS.map((o) => o.id);
export const COVER_DEFAULT = 'dune';

export function isValidCoverId(id) {
  return COVER_IDS.includes(id);
}

export function getStoredCoverId() {
  try {
    const s = sessionStorage.getItem(COVER_STORAGE_KEY);
    return isValidCoverId(s) ? s : COVER_DEFAULT;
  } catch {
    return COVER_DEFAULT;
  }
}

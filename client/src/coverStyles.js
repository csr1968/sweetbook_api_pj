export const COVER_STORAGE_KEY = 'sweetbookCover';
export const COVER_PHOTO_STORAGE_KEY = 'sweetbookCoverPhoto';

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

export const COVER_THEMES = [
  { id: 'all', label: '전체' },
  { id: 'city', label: '도시' },
  { id: 'sea', label: '바다' },
  { id: 'nature', label: '자연' },
  { id: 'night', label: '야경' },
  { id: 'cafe', label: '카페' },
  { id: 'spring', label: '봄꽃' },
  { id: 'winter', label: '겨울' },
];

export const COVER_PHOTOS = [
  // city
  {
    id: 'city-neon',
    theme: 'city',
    name: '네온 시티',
    src: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'city-street',
    theme: 'city',
    name: '골목 산책',
    src: 'https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?auto=format&fit=crop&w=1200&q=80',
  },
  // sea
  {
    id: 'sea-wave',
    theme: 'sea',
    name: '파도',
    src: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'sea-sunset',
    theme: 'sea',
    name: '바다 노을',
    src: 'https://images.unsplash.com/photo-1476673160081-cf065607f449?auto=format&fit=crop&w=1200&q=80',
  },
  // nature
  {
    id: 'nature-mountain',
    theme: 'nature',
    name: '산과 호수',
    src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'nature-forest',
    theme: 'nature',
    name: '숲길',
    src: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80',
  },
  // night
  {
    id: 'night-city',
    theme: 'night',
    name: '도시 야경',
    src: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'night-stars',
    theme: 'night',
    name: '별빛',
    src: 'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?auto=format&fit=crop&w=1200&q=80',
  },
  // cafe
  {
    id: 'cafe-latte',
    theme: 'cafe',
    name: '라떼',
    src: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'cafe-dessert',
    theme: 'cafe',
    name: '디저트',
    src: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=1200&q=80',
  },
  // spring
  {
    id: 'spring-cherry',
    theme: 'spring',
    name: '벚꽃',
    src: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?auto=format&fit=crop&w=1200&q=80',
  },
  // winter
  {
    id: 'winter-snow',
    theme: 'winter',
    name: '설경',
    src: 'https://images.unsplash.com/photo-1457269449834-928af64c684d?auto=format&fit=crop&w=1200&q=80',
  },
];

export const COVER_PHOTO_IDS = COVER_PHOTOS.map((p) => p.id);

export function isValidCoverId(id) {
  return COVER_IDS.includes(id);
}

export function isValidCoverPhotoId(id) {
  return id === 'none' || COVER_PHOTO_IDS.includes(id);
}

export function getStoredCoverId() {
  try {
    const s = sessionStorage.getItem(COVER_STORAGE_KEY);
    return isValidCoverId(s) ? s : COVER_DEFAULT;
  } catch {
    return COVER_DEFAULT;
  }
}

export function getStoredCoverPhotoId() {
  try {
    const s = sessionStorage.getItem(COVER_PHOTO_STORAGE_KEY);
    return isValidCoverPhotoId(s) ? s : 'none';
  } catch {
    return 'none';
  }
}

export function getCoverPhotoById(id) {
  return COVER_PHOTOS.find((p) => p.id === id) || null;
}

export function getCoverPhotosByTheme(themeId) {
  if (!themeId || themeId === 'all') return COVER_PHOTOS;
  return COVER_PHOTOS.filter((p) => p.theme === themeId);
}

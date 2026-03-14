# Hee-eung-ee NFC Landing

히응이 NFC 랜딩 미니앱 — 순수 HTML/CSS/JS 정적 사이트

## 기술 스택
- HTML/CSS/JS (프레임워크 없음)
- Vercel 정적 배포
- GitHub repo: lanforalkr-cell/hieungee-nfc

## 다국어 시스템 (i18n)
- 지원 언어: EN, JA, ZH, KO (탭 순서 동일)
- 정적 UI 텍스트: `t('key')` 함수 (js/i18n.js)
- JSON 데이터 필드: `localizeField(obj, 'field')` → `field_ko`, `field_ja`, `field_zh` 접미사
- 언어 전환 시 `langchange` 이벤트 → 동적 모듈 re-render
- localStorage에 언어 설정 저장

## 주요 파일 구조
```
index.html          — 메인 페이지 (섹션: hero, hangul-name, feed, coupons, products, footer)
css/style.css       — 메인 스타일
css/patterns.css    — 배경 패턴
js/i18n.js          — 다국어 모듈 (t, localizeField, I18n)
js/app.js           — 메인 앱 (파티클, 스크롤, 한글변환, 뉴스레터)
js/hangul.js        — 영어→한글 변환 (NAME_TABLE + 알고리즘)
js/artwork.js       — 캔버스 아트워크 생성
js/instagram.js     — 한글 교실 피드 + 일상 표현 로더
js/coupons.js       — 쿠폰 로더
js/products.js      — 제품 그리드
js/gemini.js        — Gemini API 설정
js/character-svg.js — 캐릭터 SVG
data/lessons.json   — 자음 레슨 (6개, 4개국어)
data/phrases.json   — 일상 표현 (4개, 4개국어)
data/coupons.json   — 쿠폰 (4개국어)
data/products.json  — 제품 (4개국어)
image/chracter/     — 캐릭터 PNG (주의: chracter 오타 그대로 유지)
image/shop/         — 제품 이미지
```

## 컨벤션
- JSON 다국어 필드: `_ko`, `_ja`, `_zh` 접미사 (영어는 접미사 없는 기본 필드)
- fetch 캐시 방지: `{ cache: 'no-store' }` 사용
- 스크립트 캐시 버스터: `?v=3` (index.html script 태그)
- 이미지 경로: `image/chracter/` (오타지만 디렉토리명 그대로 유지)

## 외부 연동
- Google Sheets 뉴스레터: Apps Script POST → 스프레드시트 자동 저장
- Instagram: @lanforal_official
- 쇼핑몰: lanforal.com

## 배포
- GitHub push → Vercel 자동 배포
- URL: https://hieungee-nfc-9n8a.vercel.app/
- GitHub Desktop으로 push (HTTPS 인증)

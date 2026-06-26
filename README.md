# Ad Blocker 

## 간단하고 효율적인 광고 차단 브라우저 확장프로그램입니다.그리고보안도지키는확장프로그램입니다
## 지원하는 광고 필터

- Google Ads
- Facebook Ads
- DoubleClick
- Amazon Ads
- Criteo
- 기타 일반적인 광고 도메인
- ##보안취약 필터
- 1.다운로드 코드 검사
- 2.웹사이트코드검사

## 설치 방법

### Chrome/Edge

1. 이 폴더를 다운로드합니다.
2. `chrome://extensions/` 또는 `edge://extensions/` 를 엽니다.
3. 오른쪽 상단의 **개발자 모드**를 활성화합니다.
4. **압축 해제된 확장프로그램 로드** 버튼을 클릭합니다.
5. 이 폴더를 선택합니다.

### Firefox

1. 이 폴더를 다운로드합니다.
2. `about:debugging` 을 엽니다.
3. **이 Firefox** 탭에서 **임시 추가 기능 로드** 를 클릭합니다.
4. 폴더 내 `manifest.json` 파일을 선택합니다.

## 파일 구조

```
ad-blocker/
├── manifest.json      # 확장프로그램 설정 파일
├── background.js      # 백그라운드 서비스 워커
├── content.js         # 콘텐츠 스크립트
├── popup.html         # 팝업 UI
├── popup.css          # 팝업 스타일
├── popup.js           # 팝업 로직
├── README.md          # 이 파일
└── images/            # 아이콘 이미지
```

## 작동 원리

### 1. 네트워크 차단
- `background.js`에서 광고 도메인으로의 요청을 차단합니다.

### 2. DOM 제거
- `content.js`는 페이지 로드 후 광고 선택자를 이용해 DOM에서 광고 요소를 제거합니다.
- `MutationObserver`로 동적으로 추가되는 광고도 감시하고 제거합니다.

### 3. 사용자 제어
- `popup.html/js`에서 확장프로그램을 활성화/비활성화할 수 있습니다.
- 설정은 `chrome.storage.sync`에 저장되어 여러 기기에서 동기화됩니다.

## 커스터마이징

### 광고 필터 추가

`background.js`의 `AD_FILTERS` 배열에 새 도메인을 추가합니다:

```javascript
const AD_FILTERS = [
  'ads.example.com',
  'myads.com',
  // 새 필터 추가
];
```

### 광고 선택자 추가

`content.js`의 `adSelectors` 배열에 새 CSS 선택자를 추가합니다:

```javascript
const adSelectors = [
  '[id*="my-ad"]',
  '.my-ad-class',
  // 새 선택자 추가
];
```
##장점
- **네트워크 요청 차단**: 광고 도메인의 HTTP 요청을 직접 차단
-  **DOM 광고 제거**: 페이지 로드 후 광고 요소를 DOM에서 제거
-  **추적 방지**: 추적 스크립트 차단
-  **쉬운 온/오프**: 팝업 인터페이스에서 한 클릭으로 활성화/비활성화
-  **저장된 설정**: 사용자 설정이 자동으로 저장됨
-  보안검사도해서안전해짐
## 단점

- 일부 비디오 광고는 완벽하게 차단되지 않을 수 있습니다.
- 웹사이트의 레이아웃 변경으로 인해 공백이 남을 수 있습니다.
- 보안이완벽하게차단되지는않습니다
  ## 업뎃해야할점:
-1.메모리사용량을 줄인다
-2.이거는당신이허락해야하는데 컴퓨터아니면등등기기에악성코드등등도검사하게수락한다



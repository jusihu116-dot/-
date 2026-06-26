// 페이지 내의 모든 <script> 태그 내용을 가져오는 예시
function getPageCode() {
  const scripts = Array.from(document.getElementsByTagName('script'));
  let code = "";
  scripts.forEach(s => {
    if (s.src) {
      // 외부 파일은 fetch를 통해 가져와야 함 (권한 필요)
    } else {
      code += s.textContent + "\n";
    }
  });
  return code;
}

// 팝업에서 메시지를 보내면 코드 분석 시작
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "START_SCAN") {
    const code = getPageCode();
    // 여기서 코드 분석 로직 실행
    console.log("분석 대상 코드:", code);
    sendResponse({ status: "done", message: "분석 완료" });
  }
});
// 페이지의 광고 요소를 DOM에서 제거
function removeAds() {
  // 일반적인 광고 선택자
  const adSelectors = [
    '[id*="ad-"]',
    '[class*="ad-"]',
    '[id*="ads-"]',
    '[class*="ads-"]',
    '[id*="advert"]',
    '[class*="advert"]',
    '[id*="banner"]',
    '[class*="banner"]',
    '[id*="popup"]',
    '[class*="popup"]',
    'iframe[src*="ads"]',
    'iframe[src*="google"]',
    '[data-ad-client]',
    '[data-ad-slot]',
    '.advertisement',
    '.ad-container',
    '.ad-wrapper',
    '.ad-box',
    '.ad-block',
    '.promo',
    '.promotion',
    'aside [id*="ad"]',
    'div[id*="gpt"]',
    '[id*="google_ads"]',
    'ins.adsbygoogle',
    '.google-auto-placed'
  ];

  let removedCount = 0;

  adSelectors.forEach(selector => {
    try {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        // 부모 요소의 높이를 0으로 설정하여 레이아웃 충돌 최소화
        element.style.display = 'none';
        element.style.visibility = 'hidden';
        element.style.height = '0';
        element.style.width = '0';
        removedCount++;
      });
    } catch (e) {
      // 잘못된 선택자는 무시
    }
  });

  // Google AdSense 광고 스크립트 제거
  try {
    const scripts = document.querySelectorAll('script[src*="pagead"]');
    scripts.forEach(script => {
      script.remove();
      removedCount++;
    });
  } catch (e) {}

  // 추적 스크립트 제거
  try {
    const trackers = document.querySelectorAll('script[src*="analytics"]');
    trackers.forEach(tracker => {
      tracker.remove();
      removedCount++;
    });
  } catch (e) {}

  // Google Analytics 제거
  try {
    const gaScripts = document.querySelectorAll('script[src*="google-analytics"]');
    gaScripts.forEach(script => {
      script.remove();
      removedCount++;
    });
  } catch (e) {}

  console.log(`[Ad Blocker] Removed ${removedCount} ad elements`);
}

// 초기 로드 시 광고 제거
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', removeAds);
} else {
  removeAds();
}

// 동적으로 추가되는 광고 감시
const observer = new MutationObserver(() => {
  removeAds();
});

observer.observe(document.documentElement, {
  childList: true,
  subtree: true,
  attributes: true,
  attributeFilter: ['id', 'class', 'src', 'data-ad-client']
});

// 확장프로그램 활성화 상태 확인
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'removeAds') {
    removeAds();
    sendResponse({ success: true });
  }
});

// 광고 이미지 차단 (onload 이벤트에서 차단)
document.addEventListener('load', function(event) {
  const target = event.target;
  if (target.tagName === 'IMG' || target.tagName === 'IFRAME') {
    const src = target.src || target.getAttribute('src') || '';
    if (src.includes('ads') || src.includes('google') || src.includes('doubleclick')) {
      target.style.display = 'none';
      target.style.visibility = 'hidden';
      console.log('[Ad Blocker] Blocked image/iframe:', src);
    }
  }
}, true);

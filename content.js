// content.js

/**
 * 페이지 내 보안 취약 요소 탐지
 */
function scanPageSecurity() {
    console.log("--- 보안 스캔 시작 ---");

    // 1. 보안되지 않은 패스워드 입력 필드 탐지
    const passwordFields = document.querySelectorAll('input[type="password"]');
    passwordFields.forEach(field => {
        if (window.location.protocol !== 'https:') {
            console.warn("⚠️ [보안 경고]: HTTPS가 아닌 페이지에서 패스워드 입력창 발견됨!");
        }
    });

    // 2. HTML 주석 내 민감 정보 탐지 (API Key, Todo 등)
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_COMMENT, null, false);
    let comment;
    while (comment = walker.nextNode()) {
        const content = comment.nodeValue;
        if (/api_key|password|secret|token/i.test(content)) {
            console.error("🚨 [보안 경고]: 주석 내 민감 정보 노출 가능성 확인:", content.trim());
        }
    }

    // 3. 외부 스크립트(CDN) 소스 점검 (간단 예시)
    const scripts = document.querySelectorAll('script[src]');
    scripts.forEach(script => {
        if (script.src.includes('http://') && !script.src.includes('localhost')) {
            console.warn("⚠️ [보안 경고]: 신뢰할 수 없는 평문(HTTP) 스크립트 로드 중:", script.src);
        }
    });

    console.log("--- 보안 스캔 종료 ---");
}

// 페이지가 완전히 로드된 후 실행
window.addEventListener('load', scanPageSecurity);
---------------------------------------------------------------------
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

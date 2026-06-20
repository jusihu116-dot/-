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
    'div[id*="gpt"]'
  ];

  adSelectors.forEach(selector => {
    try {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        element.style.display = 'none';
      });
    } catch (e) {
      // 잘못된 선택자는 무시
    }
  });

  // Google AdSense 광고 제거
  const scripts = document.querySelectorAll('script[src*="pagead"]');
  scripts.forEach(script => script.remove());

  // 추적 스크립트 제거
  const trackers = document.querySelectorAll('script[src*="analytics"]');
  trackers.forEach(tracker => tracker.remove());
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

observer.observe(document.body, {
  childList: true,
  subtree: true,
  attributes: true,
  attributeFilter: ['id', 'class', 'src']
});

// 확장프로그램 활성화 상태 확인
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'removeAds') {
    removeAds();
    sendResponse({ success: true });
  }
});

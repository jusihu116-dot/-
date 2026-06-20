// 광고 차단 필터 리스트
const AD_FILTERS = [
  // 일반적인 광고 도메인
  'ads.google.com',
  'googleadservices.com',
  'googlesyndication.com',
  'pagead2.googlesyndication.com',
  'facebook.com/ads',
  'connect.facebook.net',
  'doubleclick.net',
  'adnxs.com',
  'criteo.com',
  'quantserve.com',
  'amazon-adsystem.com',
  'oas.google.com',
  'pagead.l.google.com',
  'tpc.googlesyndication.com',
  '2mdn.net',
  'adserver',
  'ads-',
  'banner',
  'popup',
  'tracking',
  'analytics'
];

// 확장프로그램 활성화 상태
let isEnabled = true;

// 저장된 설정 로드
chrome.storage.sync.get(['enabled'], (result) => {
  isEnabled = result.enabled !== false;
});

// 탭 업데이트 시 콘텐츠 스크립트 주입
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'loading' && isEnabled) {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ['content.js']
    }).catch((err) => {
      // 특정 탭에서 실행 불가능한 경우 무시
      console.log('Script injection error:', err);
    });
  }
});

// 메시지 수신
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggle') {
    isEnabled = request.enabled;
    chrome.storage.sync.set({ enabled: isEnabled });
    sendResponse({ success: true, enabled: isEnabled });
  } else if (request.action === 'getStatus') {
    sendResponse({ enabled: isEnabled });
  }
});

// 웹 요청 차단 (대체 방식 - 각 탭에서 처리)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'checkAd') {
    const url = request.url.toLowerCase();
    for (let filter of AD_FILTERS) {
      if (url.includes(filter.toLowerCase())) {
        sendResponse({ blocked: true });
        return;
      }
    }
    sendResponse({ blocked: false });
  }
});

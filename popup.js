// DOM 요소 가져오기
const toggleBtn = document.getElementById('toggleBtn');
const statusBadge = document.getElementById('status');

// 초기 상태 설정
chrome.runtime.sendMessage({ action: 'getStatus' }, (response) => {
  updateUI(response.enabled);
});

// 토글 버튼 클릭 이벤트
toggleBtn.addEventListener('click', () => {
  const isCurrentlyEnabled = toggleBtn.classList.contains('enabled');
  const newState = !isCurrentlyEnabled;
  
  chrome.runtime.sendMessage(
    { action: 'toggle', enabled: newState },
    (response) => {
      if (response.success) {
        updateUI(newState);
      }
    }
  );
});

// UI 업데이트 함수
function updateUI(enabled) {
  if (enabled) {
    toggleBtn.classList.remove('disabled');
    toggleBtn.classList.add('enabled');
    toggleBtn.textContent = '비활성화';
    
    statusBadge.classList.remove('disabled');
    statusBadge.classList.add('enabled');
    statusBadge.textContent = '활성화';
  } else {
    toggleBtn.classList.remove('enabled');
    toggleBtn.classList.add('disabled');
    toggleBtn.textContent = '활성화';
    
    statusBadge.classList.remove('enabled');
    statusBadge.classList.add('disabled');
    statusBadge.textContent = '비활성화';
  }
}

# 근태 대장 — 분할 버전 (읽기/보관용)

이 폴더는 `hr_leave_tracker.html` (claude.ai 아티팩트 단일 파일)의 로직을
읽기 좋게 컴포넌트 단위로 옮겨 놓은 **보관용 미러**입니다.

## ⚠️ 실제로 실행되는 버전이 아닙니다

- **실사용은 여전히 `hr_leave_tracker.html`** 하나로 된 파일입니다. claude.ai
  아티팩트로 열면 그대로 작동하고, `window.storage`를 통해 팀원 전체가
  데이터를 공유합니다.
- 이 `src/` 폴더는 `npm install && npm run dev`로 당장 완전히 동일하게
  돌아가는 걸 보장하지 않습니다. 특히:
  - `useHrStore.js`가 사용하는 `window.storage`는 **claude.ai 환경에서만
    존재하는 API**입니다. 일반 브라우저에는 없기 때문에, 독립 배포하려면
    `localStorage`나 Supabase 같은 실제 백엔드로 교체해야 합니다.
  - 의존성 버전/빌드 설정은 표준 Vite 템플릿을 참고해 최소한으로만
    맞춰뒀습니다.

## 왜 이렇게 나눴나

- GitHub에서 diff/리뷰가 쉬워지고, 나중에 진짜 React 앱으로 키울 때
  참고할 청사진이 되도록 하기 위함입니다.
- 파일 대응 관계:

| 파일 | 역할 |
|---|---|
| `src/App.jsx` | 상태 통합 + 레이아웃 |
| `src/App.css` | 전체 스타일 (원본 `<style>` 그대로) |
| `src/main.jsx` | React 진입점 |
| `src/hooks/useHrStore.js` | `window.storage` 연동 (직원/휴가 데이터 로드·저장) |
| `src/utils/leave.js` | 날짜/연차 계산 유틸 |
| `src/components/Sidebar.jsx` | 좌측 메뉴 |
| `src/components/Topbar.jsx` | 상단 프로필/역할 |
| `src/components/Dashboard.jsx` | 대시보드 |
| `src/components/RequestForm.jsx` | 휴가 신청 폼 |
| `src/components/LeaveMine.jsx` | 내 휴가 내역 |
| `src/components/TeamCalendar.jsx` | 팀 캘린더 |
| `src/components/StaffAdmin.jsx` | 승인 관리 + 직원 관리 (관리자 전용) |

## 두 버전을 계속 수동으로 맞춰야 하나요?

네. 이 두 버전(단일 HTML ↔ 분할 소스)은 **자동으로 동기화되지 않습니다.**
기능을 바꿀 때는 원본 `hr_leave_tracker.html`을 기준으로 수정 요청하시고,
필요하면 이 분할 버전도 같이 업데이트해달라고 말씀해 주세요.

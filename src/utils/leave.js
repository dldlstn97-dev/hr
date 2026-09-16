// utils/leave.js
// 날짜 계산, 연차 발생/사용 계산 등 순수 함수 모음.
// (원본: hr_leave_tracker.html 의 "utils/leave.js 대응" 섹션)

export const LEAVE_TYPES = ["연차", "반차", "병가", "경조사", "기타"];
export const DOW = ["일", "월", "화", "수", "목", "금", "토"];

export const TYPE_COLOR = {
  "연차": ["var(--ledger-tint)", "var(--ledger-dark)"],
  "반차": ["var(--ledger-tint)", "var(--ledger-dark)"],
  "병가": ["var(--stamp-red-tint)", "var(--stamp-red)"],
  "경조사": ["var(--amber-tint)", "var(--amber)"],
  "기타": ["#E7E5D6", "#6b6d54"],
};

export function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export function fmtDate(d) {
  const dt = typeof d === "string" ? new Date(d) : d;
  return `${dt.getFullYear()}.${String(dt.getMonth() + 1).padStart(2, "0")}.${String(dt.getDate()).padStart(2, "0")}`;
}

export function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function daysBetweenInclusive(startStr, endStr) {
  const s = new Date(startStr);
  const e = new Date(endStr);
  return Math.round((e - s) / 86400000) + 1;
}

/**
 * 근로기준법 기준 간이 연차 발생 계산.
 * - 입사 1년 미만: 매 1개월 개근 시 1일 (최대 11일)
 * - 입사 1년 이상: 15일 + 2년마다 1일 가산 (최대 25일)
 * 참고용 근사치이며, 실제 사규/법적 기준은 인사 담당자 확인이 필요합니다.
 */
export function calcAccrued(joinDateStr, asOf) {
  const join = new Date(joinDateStr);
  const now = asOf || new Date();
  if (isNaN(join.getTime()) || join > now) return 0;
  let months = (now.getFullYear() - join.getFullYear()) * 12 + (now.getMonth() - join.getMonth());
  if (now.getDate() < join.getDate()) months -= 1;
  if (months < 12) return Math.max(0, Math.min(11, months));
  const years = Math.floor(months / 12);
  return Math.min(25, 15 + Math.floor((years - 1) / 2));
}

export function usedLeave(requests, empId) {
  return requests
    .filter((r) => r.empId === empId && r.status === "approved" && (r.type === "연차" || r.type === "반차"))
    .reduce((sum, r) => sum + r.days, 0);
}

export function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

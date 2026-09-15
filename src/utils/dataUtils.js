# 근태/연차 계산 헬퍼 함수

export function fmtDate(d) {
  const dt = typeof d === "string" ? new Date(d) : d;
  return `${dt.getFullYear()}.${String(dt.getMonth() + 1).padStart(2, "0")}.${String(dt.getDate()).padStart(2, "0")}`;
}

export function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

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

export function daysBetweenInclusive(startStr, endStr) {
  const s = new Date(startStr), e = new Date(endStr);
  return Math.round((e - s) / 86400000) + 1;
}

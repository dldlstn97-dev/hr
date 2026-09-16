// components/Dashboard.jsx
// 대시보드 뷰: 내 잔여 연차, 오늘 휴가자, 대기 승인 건수 등 요약 카드

import React from "react";
import { calcAccrued, usedLeave, todayStr, fmtDate } from "../utils/leave";

function StatCard({ label, num, sub }) {
  return (
    <div className="card">
      <div className="stat-label">{label}</div>
      <div className="stat-num">{num}</div>
      <div className="stat-sub">{sub}</div>
    </div>
  );
}

function StatusStamp({ status }) {
  if (status === "approved") return <span className="stamp approved">승인됨</span>;
  if (status === "rejected") return <span className="stamp rejected">반려됨</span>;
  return <span className="stamp pending">대기중</span>;
}

export default function Dashboard({ employees, requests, currentUserId }) {
  const user = employees.find((e) => e.id === currentUserId);
  if (!user) return null;

  const empName = (id) => employees.find((e) => e.id === id)?.name || "(알수없음)";

  const accrued = calcAccrued(user.joinDate);
  const used = usedLeave(requests, user.id);
  const remaining = Math.max(0, accrued - used);

  const today = todayStr();
  const onLeaveToday = requests.filter(
    (r) => r.status === "approved" && r.startDate <= today && r.endDate >= today
  );
  const pendingCount = requests.filter((r) => r.status === "pending").length;
  const isAdmin = user.role === "admin";

  const cards = [
    { label: "내 잔여 연차", num: `${remaining}일`, sub: `발생 ${accrued}일 · 사용 ${used}일` },
    {
      label: "오늘 휴가자",
      num: `${onLeaveToday.length}명`,
      sub: onLeaveToday.length ? onLeaveToday.map((r) => empName(r.empId)).join(", ") : "전원 출근",
    },
    {
      label: "전체 직원 수",
      num: `${employees.length}명`,
      sub: `관리자 ${employees.filter((e) => e.role === "admin").length}명`,
    },
  ];
  if (isAdmin) {
    cards.push({
      label: "대기 중인 승인",
      num: `${pendingCount}건`,
      sub: pendingCount ? "확인이 필요합니다" : "모두 처리됨",
    });
  }

  const recent = requests
    .filter((r) => r.empId === user.id)
    .sort((a, b) => b.requestedAt - a.requestedAt)
    .slice(0, 4);

  return (
    <>
      <div className="grid grid-4">
        {cards.map((c) => (
          <StatCard key={c.label} {...c} />
        ))}
      </div>

      <div className="section">
        <div className="section-title">내 최근 신청 내역</div>
        <div className="card" style={{ padding: 0 }}>
          <table>
            <thead>
              <tr>
                <th>종류</th>
                <th>기간</th>
                <th>일수</th>
                <th>상태</th>
              </tr>
            </thead>
            <tbody>
              {recent.length ? (
                recent.map((r) => (
                  <tr key={r.id}>
                    <td>{r.type}</td>
                    <td>
                      {fmtDate(r.startDate)}
                      {r.startDate !== r.endDate ? ` ~ ${fmtDate(r.endDate)}` : ""}
                    </td>
                    <td>{r.days}일</td>
                    <td>
                      <StatusStamp status={r.status} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="empty-row">
                  <td colSpan={4}>아직 신청 내역이 없습니다.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="callout">
        연차 발생 일수는 근로기준법 기준 간이 계산식(1년 미만 매월 1일, 1년 이상 15일 + 2년마다 1일
        가산, 최대 25일)으로 자동 산출됩니다. 회사 사규나 실제 법적 기준과 다를 수 있으니 정확한 적용은
        인사 담당자에게 확인하세요.
      </div>
    </>
  );
}

export { StatusStamp };

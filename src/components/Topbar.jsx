// components/Topbar.jsx
// 상단 프로필 및 역할 표시

import React from "react";

const PAGE_TITLES = {
  dashboard: "대시보드",
  request: "휴가 신청",
  mine: "내 휴가 내역",
  calendar: "팀 캘린더",
  approvals: "승인 관리",
  staff: "직원 관리",
};

const PAGE_DESCS = {
  dashboard: "오늘의 근태 현황과 내 연차 잔여일수를 한눈에 확인하세요.",
  request: "휴가 종류와 기간을 입력해 신청서를 제출하세요.",
  mine: "내가 신청한 휴가의 처리 상태를 확인하세요.",
  calendar: "이번 달 팀 전체의 휴가 일정입니다.",
  approvals: "대기 중인 휴가 신청을 승인하거나 반려하세요.",
  staff: "직원을 등록하고 관리자 권한을 설정하세요.",
};

export default function Topbar({ view, employees, currentUserId, onChangeUser, isAdmin }) {
  return (
    <div className="topbar">
      <div>
        <div className="page-title">{PAGE_TITLES[view] || ""}</div>
        <div className="page-desc">{PAGE_DESCS[view] || ""}</div>
      </div>
      <div className="identity-box">
        👤
        <select value={currentUserId || ""} onChange={(e) => onChangeUser(e.target.value)}>
          {employees.map((e) => (
            <option key={e.id} value={e.id}>
              {e.name} · {e.dept}
            </option>
          ))}
        </select>
        <span className="role-tag">{isAdmin ? "관리자" : "직원"}</span>
      </div>
    </div>
  );
}

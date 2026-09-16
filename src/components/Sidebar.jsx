// components/Sidebar.jsx
// 좌측 메뉴 및 내비게이션

import React from "react";

const NAV_ITEMS = [
  { key: "dashboard", label: "대시보드" },
  { key: "request", label: "휴가 신청" },
  { key: "mine", label: "내 휴가 내역" },
  { key: "calendar", label: "팀 캘린더" },
];

const ADMIN_NAV_ITEMS = [
  { key: "approvals", label: "승인 관리" },
  { key: "staff", label: "직원 관리" },
];

export default function Sidebar({ view, onChangeView, isAdmin }) {
  return (
    <div className="sidebar">
      <div className="brand">근태 대장</div>
      <div className="brand-sub">사내 근태 · 휴가 관리</div>
      <div className="nav-label">보기</div>

      {NAV_ITEMS.map((item) => (
        <button
          key={item.key}
          className={`nav-item ${view === item.key ? "active" : ""}`}
          onClick={() => onChangeView(item.key)}
        >
          {item.label}
        </button>
      ))}

      {isAdmin && (
        <>
          <div className="nav-divider" />
          <div className="nav-label">관리자</div>
          {ADMIN_NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              className={`nav-item ${view === item.key ? "active" : ""}`}
              onClick={() => onChangeView(item.key)}
            >
              {item.label}
            </button>
          ))}
        </>
      )}

      <div className="sidebar-footer">
        공유 데이터는 이 링크에
        <br />
        접속한 모든 사용자에게
        <br />
        동일하게 표시됩니다.
      </div>
    </div>
  );
}

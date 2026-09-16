// components/TeamCalendar.jsx
// 팀 캘린더 뷰

import React, { useState } from "react";
import { DOW, TYPE_COLOR, todayStr } from "../utils/leave";

export default function TeamCalendar({ employees, requests }) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth()); // 0-indexed

  const empName = (id) => employees.find((e) => e.id === id)?.name || "(알수없음)";

  function goPrev() {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else {
      setMonth((m) => m - 1);
    }
  }
  function goNext() {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else {
      setMonth((m) => m + 1);
    }
  }

  const first = new Date(year, month, 1);
  const startDow = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = todayStr();
  const approved = requests.filter((r) => r.status === "approved");

  const cells = [];
  for (let i = 0; i < startDow; i++) {
    cells.push(<div className="cal-cell blank" key={`blank-${i}`} />);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const dayReqs = approved.filter((r) => r.startDate <= dateStr && r.endDate >= dateStr);
    const shown = dayReqs.slice(0, 3);
    const extra = dayReqs.length - shown.length;

    cells.push(
      <div className={`cal-cell ${dateStr === today ? "today" : ""}`} key={dateStr}>
        <div className="cal-daynum">{d}</div>
        {shown.map((r) => {
          const [bg, fg] = TYPE_COLOR[r.type] || TYPE_COLOR["기타"];
          return (
            <span className="cal-chip" style={{ background: bg, color: fg }} key={r.id}>
              {empName(r.empId)} {r.type}
            </span>
          );
        })}
        {extra > 0 && (
          <span className="cal-chip" style={{ color: "var(--ink-faint)" }}>
            +{extra}명
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="card">
      <div className="cal-head">
        <div className="cal-title">
          {year}년 {month + 1}월
        </div>
        <div className="cal-nav">
          <button className="btn btn-ghost btn-sm" onClick={goPrev}>
            ‹ 이전
          </button>
          <button className="btn btn-ghost btn-sm" onClick={goNext}>
            다음 ›
          </button>
        </div>
      </div>
      <div className="cal-grid">
        {DOW.map((d) => (
          <div className="cal-dow" key={d}>
            {d}
          </div>
        ))}
        {cells}
      </div>
    </div>
  );
}

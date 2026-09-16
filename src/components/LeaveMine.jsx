// components/LeaveMine.jsx
// 내 휴가 내역

import React from "react";
import { fmtDate, escapeHtml } from "../utils/leave";
import { StatusStamp } from "./Dashboard";

export default function LeaveMine({ requests, currentUserId }) {
  const mine = requests
    .filter((r) => r.empId === currentUserId)
    .sort((a, b) => b.requestedAt - a.requestedAt);

  return (
    <div className="card" style={{ padding: 0 }}>
      <table>
        <thead>
          <tr>
            <th>종류</th>
            <th>기간</th>
            <th>일수</th>
            <th>사유</th>
            <th>상태</th>
          </tr>
        </thead>
        <tbody>
          {mine.length ? (
            mine.map((r) => (
              <tr key={r.id}>
                <td>{r.type}</td>
                <td>
                  {fmtDate(r.startDate)}
                  {r.startDate !== r.endDate ? ` ~ ${fmtDate(r.endDate)}` : ""}
                </td>
                <td>{r.days}일</td>
                <td>{r.reason ? escapeHtml(r.reason) : "-"}</td>
                <td>
                  <StatusStamp status={r.status} />
                </td>
              </tr>
            ))
          ) : (
            <tr className="empty-row">
              <td colSpan={5}>신청 내역이 없습니다.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

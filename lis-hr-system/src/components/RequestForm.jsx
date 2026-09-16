// components/RequestForm.jsx
// 휴가 신청 폼

import React, { useState } from "react";
import { LEAVE_TYPES, uid, todayStr, daysBetweenInclusive } from "../utils/leave";

export default function RequestForm({ currentUserId, requests, saveRequests, onSubmitted }) {
  const [type, setType] = useState(LEAVE_TYPES[0]);
  const [start, setStart] = useState(todayStr());
  const [end, setEnd] = useState(todayStr());
  const [reason, setReason] = useState("");

  const isHalfDay = type === "반차";

  function handleTypeChange(next) {
    setType(next);
    if (next === "반차") setEnd(start);
  }
  function handleStartChange(next) {
    setStart(next);
    if (isHalfDay) setEnd(next);
  }

  async function handleSubmit() {
    const finalEnd = isHalfDay ? start : end;
    if (!start || !finalEnd) return alert("날짜를 입력해주세요.");
    if (new Date(finalEnd) < new Date(start)) return alert("종료일이 시작일보다 빠를 수 없습니다.");

    const days = isHalfDay ? 0.5 : daysBetweenInclusive(start, finalEnd);
    const req = {
      id: uid(),
      empId: currentUserId,
      type,
      startDate: start,
      endDate: finalEnd,
      days,
      reason: reason.trim(),
      status: "pending",
      requestedAt: Date.now(),
    };
    await saveRequests([...requests, req]);
    onSubmitted?.();
  }

  return (
    <div className="card" style={{ maxWidth: 560 }}>
      <div className="form-row">
        <div className="field">
          <label>휴가 종류</label>
          <select value={type} onChange={(e) => handleTypeChange(e.target.value)}>
            {LEAVE_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="form-row">
        <div className="field">
          <label>시작일</label>
          <input type="date" value={start} onChange={(e) => handleStartChange(e.target.value)} />
        </div>
        <div className="field">
          <label>종료일</label>
          <input
            type="date"
            value={isHalfDay ? start : end}
            disabled={isHalfDay}
            onChange={(e) => setEnd(e.target.value)}
          />
        </div>
      </div>
      <div className="form-row">
        <div className="field">
          <label>사유</label>
          <textarea
            placeholder="간단한 사유를 입력하세요"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>
      </div>
      <button className="btn btn-primary" onClick={handleSubmit}>
        신청서 제출
      </button>
    </div>
  );
}

import { useState } from "react";

const LEAVE_TYPES = ["연차", "반차", "병가", "경조사", "기타"];

export default function RequestForm({ currentUserId, onSubmit }) {
  const today = new Date().toISOString().split("T")[0];
  const [form, setForm] = useState({
    type: "연차",
    startDate: today,
    endDate: today,
    reason: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => {
      const updated = { ...prev, [id]: value };
      if (id === "type" && value === "반차") {
        updated.endDate = prev.startDate;
      }
      if (id === "startDate" && prev.type === "반차") {
        updated.endDate = value;
      }
      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (new Date(form.endDate) < new Date(form.startDate)) {
      alert("종료일이 시작일보다 빠를 수 없습니다.");
      return;
    }

    const start = new Date(form.startDate);
    const end = new Date(form.endDate);
    const diffDays = Math.round((end - start) / 86400000) + 1;
    const days = form.type === "반차" ? 0.5 : diffDays;

    onSubmit({
      id: Date.now().toString(36),
      empId: currentUserId,
      ...form,
      days,
      status: "pending",
      requestedAt: Date.now(),
    });
  };

  return (
    <div className="card" style={{ maxWidth: "560px" }}>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="field">
            <label>휴가 종류</label>
            <select id="type" value={form.type} onChange={handleChange}>
              {LEAVE_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="field">
            <label>시작일</label>
            <input type="date" id="startDate" value={form.startDate} onChange={handleChange} />
          </div>
          <div className="field">
            <label>종료일</label>
            <input
              type="date"
              id="endDate"
              value={form.endDate}
              onChange={handleChange}
              disabled={form.type === "반차"}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="field">
            <label>사유</label>
            <textarea
              id="reason"
              value={form.reason}
              onChange={handleChange}
              placeholder="간단한 사유를 입력하세요"
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary">신청서 제출</button>
      </form>
    </div>
  );
}

// components/StaffAdmin.jsx
// 관리자 전용: 승인 관리 + 직원 관리
// (원본 단일 파일에서는 renderApprovals() / renderStaff() 두 함수였습니다.
//  하나의 파일로 요청하신 구조에 맞춰 이 컴포넌트가 두 기능을 함께 담당합니다.
//  필요하면 ApprovalsPanel / StaffPanel로 다시 쪼개도 됩니다.)

import React, { useState } from "react";
import { fmtDate, escapeHtml, calcAccrued, usedLeave, todayStr } from "../utils/leave";
import { StatusStamp } from "./Dashboard";

function ApprovalsPanel({ employees, requests, saveRequests }) {
  const empName = (id) => employees.find((e) => e.id === id)?.name || "(알수없음)";
  const pending = requests.filter((r) => r.status === "pending").sort((a, b) => a.requestedAt - b.requestedAt);
  const decided = requests
    .filter((r) => r.status !== "pending")
    .sort((a, b) => b.requestedAt - a.requestedAt)
    .slice(0, 8);

  async function decide(id, act) {
    const list = requests.map((r) =>
      r.id === id ? { ...r, status: act === "approve" ? "approved" : "rejected" } : r
    );
    await saveRequests(list);
  }

  return (
    <>
      <div className="section-title" style={{ marginTop: 0 }}>
        대기 중 ({pending.length})
      </div>
      <div className="card" style={{ padding: 0 }}>
        <table>
          <thead>
            <tr>
              <th>직원</th>
              <th>종류</th>
              <th>기간</th>
              <th>일수</th>
              <th>사유</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {pending.length ? (
              pending.map((r) => (
                <tr key={r.id}>
                  <td className="name-cell">{empName(r.empId)}</td>
                  <td>{r.type}</td>
                  <td>
                    {fmtDate(r.startDate)}
                    {r.startDate !== r.endDate ? ` ~ ${fmtDate(r.endDate)}` : ""}
                  </td>
                  <td>{r.days}일</td>
                  <td>{r.reason ? escapeHtml(r.reason) : "-"}</td>
                  <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                    <button className="btn btn-approve btn-sm" onClick={() => decide(r.id, "approve")}>
                      승인
                    </button>{" "}
                    <button className="btn btn-reject btn-sm" onClick={() => decide(r.id, "reject")}>
                      반려
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="empty-row">
                <td colSpan={6}>대기 중인 신청이 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="section">
        <div className="section-title">최근 처리 내역</div>
        <div className="card" style={{ padding: 0 }}>
          <table>
            <thead>
              <tr>
                <th>직원</th>
                <th>종류</th>
                <th>기간</th>
                <th>상태</th>
              </tr>
            </thead>
            <tbody>
              {decided.length ? (
                decided.map((r) => (
                  <tr key={r.id}>
                    <td className="name-cell">{empName(r.empId)}</td>
                    <td>{r.type}</td>
                    <td>
                      {fmtDate(r.startDate)}
                      {r.startDate !== r.endDate ? ` ~ ${fmtDate(r.endDate)}` : ""}
                    </td>
                    <td>
                      <StatusStamp status={r.status} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="empty-row">
                  <td colSpan={4}>처리 내역이 없습니다.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function StaffPanel({ employees, requests, saveEmployees, currentUserId }) {
  const [name, setName] = useState("");
  const [dept, setDept] = useState("");
  const [join, setJoin] = useState(todayStr());
  const [role, setRole] = useState("employee");

  async function addEmployee() {
    if (!name.trim()) return alert("이름을 입력해주세요.");
    const emp = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      name: name.trim(),
      dept: dept.trim() || "-",
      joinDate: join || todayStr(),
      role,
    };
    await saveEmployees([...employees, emp]);
    setName("");
    setDept("");
  }

  async function removeEmployee(id) {
    if (id === currentUserId) return alert("현재 로그인한 계정은 삭제할 수 없습니다.");
    if (!confirm("이 직원을 삭제하시겠습니까? 신청 내역은 유지됩니다.")) return;
    await saveEmployees(employees.filter((e) => e.id !== id));
  }

  return (
    <>
      <div className="card" style={{ maxWidth: 640 }}>
        <div className="form-row">
          <div className="field">
            <label>이름</label>
            <input placeholder="홍길동" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="field">
            <label>부서</label>
            <input placeholder="예: 영업팀" value={dept} onChange={(e) => setDept(e.target.value)} />
          </div>
        </div>
        <div className="form-row">
          <div className="field">
            <label>입사일</label>
            <input type="date" value={join} onChange={(e) => setJoin(e.target.value)} />
          </div>
          <div className="field">
            <label>권한</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="employee">직원</option>
              <option value="admin">관리자</option>
            </select>
          </div>
        </div>
        <button className="btn btn-primary" onClick={addEmployee}>
          직원 등록
        </button>
      </div>

      <div className="section">
        <div className="section-title">전체 직원 ({employees.length})</div>
        <div className="card" style={{ padding: 0 }}>
          <table>
            <thead>
              <tr>
                <th>이름</th>
                <th>부서</th>
                <th>입사일</th>
                <th>권한</th>
                <th>잔여 연차</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {employees.map((e) => {
                const remaining = Math.max(0, calcAccrued(e.joinDate) - usedLeave(requests, e.id));
                return (
                  <tr key={e.id}>
                    <td className="name-cell">{e.name}</td>
                    <td className="dept-tag">{e.dept}</td>
                    <td>{fmtDate(e.joinDate)}</td>
                    <td>{e.role === "admin" ? <span className="stamp approved">관리자</span> : "직원"}</td>
                    <td>{remaining}일</td>
                    <td style={{ textAlign: "right" }}>
                      <button className="btn-danger-text" onClick={() => removeEmployee(e.id)}>
                        삭제
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default function StaffAdmin({ view, employees, requests, saveEmployees, saveRequests, currentUserId }) {
  if (view === "approvals") {
    return <ApprovalsPanel employees={employees} requests={requests} saveRequests={saveRequests} />;
  }
  return (
    <StaffPanel
      employees={employees}
      requests={requests}
      saveEmployees={saveEmployees}
      currentUserId={currentUserId}
    />
  );
}
